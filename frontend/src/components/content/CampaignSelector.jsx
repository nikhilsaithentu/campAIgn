export default function CampaignSelector({
  campaigns = [],
  value,
  audienceCount = 0,
  onChange,
}) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold text-brand-ink">
        Campaign
      </h2>

      <p className="mt-1 text-sm text-brand-slate">
        Select the campaign for which AI will generate content.
      </p>

      <div className="mt-6 space-y-5">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Campaign
          </label>

          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="">
              Select Campaign
            </option>

            {campaigns.map((campaign) => (
              <option
                key={campaign.id}
                value={campaign.id}
              >
                {campaign.name}
              </option>
            ))}

          </select>

        </div>

        <div className="rounded-2xl bg-brand-paper p-5">

          <p className="text-sm text-brand-slate">
            Selected Audience
          </p>

          <h3 className="mt-1 text-3xl font-bold text-brand-ink">
            {audienceCount.toLocaleString()}
          </h3>

          <p className="text-sm text-brand-slate">
            Customers
          </p>

        </div>

      </div>

    </div>
  );
}