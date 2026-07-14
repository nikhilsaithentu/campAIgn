export default function TopChannels({ data = [] }) {
  const sortedChannels = [...data]
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5);

  const maxRevenue = sortedChannels[0]?.total_revenue || 1;

  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-card">

      {/* Header */}

      <div className="border-b border-brand-border px-6 py-5">

        <h2 className="text-xl font-semibold text-brand-ink">
          Top Marketing Channels
        </h2>

        <p className="mt-1 text-sm text-brand-slate">
          Ranked by total revenue generated.
        </p>

      </div>

      {/* Content */}

      <div className="space-y-6 p-6">

        {sortedChannels.map((channel) => {
          const width =
            (channel.total_revenue / maxRevenue) * 100;

          return (
            <div key={channel.channel}>

              <div className="mb-2 flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-brand-ink">
                    {channel.channel}
                  </h3>

                  <p className="text-xs text-brand-slate">
                    {channel.total_conversions.toLocaleString()} conversions
                  </p>

                </div>

                <span className="font-semibold text-brand-coral">
                  ₹{channel.total_revenue.toLocaleString()}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-brand-paper">

                <div
                  className="h-full rounded-full bg-brand-coral transition-all duration-700"
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}