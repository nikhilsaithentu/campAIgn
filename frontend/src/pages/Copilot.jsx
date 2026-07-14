import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

const CAMPAIGN_COLORS = {
  promotional: "bg-blue-100 text-blue-700",
  retention: "bg-green-100 text-green-700",
  lifecycle: "bg-purple-100 text-purple-700",
  reengagement: "bg-orange-100 text-orange-700",
  awareness: "bg-pink-100 text-pink-700",
};

export default function Insights() {
  const [targeting, setTargeting] = useState([]);
  const [narrative, setNarrative] = useState(null);
  const [segments, setSegments] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTargetingInsights(),
      api.getPerformanceNarrative(),
      api.getSegmentInsights(),
      api.getCustomers(),
    ])
      .then(([t, n, s, c]) => {
        setTargeting(t.data);
        setNarrative(n.data);
        setSegments(s.data);
        setCustomers(c.data);
      })
      .catch((err) => {
        console.error("Failed to load AI insights:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Create a lookup map for customers by ID
  const customerMap = useMemo(() => {
    return Object.fromEntries(customers.map((c) => [c.id, c]));
  }, [customers]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading AI insights...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        AI Insights
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Powered by Groq · Llama 4 Scout
      </p>

      {/* Performance Narrative */}
      {narrative && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <h2 className="font-semibold text-gray-700">
              Campaign Performance Summary
            </h2>
            <span className="ml-auto text-xs text-gray-400">
              Generated{" "}
              {new Date(narrative.generatedAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {narrative.narrative}
          </p>
        </div>
      )}

      {/* Segment Insights */}
      {segments && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h2 className="font-semibold text-gray-700">
              Segment Strategy Insights
            </h2>
          </div>

          <div className="space-y-2">
            {segments.insights
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">→</span>
                  <p className="text-gray-700">{line}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Targeting Recommendations */}
      <h2 className="font-semibold text-gray-700 mb-4">
        🎯 Customer Targeting Recommendations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targeting.map((t) => {
          const customer = customerMap[t.customerId];

          return (
            <div
              key={t.customerId}
              className="bg-white rounded-xl shadow p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {customer?.name || t.customerId}
                  </p>

                  <p className="text-sm text-gray-500">
                    {customer?.email}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {t.segment}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    CAMPAIGN_COLORS[t.recommendedCampaignType] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.recommendedCampaignType}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {t.recommendation}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>
                  Confidence: {(t.confidence * 100).toFixed(0)}%
                </span>

                <span>
                  LTV: ₹
                  {customer?.lifetimeValue?.toLocaleString() ?? "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}