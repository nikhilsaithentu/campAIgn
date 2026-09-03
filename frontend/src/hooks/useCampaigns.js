import { useEffect, useMemo, useState } from "react";
import campaignService from "../services/campaignService";

export default function useCampaigns() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  // -------------------------------
  // Load Campaigns
  // -------------------------------

  async function refreshCampaigns() {
    try {
      setLoading(true);

      const res = await campaignService.getAll();

      setCampaigns(res.data);
    } catch (err) {
      console.error("Failed to load campaigns", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshCampaigns();
  }, []);

  // -------------------------------
  // Create Campaign
  // -------------------------------

  async function createCampaign(data) {
    try {
      await campaignService.create(data);

      await refreshCampaigns();

      return true;
    } catch (err) {
      console.error("Failed to create campaign", err);
      return false;
    }
  }

  // -------------------------------
  // Update Campaign
  // -------------------------------

  async function updateCampaign(id, data) {
    try {
      await campaignService.update(id, data);

      await refreshCampaigns();

      return true;
    } catch (err) {
      console.error("Failed to update campaign", err);
      return false;
    }
  }

  // -------------------------------
  // Update Status
  // -------------------------------

  async function updateCampaignStatus(id, status) {
    try {
      await campaignService.updateStatus(id, status);

      await refreshCampaigns();

      return true;
    } catch (err) {
      console.error("Failed to update status", err);
      return false;
    }
  }

  // -------------------------------
  // Delete Campaign
  // -------------------------------

  async function deleteCampaign(id) {
    try {
      await campaignService.delete(id);

      await refreshCampaigns();

      return true;
    } catch (err) {
      console.error("Failed to delete campaign", err);
      return false;
    }
  }

  // -------------------------------
  // Filters
  // -------------------------------

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        campaign.status.toLowerCase() === status;

      const matchesType =
        type === "all" ||
        campaign.type.toLowerCase() === type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [campaigns, search, status, type]);

  return {
    loading,

    campaigns: filteredCampaigns,
    totalCampaigns: filteredCampaigns.length,

    search,
    setSearch,

    status,
    setStatus,

    type,
    setType,

    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign,

    refreshCampaigns,
  };
}