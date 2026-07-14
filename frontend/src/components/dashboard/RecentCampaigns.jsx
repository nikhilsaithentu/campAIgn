export default function RecentCampaigns() {

  const campaigns = [
    {
      name: "Summer Sale",
      status: "Running",
    },
    {
      name: "Festival Offers",
      status: "Scheduled",
    },
    {
      name: "VIP Customers",
      status: "Completed",
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-brand-border shadow-card p-6">

      <h3 className="text-lg font-semibold text-brand-ink mb-6">
        Recent Campaigns
      </h3>

      <div className="space-y-4">

        {campaigns.map((campaign) => (
          <div
            key={campaign.name}
            className="flex justify-between items-center border-b border-brand-border pb-3 last:border-0"
          >
            <div>

              <h4 className="font-medium text-brand-ink">
                {campaign.name}
              </h4>

              <p className="text-sm text-brand-slate">
                Marketing Campaign
              </p>

            </div>

            <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-xs font-medium text-brand-coral">
              {campaign.status}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}