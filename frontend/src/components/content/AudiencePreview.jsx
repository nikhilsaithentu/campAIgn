export default function AudiencePreview({
  customers = [],
  count = 0,
}) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Selected Audience
        </h2>

        <span className="rounded-full bg-brand-coral px-4 py-2 text-white text-sm font-semibold">
          {count}
        </span>

      </div>

      {count === 0 ? (

        <div className="py-10 text-center text-brand-slate">
          No audience selected
        </div>

      ) : (

        <div className="mt-5 space-y-3">

          {customers.slice(0, 5).map((customer) => (

            <div
              key={customer.id}
              className="flex items-center justify-between rounded-xl border border-brand-border p-3"
            >

              <div>

                <div className="font-semibold">
                  {customer.name}
                </div>

                <div className="text-sm text-brand-slate">
                  {customer.email}
                </div>

              </div>

              <div className="text-sm text-brand-slate">
                {customer.segment}
              </div>

            </div>

          ))}

          {count > 5 && (

            <div className="pt-2 text-center text-brand-slate">
              + {count - 5} more customers
            </div>

          )}

        </div>

      )}

    </div>
  );
}