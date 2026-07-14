import {
  IndianRupee,
  Megaphone,
  Users,
  Target,
} from "lucide-react";

import StatCard from "./StatCard";

export default function KPIGrid({ metrics }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Revenue"
        value={`₹${metrics.totalRevenue?.toLocaleString()}`}
        icon={IndianRupee}
      />

      <StatCard
        title="Campaigns"
        value={metrics.activeCampaigns}
        subtitle={`${metrics.totalCampaigns} Total`}
        icon={Megaphone}
      />

      <StatCard
        title="Customers"
        value={metrics.totalCustomers}
        icon={Users}
      />

      <StatCard
        title="Avg Conversion"
        value={`${metrics.avgConversion}%`}
        subtitle={metrics.bestChannel}
        icon={Target}
      />

    </div>
  );
}