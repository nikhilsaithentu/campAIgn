import { api } from "../api/api";

const chatService = {
  async sendMessage(message, sessionId) {
    const res = await api.sendChatMessage(
      message,
      sessionId
    );

    return res.data;
  },

  async clearSession(sessionId) {
    const res = await api.clearChatSession(sessionId);

    return res.data;
  },
};

export default chatService;