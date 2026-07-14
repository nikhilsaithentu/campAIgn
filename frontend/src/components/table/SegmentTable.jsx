export default function SegmentTable({ data }) {
  return (
    <div className="rounded-3xl bg-white border border-brand-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-border">
        <h2 className="text-xl font-semibold text-brand-ink">
          Segment Summary
        </h2>

        <p className="text-sm text-brand-slate mt-1">
          Customer distribution and purchasing behaviour by segment.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-brand-paper border-b border-brand-border">
            <tr>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Segment
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Customers
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Avg LTV
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Avg Purchases
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map((segment, index) => (

              <tr
                key={segment.segment}
                className={`
                  border-b border-brand-border
                  hover:bg-brand-paper/60
                  transition-colors
                  ${index === data.length - 1 ? "border-0" : ""}
                `}
              >

                <td className="px-6 py-5">

                  <span className="font-semibold text-brand-ink">
                    {segment.segment}
                  </span>

                </td>

                <td className="px-6 py-5 text-brand-slate">
                  {segment.customer_count.toLocaleString()}
                </td>

                <td className="px-6 py-5 font-medium text-brand-ink">
                  ₹{segment.avg_lifetime_value?.toLocaleString()}
                </td>

                <td className="px-6 py-5 text-brand-slate">
                  {segment.avg_purchases}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}