import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#FF5A47", // Signal Coral
  "#14152B", // Ink
  "#6E7080", // Slate
  "#FF8C7D", // Coral Light
  "#A7A9B6", // Light Slate
];

export default function SegmentPieChart({ data }) {
  return (
    <div className="rounded-3xl bg-white border border-brand-border shadow-card p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brand-ink">
          Customer Lifetime Value
        </h2>

        <p className="text-sm text-brand-slate mt-1">
          Distribution of lifetime value across customer segments.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total_lifetime_value"
            nameKey="segment"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={55}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.segment}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [
              `₹${value.toLocaleString()}`,
              "Lifetime Value",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              paddingTop: 20,
              fontSize: "13px",
              color: "#6E7080",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}