import useDashboard from "../hooks/useDashboard";

import PageHeader from "../components/layout/PageHeader";
import HeroBanner from "../components/dashboard/HeroBanner";
import StatCard from "../components/dashboard/StatCard";
import RecentCampaigns from "../components/dashboard/RecentCampaigns";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import TopChannels from "../components/dashboard/TopChannels";
import AudienceOverview from "../components/dashboard/AudienceOverview";

import RevenueChart from "../components/charts/RevenueChart";
import ChannelChart from "../components/charts/ChannelChart";

import {
  IndianRupee,
  Users,
  Megaphone,
  Target,
} from "lucide-react";

export default function Dashboard() {
  const {
    loading,
    metrics,
    campaigns,
    customers,
    channelData,
    narrative,
    targeting,
  } = useDashboard();

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <PageHeader
        title="Dashboard"
        subtitle="Monitor campaigns, customers and AI-driven insights from one unified workspace."
      />

      {/* Hero Banner */}

      <HeroBanner />

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString()}`}
          subtitle="Across all channels"
          icon={IndianRupee}
          color="green"
        />

        <StatCard
          title="Campaigns"
          value={metrics.activeCampaigns}
          subtitle={`${metrics.totalCampaigns} Total`}
          icon={Megaphone}
          color="blue"
        />

        <StatCard
          title="Customers"
          value={metrics.totalCustomers}
          subtitle="Reachable audience"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Avg Conversion"
          value={`${metrics.avgConversion}%`}
          subtitle={metrics.bestChannel}
          icon={Target}
          color="orange"
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-2">

          <TopChannels
            data={channelData}
          />

          <AudienceOverview
            customers={customers}
          />

      </div>

      {/* Bottom Widgets */}

      <div className="grid gap-6 xl:grid-cols-2">

        <RecentCampaigns
          campaigns={campaigns.slice(0, 5)}
        />

        <AIRecommendations
          narrative={narrative}
          targeting={targeting}
        />

      </div>

    </div>
  );
}