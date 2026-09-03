import { useState } from "react";
import { toast } from "sonner";

import chatService from "../services/chatService";

function createSessionId() {
  return `chat-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState(
    createSessionId()
  );

  async function sendMessage(message) {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {
      const data = await chatService.sendMessage(
        message,
        sessionId
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        sources: data.sources || [],
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      // Keep whatever session ID the backend returns.
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.error ||
        "Unable to connect to AI assistant"
      );

    } finally {
      setLoading(false);
    }
  }

  async function clearConversation() {
    try {
      await chatService.clearSession(sessionId);
    } catch (err) {
      console.error(err);
    }

    setMessages([]);
    setSessionId(createSessionId());
  }

  return {
    messages,
    loading,
    sessionId,
    sendMessage,
    clearConversation,
  };
}