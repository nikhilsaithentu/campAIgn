import { api } from "../api/api";

const executionService = {
  async send(channel, payload) {
    const res =
      channel === "sms"
        ? await api.sendSMS(payload)
        : await api.sendEmail(payload);

    return res.data;
  },

  async schedule(channel, payload) {
    const res =
      channel === "sms"
        ? await api.scheduleSMS(payload)
        : await api.scheduleEmail(payload);

    return res.data;
  },

  async getScheduledJobs() {
    const res = await api.getScheduledJobs();
    return res.data;
  },

  async cancelJob(id) {
    const res = await api.cancelScheduledJob(id);
    return res.data;
  },

  async getEmailLogs() {
    const res = await api.getEmailLogs();
    return res.data;
  },

  async getSMSLogs() {
    const res = await api.getSMSLogs();
    return res.data;
  },
};

export default executionService;