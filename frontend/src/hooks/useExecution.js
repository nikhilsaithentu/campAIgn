import { useState } from "react";
import { toast } from "sonner";

import executionService from "../services/executionService";

export default function useExecution() {
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [smsLogs, setSMSLogs] = useState([]);

  async function sendCampaign(channel, payload) {
    try {
      const res = await executionService.send(channel, payload);

      toast.success(res.message || "Campaign sent");

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Unable to send campaign");
      return false;
    }
  }

  async function scheduleCampaign(channel, payload) {
    try {
      const res = await executionService.schedule(channel, payload);

      toast.success(res.message || "Campaign scheduled");

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Unable to schedule campaign");
      return false;
    }
  }

  async function loadScheduledJobs() {
    try {
      const data = await executionService.getScheduledJobs();
      setScheduledJobs(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function cancelJob(id) {
    try {
      await executionService.cancelJob(id);

      toast.success("Job cancelled");

      loadScheduledJobs();
    } catch (err) {
      console.error(err);
      toast.error("Unable to cancel job");
    }
  }

  async function loadEmailLogs() {
    try {
      const data = await executionService.getEmailLogs();
      setEmailLogs(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadSMSLogs() {
    try {
      const data = await executionService.getSMSLogs();
      setSMSLogs(data);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    scheduledJobs,
    emailLogs,
    smsLogs,

    sendCampaign,
    scheduleCampaign,

    loadScheduledJobs,
    cancelJob,

    loadEmailLogs,
    loadSMSLogs,
  };
}