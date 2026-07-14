import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function useDashboard() {
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
    totalCustomers: 0,
    avgConversion: 0,
    bestChannel: "-",
  });

  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [narrative, setNarrative] = useState(null);
  const [targeting, setTargeting] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          campaignRes,
          customerRes,
          channelRes,
          narrativeRes,
          targetingRes,
        ] = await Promise.all([
          api.getCampaigns(),
          api.getCustomers(),
          api.getChannelAnalytics(),
          api.getPerformanceNarrative(),
          api.getTargetingInsights(),
        ]);

        const campaigns = campaignRes.data;
        const customers = customerRes.data;
        const channels = channelRes.data;

        //----------------------------------------
        // KPI calculations
        //----------------------------------------

        const totalRevenue = channels.reduce(
          (sum, c) => sum + (c.total_revenue || 0),
          0
        );

        const totalConversions = channels.reduce(
          (sum, c) => sum + (c.total_conversions || 0),
          0
        );

        const avgConversion =
          channels.length > 0
            ? (
                channels.reduce(
                  (sum, c) => sum + (c.avg_conversion_rate || 0),
                  0
                ) / channels.length
              ).toFixed(1)
            : 0;

        const activeCampaigns = campaigns.filter(
          (c) => c.status === "active"
        ).length;

        const bestChannel =
          [...channels].sort(
            (a, b) => b.total_revenue - a.total_revenue
          )[0]?.channel || "-";

        setMetrics({
          totalRevenue,
          activeCampaigns,
          totalCampaigns: campaigns.length,
          totalCustomers: customers.length,
          avgConversion,
          bestChannel,
          totalConversions,
        });

        //----------------------------------------
        // Other Dashboard Data
        //----------------------------------------

        setCampaigns(campaigns);
        setCustomers(customers);

        setChannelData(channels);

        setNarrative(narrativeRes.data);

        //setTargeting(targetingRes.data);
        //console.log("Narrative API:", narrativeRes.data);
      } catch (err) {
        console.error("Dashboard Load Failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

 return {
  loading,
  metrics,
  campaigns,
  customers,
  channelData,
  narrative,
  targeting,
};
}