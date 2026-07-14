import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ChannelChart({ data = [] }) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      {/* Header */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-ink">
          Revenue by Channel
        </h2>

        <p className="text-sm text-brand-slate mt-1">
          Compare revenue generated across marketing channels.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>

          <CartesianGrid
            stroke="#E7E8EE"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="channel"
            tick={{
              fill: "#6E7080",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#6E7080",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString()}`,
              "Revenue",
            ]}
          />

          <Bar
            dataKey="total_revenue"
            fill="#14152B"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}