"""
build_kb.py
============
Builds the RAG knowledge base using LangChain.
Run once to build, then nightly to refresh dynamic data.
"""

import os
import shutil
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

MONGO_URI      = os.getenv("MONGO_URI")
DB_NAME        = "marketing_platform"
KNOWLEDGE_FILE = "marketing_knowledge.txt"
CHROMA_DIR     = "./chroma_db"

# ─────────────────────────────────────────────
# LAYER 1 — STATIC KNOWLEDGE
# ─────────────────────────────────────────────

def load_static_documents():
    print("\n📄 Loading static knowledge base...")
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", ". "]
    )

    chunks = splitter.create_documents(
        texts=[text],
        metadatas=[{"source": "static", "file": KNOWLEDGE_FILE}]
    )

    print(f"   ✅ {len(chunks)} static chunks created")
    return chunks

# ─────────────────────────────────────────────
# LAYER 2 — DYNAMIC MONGODB DATA
# ─────────────────────────────────────────────

def doc_to_text(doc, domain):
    """Convert a MongoDB document to natural language text."""

    if domain == "campaign":
        return f"""Campaign: {doc.get('name')} (ID: {doc.get('id')})
Type: {doc.get('type')} | Status: {doc.get('status')} | Goal: {doc.get('goal')}
Description: {doc.get('description')}
Target segments: {', '.join(doc.get('targetSegments', []))}
Channels: {', '.join(doc.get('channels', []))}
Budget: Rs {doc.get('budget', 0):,} | Spent: Rs {doc.get('spentSoFar', 0):,}
Target reach: {doc.get('targetReach', 0):,} | Actual reach: {doc.get('actualReach', 0):,}
Start: {doc.get('startDate')} | End: {doc.get('endDate')}"""

    elif domain == "campaign_analytics":
        return f"""Campaign Analytics: {doc.get('name')} (ID: {doc.get('id')})
Budget utilisation: {doc.get('budgetUtilisation')}% | Reach efficiency: {doc.get('reachEfficiency')}%
Budget: Rs {doc.get('budget', 0):,} | Spent: Rs {doc.get('spentSoFar', 0):,}
Target reach: {doc.get('targetReach', 0):,} | Actual reach: {doc.get('actualReach', 0):,}
Week: {doc.get('week')}"""

    elif domain == "channel_analytics":
        return f"""Channel Performance: {doc.get('channel', '').upper()}
Total revenue: Rs {doc.get('total_revenue', 0):,}
Average conversion rate: {doc.get('avg_conversion_rate')}%
Average click rate: {doc.get('avg_click_rate')}%
Total conversions: {doc.get('total_conversions', 0):,}
Week: {doc.get('week')}"""

    elif domain == "segment_analytics":
        return f"""Customer Segment: {doc.get('segment')}
Customers: {doc.get('customer_count')}
Average lifetime value: Rs {doc.get('avg_lifetime_value', 0):,}
Total lifetime value: Rs {doc.get('total_lifetime_value', 0):,}
Average purchases: {doc.get('avg_purchases')}
Week: {doc.get('week')}"""

    elif domain == "targeting":
        scores = doc.get('scores', {})
        scores_text = ' | '.join([f"{k}: {v:.0%}" for k, v in scores.items()])
        return f"""ML Targeting: Customer {doc.get('customerId')}
Segment: {doc.get('segment')} | Preferred channel: {doc.get('preferredChannel')}
Lifetime value: Rs {doc.get('lifetimeValue', 0):,}
Recommended campaign: {doc.get('recommendedCampaignType')}
Confidence: {doc.get('confidence', 0):.0%}
Scores: {scores_text}"""

    elif domain == "ai_insight":
        t = doc.get('type', '')
        if t == 'performance_narrative':
            return f"AI Performance Insight (Week {doc.get('week')}): {doc.get('narrative', '')}"
        elif t == 'segment_insights':
            return f"AI Segment Insight (Week {doc.get('week')}): {doc.get('insights', '')}"
        elif t == 'targeting':
            return f"""AI Targeting Recommendation: Customer {doc.get('customerId')}
Segment: {doc.get('segment')} | Recommended: {doc.get('recommendedCampaignType')}
Confidence: {doc.get('confidence', 0):.0%}
Recommendation: {doc.get('recommendation', '')}"""
        return ""

    elif domain == "intelligence":
        analysis = doc.get('analysis', {})
        return f"""Campaign Intelligence: {doc.get('campaignName')} ({doc.get('campaignId')})
Health: {doc.get('health', '').replace('_', ' ').title()} (Score: {doc.get('healthScore')}/100)
On track: {'Yes' if doc.get('onTrack') else 'No'}
Budget utilisation: {doc.get('metrics', {}).get('budgetUtilisation')}%
Reach efficiency: {doc.get('metrics', {}).get('reachEfficiency')}%
Days remaining: {doc.get('metrics', {}).get('daysRemaining')}
Projected reach: {doc.get('metrics', {}).get('projectedReach', 0):,}
Assessment: {analysis.get('amIDoingItRight', '')}
What is working: {analysis.get('whatIsWorking', '')}
Recommendations: {analysis.get('bestICanDo', '')}
Forecast: {analysis.get('goalForecast', '')}"""

    return ""


