import { api } from "../api/api";

const contentService = {
  async generateContent(payload) {
    const res = await api.generateContent(payload);
    return res.data;
  },

  async getCampaignContent(campaignId) {
    const res = await api.getCampaignContent(campaignId);
    return res.data;
  },
};

export default contentService;