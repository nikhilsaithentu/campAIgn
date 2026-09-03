import { api } from "../api/api";

const audienceService = {
  async getSegments() {
    const res = await api.getAudienceSegments();
    return res.data;
  },

  async filterAudience(filters) {
    const res = await api.filterAudience(filters);

    return {
      count: res.data.count,
      customers: res.data.customers,
      filters: res.data.filters,
    };
  },

  async autoSelectAudience(payload) {
    const res = await api.autoSelectAudience(payload);

    return {
      count: res.data.count,
      customers: res.data.audience,
      campaignType: res.data.campaignType,
      minConfidence: res.data.minConfidence,
    };
  },
};

export default audienceService;