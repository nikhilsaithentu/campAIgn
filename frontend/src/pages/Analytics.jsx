import { useEffect, useState } from "react";

import { api } from "../api/api";

import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/dashboard/StatCard";

import RevenueChart from "../components/charts/RevenueChart";
import ConversionChart from "../components/charts/ConversionChart";
import SegmentPieChart from "../components/charts/SegmentPieChart";
import SegmentTable from "../components/table/SegmentTable";

import {
  IndianRupee,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

export default function Analytics() {
  const [channelData, setChannelData] = useState([]);
  const [segmentData, setSegmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getChannelAnalytics(),
      api.getSegmentAnalytics(),
    ])
      .then(([channels, segments]) => {
        setChannelData(channels.data);
        setSegmentData(segments.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        Loading analytics...
      </div>
    );
  }

  const totalRevenue = channelData.reduce(
    (sum, item) => sum + (item.total_revenue || 0),
    0
  );

  const totalConversions = channelData.reduce(
    (sum, item) => sum + (item.total_conversions || 0),
    0
  );

  const bestChannel = channelData.reduce((best, current) =>
    (current.total_revenue || 0) > (best.total_revenue || 0)
      ? current
      : best,
    channelData[0] || {}
  );

  const bestSegment = segmentData.reduce((best, current) =>
    (current.total_lifetime_value || 0) >
    (best.total_lifetime_value || 0)
      ? current
      : best,
    segmentData[0] || {}
  );

  return (
    <div className="space-y-8">

      <PageHeader
        title="Performance Analytics"
        subtitle="Monitor revenue, conversions and customer value across every marketing channel."
      />

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          color="green"
        />

        <StatCard
          title="Best Channel"
          value={bestChannel.channel}
          icon={TrendingUp}
          color="blue"
        />

        <StatCard
          title="Top Segment"
          value={bestSegment.segment}
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Conversions"
          value={totalConversions.toLocaleString()}
          icon={Target}
          color="orange"
        />

      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-2">

        <RevenueChart
          data={channelData}
        />

        <SegmentPieChart
          data={segmentData}
        />

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <ConversionChart
          data={channelData}
        />

        <SegmentTable
          data={segmentData}
        />

      </div>

    </div>
  );
}