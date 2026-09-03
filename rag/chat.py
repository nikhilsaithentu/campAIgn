"""
chat.py
========
FastAPI RAG chatbot server.
Node.js backend calls POST /chat to get responses.
"""

import os

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List, Optional

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from langchain_groq import ChatGroq

from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferWindowMemory

from langchain_core.prompts import PromptTemplate

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CHROMA_DIR   = "./chroma_db"

app = FastAPI(title="Marketing Platform RAG Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Session memory store
session_memories = {}

# Load once on startup
print("🔢 Loading embedding model...")
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"}
)
print("✅ Embedding model loaded")

print("💾 Loading ChromaDB...")
vectorstore = Chroma(
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings
)
print("✅ ChromaDB loaded")

print("🤖 Loading Groq LLM...")
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model_name="openai/gpt-oss-20b",
    temperature=0.7,
    max_tokens=600
)
print("✅ Groq LLM loaded")

SYSTEM_PROMPT = """You are an intelligent marketing assistant for a Unified Marketing Automation Platform.
You have access to the platform's live campaign data, customer analytics, ML targeting scores, and marketing domain knowledge.

Use the following retrieved context to answer the question.
If the context does not contain enough information, say so honestly — do not make up data.
Always be specific — reference actual campaign names, numbers, and segments from the context.
Keep answers concise and actionable.

Context:
{context}

Chat History:
{chat_history}

Question: {question}

Answer:"""

QA_PROMPT = PromptTemplate(
    input_variables=["context", "chat_history", "question"],
    template=SYSTEM_PROMPT
)

# ─────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    sources: Optional[List[str]] = []

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def get_memory(session_id: str) -> ConversationBufferWindowMemory:
    if session_id not in session_memories:
        session_memories[session_id] = ConversationBufferWindowMemory(
            k=5,
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
    return session_memories[session_id]

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "vectorstore_docs": vectorstore._collection.count(),
        "active_sessions": len(session_memories)
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        memory = get_memory(request.session_id)

        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 5}
            ),
            memory=memory,
            combine_docs_chain_kwargs={"prompt": QA_PROMPT},
            return_source_documents=True,
            verbose=False
        )

        result = chain.invoke({"question": request.message})

        sources = []
        for doc in result.get("source_documents", []):
            meta = doc.metadata
            source = meta.get("collection") or meta.get("file") or meta.get("source")
            if source and source not in sources:
                sources.append(source)

        return ChatResponse(
            reply=result["answer"],
            session_id=request.session_id,
            sources=sources
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/session/{session_id}")
def clear_session(session_id: str):
    if session_id in session_memories:
        del session_memories[session_id]
        return {"cleared": True, "session_id": session_id}
    return {"cleared": False, "session_id": session_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)