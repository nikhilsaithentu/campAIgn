import StatusBadge from "./StatusBadge";
import BudgetProgress from "./BudgetProgress";
import ReachProgress from "./ReachProgress";
import ChannelBadges from "./ChannelBadges";

function formatGoal(goal) {
  return goal
    ?.replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CampaignRow({ campaign }) {
  return (
    <tr
      className="
      border-b
      border-brand-border
      hover:bg-brand-paper/60
      transition-colors
      cursor-pointer"
    >
      {/* Campaign */}

      <td className="px-6 py-5">

        <h3 className="font-semibold text-brand-ink">
          {campaign.name}
        </h3>

        <p className="text-sm text-brand-slate capitalize">
          {campaign.type} Campaign
        </p>

      </td>

      {/* Status */}

      <td className="px-6 py-5">
        <StatusBadge status={campaign.status} />
      </td>

      {/* Goal */}

      <td className="px-6 py-5">

        <span className="font-medium text-brand-ink">
          {formatGoal(campaign.goal)}
        </span>

      </td>

      {/* Channels */}

      <td className="px-6 py-5">

        <ChannelBadges
          channels={campaign.channels}
        />

      </td>

      {/* Budget */}

      <td className="px-6 py-5">

        <BudgetProgress
          spent={campaign.spentSoFar}
          budget={campaign.budget}
        />

      </td>

      {/* Reach */}

      <td className="px-6 py-5">

        <ReachProgress
          actual={campaign.actualReach}
          target={campaign.targetReach}
        />

      </td>

      {/* Duration */}

      <td className="px-6 py-5 whitespace-nowrap">

        <div className="text-sm">

          <div className="font-medium text-brand-ink">
            {formatDate(campaign.startDate)}
          </div>

          <div className="text-brand-slate">
            {formatDate(campaign.endDate)}
          </div>

        </div>

      </td>

    </tr>
  );
}