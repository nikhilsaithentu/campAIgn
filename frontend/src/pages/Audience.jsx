import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import StatCard from "../components/dashboard/StatCard";

const CAMPAIGN_COLORS = {
  promotional: "bg-blue-100 text-blue-700",
  retention: "bg-green-100 text-green-700",
  lifecycle: "bg-purple-100 text-purple-700",
  reengagement: "bg-orange-100 text-orange-700",
  awareness: "bg-pink-100 text-pink-700",
};

export default function Targeting() {
  const [scores, setScores] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTargetingScores(),
      api.getCustomers(),
    ])
      .then(([scoreRes, customerRes]) => {
        setScores(scoreRes.data);
        setCustomers(customerRes.data);
      })
      .catch((err) => console.error("Failed to load targeting data:", err))
      .finally(() => setLoading(false));
  }, []);

  const customerMap = useMemo(() => {
    return Object.fromEntries(customers.map((c) => [c.id, c]));
  }, [customers]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading targeting scores...
      </div>
    );
  }

  const avgConfidence =
    scores.reduce((sum, c) => sum + c.confidence, 0) / (scores.length || 1);

  const topSegment = scores[0]?.segment || "-";

  const typeCounts = scores.reduce((acc, s) => {
    acc[s.recommendedCampaignType] =
      (acc[s.recommendedCampaignType] || 0) + 1;
    return acc;
  }, {});

  const topCampaignType =
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Targeting
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Customers Scored"
          value={scores.length}
          color="blue"
        />
        <StatCard
          title="Avg Confidence"
          value={`${(avgConfidence * 100).toFixed(1)}%`}
          color="green"
        />
        <StatCard
          title="Top Campaign Type"
          value={topCampaignType}
          color="purple"
        />
        <StatCard
          title="Highest Value Segment"
          value={topSegment}
          color="orange"
        />
      </div>

      {/* Targeting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((s) => {
          const customer = customerMap[s.customerId];

          return (
            <div
              key={s.customerId}
              className="bg-white rounded-xl shadow p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {customer?.name || s.customerId}
                  </p>

                  <p className="text-sm text-gray-500">
                    {customer?.email}
                  </p>

                  <p className="text-sm text-gray-400">
                    {s.segment}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    CAMPAIGN_COLORS[s.recommendedCampaignType] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.recommendedCampaignType}
                </span>
              </div>

              {/* Score Bars */}
              <div className="space-y-2">
                {Object.entries(s.scores || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, score]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-24 capitalize">
                        {type}
                      </span>

                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>

                      <span className="text-xs text-gray-600 w-10 text-right">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>Channel: {s.preferredChannel}</span>
                <span>Confidence: {(s.confidence * 100).toFixed(0)}%</span>
                <span>
                  LTV: ₹
                  {customer?.lifetimeValue?.toLocaleString() ??
                    s.lifetimeValue?.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}