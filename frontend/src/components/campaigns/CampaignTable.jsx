import Card from "../ui/Card";
import CampaignRow from "./CampaignRow";

export default function CampaignTable({ campaigns = [],
  onEdit,
  onDelete,
  onIntelligence,
  onStatusChange, }) {
  return (
    <Card
      title="Campaign Performance"
      subtitle="Monitor budgets, reach and campaign status."
    >
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b border-brand-border">

            <tr>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Campaign
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Budget
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Budget Utilization
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-brand-slate font-semibold">
                Reach
              </th>

              <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-brand-slate font-semibold">
                 Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {campaigns.map((campaign) => (

              <CampaignRow
                key={campaign.id}
                campaign={campaign}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onIntelligence={onIntelligence}
              />

            ))}

          </tbody>

        </table>

      </div>
    </Card>
  );
}