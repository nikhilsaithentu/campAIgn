import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

export default function useCampaigns() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await api.getCampaigns();
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" || campaign.status.toLowerCase() === status;

      const matchesType =
        type === "all" || campaign.type.toLowerCase() === type;

      return matchesSearch && matchesStatus && matchesType;
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
  };
}