def load_dynamic_documents():
    print("\n📦 Loading dynamic documents from MongoDB...")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    collections = {
        "campaigns":             "campaign",
        "analytics_campaign":    "campaign_analytics",
        "analytics_channel":     "channel_analytics",
        "analytics_segment":     "segment_analytics",
        "targeting_scores":      "targeting",
        "ai_insights":           "ai_insight",
        "campaign_intelligence": "intelligence",
    }

    documents = []

    for collection, domain in collections.items():
        docs = list(db[collection].find({}, {"_id": 0}))
        for doc in docs:
            text = doc_to_text(doc, domain)
            if not text or len(text) < 30:
                continue

            doc_id = (
                doc.get('id') or doc.get('customerId') or
                doc.get('campaignId') or doc.get('channel') or
                doc.get('segment') or doc.get('type') or "unknown"
            )

            documents.append(Document(
                page_content=text,
                metadata={
                    "source":     "dynamic",
                    "collection": collection,
                    "domain":     domain,
                    "doc_id":     str(doc_id),
                    "refreshed":  datetime.now().isoformat()
                }
            ))

        print(f"   ✅ {collection}: {len(docs)} documents")

    client.close()
    print(f"   ✅ {len(documents)} total dynamic documents loaded")
    return documents


# ─────────────────────────────────────────────
# BUILD CHROMADB
# ─────────────────────────────────────────────

def build_knowledge_base():
    print("\n" + "=" * 60)
    print("BUILDING RAG KNOWLEDGE BASE")
    print("=" * 60)

    static_docs  = load_static_documents()
    dynamic_docs = load_dynamic_documents()
    all_docs = static_docs + dynamic_docs

    print(f"\n📊 Total documents: {len(all_docs)}")
    print(f"   Static:  {len(static_docs)}")
    print(f"   Dynamic: {len(dynamic_docs)}")

    # Load embedding model
    print("\n🔢 Loading embedding model (SentenceTransformer)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"}
    )
    print("   ✅ Embedding model loaded")

    # Rebuild ChromaDB fresh
    print("\n💾 Building ChromaDB vector store...")
    if os.path.exists(CHROMA_DIR):
        shutil.rmtree(CHROMA_DIR)
        print("   🗑️  Cleared existing ChromaDB")

    vectorstore = Chroma.from_documents(
        documents=all_docs,
        embedding=embeddings,
        persist_directory=CHROMA_DIR
    )

    print(f"   ✅ ChromaDB built with {len(all_docs)} documents")
    print(f"   📁 Persisted to {CHROMA_DIR}")
    print("\n✅ Knowledge base ready!")
    return vectorstore


if __name__ == "__main__":
    build_knowledge_base()