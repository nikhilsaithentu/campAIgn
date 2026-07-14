import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

export const api = {
  // Campaigns
  getCampaigns: () => axios.get(`${BASE_URL}/campaigns`),
  getCampaignAnalytics: () => axios.get(`${BASE_URL}/campaigns/analytics`),

  // Customers
  getCustomers: () => axios.get(`${BASE_URL}/customers`),
  getTargetingScores: () => axios.get(`${BASE_URL}/customers/targeting`),

  // Analytics
  getChannelAnalytics: () => axios.get(`${BASE_URL}/analytics/channel`),
  getSegmentAnalytics: () => axios.get(`${BASE_URL}/analytics/segment`),
  getChannelSegmentAnalytics: () => axios.get(`${BASE_URL}/analytics/channel-segment`),

  // AI Insights
  getTargetingInsights: () => axios.get(`${BASE_URL}/insights/targeting`),
  getPerformanceNarrative: () => axios.get(`${BASE_URL}/insights/narrative`),
  getSegmentInsights: () => axios.get(`${BASE_URL}/insights/segments`),
}
