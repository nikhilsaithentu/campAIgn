import { TrendingUp } from "lucide-react";

export default function MarketingHealth() {
  const score = 92;

  return (
    <div className="rounded-3xl bg-brand-ink text-white shadow-card p-8">
      <div className="flex justify-between items-start">

        <div>

          <p className="text-brand-coral font-semibold uppercase tracking-wider">
            Marketing Health
          </p>

          <h2 className="mt-4 text-6xl font-bold">
            {score}
            <span className="text-3xl text-white/60">/100</span>
          </h2>

          <p className="mt-3 text-white/70">
            Overall platform performance based on revenue,
            campaigns, conversions and AI insights.
          </p>

        </div>

        <div className="rounded-2xl bg-brand-coral p-4">
          <TrendingUp size={32} />
        </div>

      </div>

      <div className="mt-8 h-3 rounded-full bg-white/10 overflow-hidden">

        <div
          className="h-full rounded-full bg-brand-coral"
          style={{ width: `${score}%` }}
        />

      </div>
    </div>
  );
}