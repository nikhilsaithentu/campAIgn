import { useEffect, useState } from "react";
import { toast } from "sonner";

import audienceService from "../services/audienceService";

export default function useAudience() {
  const [loading, setLoading] = useState(true);

  const [segments, setSegments] = useState([]);
  const [channels, setChannels] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);

  async function loadSegments() {
    try {
      const data = await audienceService.getSegments();

      setSegments(data.segments);
      setChannels(data.channels);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load audience metadata");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSegments();
  }, []);

  async function filterAudience(filters) {
    try {
      const data = await audienceService.filterAudience(filters);

      setCustomers(data.customers);
      setCount(data.count);

      toast.success(`${data.count} customers matched`);

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Audience filtering failed");
      return false;
    }
  }

  async function autoSelectAudience(payload) {
    try {
      const data = await audienceService.autoSelectAudience(payload);

      setCustomers(data.customers);
      setCount(data.count);

      toast.success(`${data.count} customers recommended`);

      return true;
    } catch (err) {
      console.error(err);
      toast.error("AI audience selection failed");
      return false;
    }
  }

  function clearAudience() {
    setCustomers([]);
    setCount(0);
  }

  return {
    loading,

    segments,
    channels,

    customers,
    count,

    filterAudience,
    autoSelectAudience,
    clearAudience,
  };
}