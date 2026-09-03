import { useState } from "react";
import { toast } from "sonner";

import contentService from "../services/contentService";

export default function useContent() {
  const [loading, setLoading] = useState(false);

  const [generatedContent, setGeneratedContent] = useState(null);

async function generateContent(payload) {
  try {
    setLoading(true);

    const data = await contentService.generateContent(payload);

    setGeneratedContent({
      success: data.success,
      contentId: data.contentId,

      channel: data.channel,

      subject: data.subject,

      body: data.html,

      tone: payload.tone,

      goal: payload.campaignType,
    });

    toast.success("Content generated successfully");

    return true;
  } catch (err) {
    console.error(err);

    console.log(err.response?.data);

    toast.error("Failed to generate content");

    return false;
  } finally {
    setLoading(false);
  }
}

  async function loadCampaignContent(campaignId) {
    try {
      setLoading(true);

      const data = await contentService.getCampaignContent(campaignId);

      setGeneratedContent(data);

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Unable to load campaign content");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function clearContent() {
    setGeneratedContent(null);
  }

  return {
    loading,
    generatedContent,

    generateContent,
    loadCampaignContent,
    clearContent,
  };
}