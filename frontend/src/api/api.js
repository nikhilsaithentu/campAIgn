import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {

  // ==========================================================
  // Campaigns
  // ==========================================================

  getCampaigns: () =>
    axios.get(`${BASE_URL}/campaigns`),

  getCampaign: (id) =>
    axios.get(`${BASE_URL}/campaigns/${id}`),

  getCampaignAnalytics: () =>
    axios.get(`${BASE_URL}/campaigns/analytics`),

  createCampaign: (data) =>
    axios.post(`${BASE_URL}/campaigns/create`, data),

  updateCampaign: (id, data) =>
    axios.patch(`${BASE_URL}/campaigns/${id}`, data),

  updateCampaignStatus: (id, status) =>
    axios.patch(`${BASE_URL}/campaigns/${id}/status`, {
      status,
    }),

  deleteCampaign: (id) =>
    axios.delete(`${BASE_URL}/campaigns/${id}`),

  // ==========================================================
  // Customers
  // ==========================================================

  getCustomers: () =>
    axios.get(`${BASE_URL}/customers`),

  getTargetingScores: () =>
    axios.get(`${BASE_URL}/customers/targeting`),

  // ==========================================================
  // Analytics
  // ==========================================================

  getChannelAnalytics: () =>
    axios.get(`${BASE_URL}/analytics/channel`),

  getSegmentAnalytics: () =>
    axios.get(`${BASE_URL}/analytics/segment`),

  getChannelSegmentAnalytics: () =>
    axios.get(`${BASE_URL}/analytics/channel-segment`),

  // ==========================================================
  // AI Insights
  // ==========================================================

  getTargetingInsights: () =>
    axios.get(`${BASE_URL}/insights/targeting`),

  getPerformanceNarrative: () =>
    axios.get(`${BASE_URL}/insights/narrative`),

  getSegmentInsights: () =>
    axios.get(`${BASE_URL}/insights/segments`),

getCampaignIntelligence: (campaignId, refresh = false) =>
  axios.get(`${BASE_URL}/intelligence/${campaignId}`, {
    params: refresh ? { refresh: true } : {},
  }),

  // ==========================================================
  // Audience
  // ==========================================================

  filterAudience: (data) =>
    axios.post(`${BASE_URL}/audience/filter`, data),

  autoSelectAudience: (data) =>
    axios.post(`${BASE_URL}/audience/auto-select`, data),

  getAudienceSegments: () =>
    axios.get(`${BASE_URL}/audience/segments`),

  // ==========================================================
  // Content
  // ==========================================================

  generateContent: (data) =>
    axios.post(`${BASE_URL}/content/generate`, data),

  getCampaignContent: (campaignId) =>
    axios.get(`${BASE_URL}/content/${campaignId}`),

  // ==========================================================
  // Email
  // ==========================================================

  sendEmail: (data) =>
    axios.post(`${BASE_URL}/execute/email/send`, data),

  scheduleEmail: (data) =>
    axios.post(`${BASE_URL}/execute/email/schedule`, data),

  // ==========================================================
  // SMS
  // ==========================================================

  sendSMS: (data) =>
    axios.post(`${BASE_URL}/execute/sms/send`, data),

  scheduleSMS: (data) =>
    axios.post(`${BASE_URL}/execute/sms/schedule`, data),

  getScheduledJobs: () =>
    axios.get(`${BASE_URL}/execute/scheduled`),

  cancelScheduledJob: (id) =>
    axios.delete(`${BASE_URL}/execute/scheduled/${id}`),

  getEmailLogs: () =>
    axios.get(`${BASE_URL}/execute/logs/email`),

  getSMSLogs: () =>
    axios.get(`${BASE_URL}/execute/logs/sms`),

  // ==========================================================
  // Chatbot
  // ==========================================================

  sendChatMessage: (message, sessionId) =>
    axios.post(`${BASE_URL}/chat`, {
      message,
      sessionId,
    }),

  clearChatSession: (sessionId) =>
    axios.delete(`${BASE_URL}/chat/session/${sessionId}`),
};