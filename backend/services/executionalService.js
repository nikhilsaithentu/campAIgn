import { api } from "../api/api";

const executionService = {
  async send(channel, payload) {
    if (channel === "sms") {
      const res = await api.sendSMS(payload);
      return res.data;
    }

    const res = await api.sendEmail(payload);
    return res.data;
  },

  async schedule(channel, payload) {
    if (channel === "sms") {
      const res = await api.scheduleSMS(payload);
      return res.data;
    }

    const res = await api.scheduleEmail(payload);
    return res.data;
  },
};

export default executionService;