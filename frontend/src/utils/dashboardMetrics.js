export function buildDashboardMetrics({
  campaigns = [],
  customers = [],
  channelAnalytics = [],
}) {
  const totalRevenue = channelAnalytics.reduce(
    (sum, item) => sum + (item.total_revenue || 0),
    0
  );

  const avgConversion =
    channelAnalytics.length > 0
      ? (
          channelAnalytics.reduce(
            (sum, item) => sum + (item.avg_conversion_rate || 0),
            0
          ) / channelAnalytics.length
        ).toFixed(1)
      : 0;

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active"
  ).length;

  const totalCampaigns = campaigns.length;

  const totalCustomers = customers.length;

  const bestChannel =
    [...channelAnalytics].sort(
      (a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)
    )[0]?.channel || "-";

  return {
    totalRevenue,
    avgConversion,
    activeCampaigns,
    totalCampaigns,
    totalCustomers,
    bestChannel,
  };
}