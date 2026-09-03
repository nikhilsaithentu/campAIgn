import { useState } from "react";
import {
  Megaphone,
  Users,
  Sparkles,
  Eye,
} from "lucide-react";

import Card from "../ui/Card";
import SettingsSection from "./SettingsSection";

export default function CampaignSettings({
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  campaign,
  audience,
  onGenerate,
  onViewAudience,
}) {
  const [tone, setTone] = useState("friendly");

  async function handleGenerate() {
    if (!campaign) return;

    await onGenerate({
      tone,
      channel: "email",
    });
  }

  return (
    <Card
      title="Campaign Settings"
      subtitle="Configure your email campaign before generating AI content."
    >
      <div className="space-y-8">

        {/* Campaign */}

        <SettingsSection
          icon={
            <Megaphone
              className="h-5 w-5 text-brand-coral"
            />
          }
          title="Campaign"
          subtitle="Select the campaign to work on."
        >

          <select
            value={selectedCampaign}
            onChange={(e) =>
              setSelectedCampaign(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-brand-border
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-brand-coral
            "
          >
            <option value="">
              Select Campaign
            </option>

            {campaigns.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}

          </select>

          {campaign && (

            <div className="mt-4 rounded-xl bg-brand-paper p-4">

              <div className="font-semibold text-brand-ink">
                {campaign.name}
              </div>

              <div className="mt-1 text-sm capitalize text-brand-slate">
                {campaign.type} Campaign
              </div>

            </div>

          )}

        </SettingsSection>

        {/* Audience */}

        <SettingsSection
          icon={
            <Users
              className="h-5 w-5 text-brand-coral"
            />
          }
          title="Audience"
          subtitle="Review the selected audience."
        >

          <div className="rounded-xl bg-brand-paper p-4">

            <div className="text-2xl font-bold text-brand-ink">
              {audience.count}
            </div>

            <div className="text-sm text-brand-slate">
              Customers Selected
            </div>

            <button
              onClick={onViewAudience}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-brand-coral
                font-medium
                hover:underline
              "
            >
              <Eye className="h-4 w-4" />

              View Audience

            </button>

          </div>

        </SettingsSection>

        {/* AI */}

        <SettingsSection
          icon={
            <Sparkles
              className="h-5 w-5 text-brand-coral"
            />
          }
          title="AI Settings"
          subtitle="Customize AI generation."
        >

          <label className="mb-2 block text-sm font-medium">
            Tone
          </label>

          <select
            value={tone}
            onChange={(e) =>
              setTone(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-brand-border
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-brand-coral
            "
          >
            <option>friendly</option>
            <option>professional</option>
            <option>formal</option>
            <option>persuasive</option>
          </select>

        </SettingsSection>

        <button
          onClick={handleGenerate}
          disabled={!campaign}
          className="
            w-full
            rounded-xl
            bg-brand-coral
            py-4
            font-semibold
            text-white
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          ✨ Generate AI Email
        </button>

      </div>
    </Card>
  );
}