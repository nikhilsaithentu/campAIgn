export default function AudienceTable({
  customers = [],
}) {
  if (!customers.length) {
    return (
      <div className="rounded-3xl border border-brand-border bg-white py-16 text-center shadow-card">

        <h3 className="text-xl font-semibold text-brand-ink">
          No Audience Selected
        </h3>

        <p className="mt-2 text-brand-slate">
          Apply filters or generate an AI audience.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-card">

      <div className="border-b border-brand-border px-6 py-5">

        <h2 className="text-xl font-semibold text-brand-ink">
          Audience Preview
        </h2>

        <p className="mt-1 text-sm text-brand-slate">
          Customers matching your selection.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-brand-paper border-b border-brand-border">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Segment
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Channel
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Purchases
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Lifetime Value
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Confidence
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-b border-brand-border hover:bg-brand-paper/50 transition-colors"
              >

                <td className="px-6 py-5">

                  <div className="font-semibold text-brand-ink">
                    {customer.name}
                  </div>

                </td>

                <td className="px-6 py-5 text-brand-slate">
                  {customer.email}
                </td>

                <td className="px-6 py-5">
                  {customer.segment}
                </td>

                <td className="px-6 py-5 capitalize">
                  {customer.preferredChannel}
                </td>

                <td className="px-6 py-5">
                  {customer.totalPurchases}
                </td>

                <td className="px-6 py-5 font-medium">
                  ₹{customer.lifetimeValue.toLocaleString()}
                </td>

                <td className="px-6 py-5">

                  {customer.confidence != null ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {(customer.confidence * 100).toFixed(0)}%
                    </span>
                  ) : (
                    "-"
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}