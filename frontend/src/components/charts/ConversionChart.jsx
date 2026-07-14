import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ConversionChart({ data }) {
  return (
    <div className="rounded-3xl bg-white border border-brand-border shadow-card p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-ink">
          Conversion Rate by Channel
        </h2>

        <p className="text-sm text-brand-slate mt-1">
          Average conversion rate across your marketing channels.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid
            stroke="#E7E8EE"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="channel"
            tick={{
              fill: "#6E7080",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "#6E7080",
              fontSize: 12,
            }}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{
              fill: "#FAFAF8",
            }}
            formatter={(value) => [`${value}%`, "Conversion Rate"]}
          />

          <Bar
            dataKey="avg_conversion_rate"
            fill="#14152B"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}