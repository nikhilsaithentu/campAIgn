import { useEffect, useState } from "react";

import CampaignSelector from "./CampaignSelector";
import PromptPanel from "./PromptPanel";
import EmailEditor from "./EmailEditor";
import ContentToolbar from "./ContentToolbar";
import SendCampaignModal from "./SendCampaignModal";
import useExecution from "../../hooks/useExecution";
import AudienceSelector from "./AudienceSelector";
import AudiencePreview from "./AudiencePreview";
import CampaignSettings from "./CampaignSettings";
import AudienceModal from "./AudienceModal";
import useAudience from "../../hooks/useAudience";
import ScheduleCampaignModal from "./ScheduleCampaignModal";

import { api } from "../../api/api";
import useContent from "../../hooks/useContent";

import { toast } from "sonner";

export default function ContentWorkspace() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [openSend, setOpenSend] = useState(false);
  const [editableContent, setEditableContent] = useState({});
  const [openAudience, setOpenAudience] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const {
    loading,
    generatedContent,
    generateContent,
  } = useContent();
  const {
  sendCampaign,
  scheduleCampaign,
} = useExecution();

  const audience = useAudience();
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await api.getCampaigns();
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadCampaigns();
  }, []);

  const selected = campaigns.find(
    (c) => c.id === selectedCampaign
  );
  useEffect(() => {
  if (!selected) {
    audience.clearAudience();
    return;
  }

  audience.autoSelectAudience({
    campaignType: selected.type,
    minConfidence: 0.5,
  });
}, [selected]);

 async function handleGenerate(data) {
  if (!selectedCampaign) {
    toast.error("Please select a campaign");
    return;
  }

  const campaign = campaigns.find(
    (c) => c.id === selectedCampaign
  );

  const payload = {
    campaignId: campaign.id,
    campaignType: campaign.type,
    channel: data.channel,
    segment: audience.customers[0]?.segment ||
    campaign.targetSegments?.[0] ||
    "",
    tone: data.tone,
  };

  console.log("Payload:", payload);

  await generateContent(payload);
}

  function handleSave() {
    toast.success("Content saved");
  }
  async function handleSend() {
  setOpenSend(true);
  }

  async function confirmSend() {
    const payload = {
  campaignId: selectedCampaign,

  customerIds: audience.customers.map(
    (customer) => customer.id
  ),

  subject:
    editableContent.subject ||
    generatedContent.subject,

  html:
    editableContent.body ||
    generatedContent.body,
};

console.log(payload);

const success = await sendCampaign(
  generatedContent.channel,
  payload
);

   if (success) {
    setOpenSend(false);
  }
}

function handleSchedule() {
  setOpenSchedule(true);
}
async function confirmSchedule(scheduledAt) {
    const payload = {
        campaignId: selectedCampaign,

        customerIds: audience.customers.map(
            c => c.id
        ),

        subject:
            editableContent.subject ||
            generatedContent.subject,

        html:
            editableContent.body ||
            generatedContent.body,

        scheduledAt,
    };

    const success = await scheduleCampaign(
        generatedContent.channel,
        payload
    );

    if (success) {
        setOpenSchedule(false);
    }
}
  return (
    <div className="space-y-6">

      <div className="grid gap-6 xl:grid-cols-5">

  {/* LEFT */}

    <div className="xl:col-span-2">

        <CampaignSettings
            campaigns={campaigns}
            selectedCampaign={selectedCampaign}
            setSelectedCampaign={setSelectedCampaign}
            campaign={selected}
            audience={audience}
            onGenerate={handleGenerate}
            onViewAudience={() => setOpenAudience(true)}
        />

    </div>  
        {/* RIGHT */}

        <div className="xl:col-span-3">

          <EmailEditor
            content={generatedContent}
            loading={loading}
            onChange={setEditableContent}
        />
           <ContentToolbar
            content={generatedContent}
            onSave={handleSave}
            onSend={handleSend}
            onSchedule={handleSchedule}
          />

        </div>

      </div>

     
      <SendCampaignModal
        open={openSend}
        onClose={() => setOpenSend(false)}
        onSend={confirmSend}
        campaign={selected}
        audienceCount={audience.count}
        content={editableContent}
    />
    <AudienceModal
        open={openAudience}
        onClose={() => setOpenAudience(false)}
        customers={audience.customers}
        count={audience.count}
     />
     <ScheduleCampaignModal
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        campaign={selected}
        audienceCount={audience.count}
        onSchedule={confirmSchedule}
    />

    </div>
  );
}