import { api } from "../api/api";

const campaignService = {
  // Get all campaigns
  async getAll() {
    return await api.getCampaigns();
  },

  // Get campaign by ID
  async getById(id) {
    return await api.getCampaign(id);
  },

  // Create campaign
  async create(data) {
    return await api.createCampaign(data);
  },

  // Update campaign
  async update(id, data) {
    return await api.updateCampaign(id, data);
  },

  // Update campaign status
  async updateStatus(id, status) {
    return await api.updateCampaignStatus(id, status);
  },

  // Delete campaign
  async delete(id) {
    return await api.deleteCampaign(id);
  },
};

export default campaignService;