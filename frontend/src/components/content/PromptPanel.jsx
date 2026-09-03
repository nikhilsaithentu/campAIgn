import { useState } from "react";

export default function PromptPanel({
  campaign,
  onGenerate,
}) {
  const [channel, setChannel] = useState("email");
  const [tone, setTone] = useState("friendly");

  async function handleGenerate() {
    await onGenerate({
      channel,
      tone,
    });
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold text-brand-ink">
        AI Content Generator
      </h2>

      <p className="mt-1 text-sm text-brand-slate">
        AI will generate content using the selected campaign details.
      </p>

      {campaign ? (
        <div className="mt-6 space-y-4">

          <div className="rounded-2xl bg-brand-paper p-4">

            <p className="text-xs text-brand-slate">
              Campaign
            </p>

            <h3 className="font-semibold text-brand-ink">
              {campaign.name}
            </h3>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-brand-paper p-4">

              <p className="text-xs text-brand-slate">
                Type
              </p>

              <h3 className="font-semibold capitalize">
                {campaign.type}
              </h3>

            </div>

            <div className="rounded-2xl bg-brand-paper p-4">

              <p className="text-xs text-brand-slate">
                Goal
              </p>

              <h3 className="font-semibold capitalize">
                {campaign.goal.replaceAll("_", " ")}
              </h3>

            </div>

          </div>

          <div className="rounded-2xl bg-brand-paper p-4">

            <p className="text-xs text-brand-slate">
              Target Segment
            </p>

            <h3 className="font-semibold">
              {campaign.targetSegments?.join(", ")}
            </h3>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Channel
            </label>

            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full rounded-xl border border-brand-border px-4 py-3"
            >
              {campaign.channels.map((c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c.toUpperCase()}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Tone
            </label>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-xl border border-brand-border px-4 py-3"
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="exciting">Exciting</option>
              <option value="luxury">Luxury</option>
            </select>

          </div>

          <button
            onClick={handleGenerate}
            className="w-full rounded-xl bg-brand-coral py-4 font-semibold text-white hover:opacity-90"
          >
            ✨ Generate AI Content
          </button>

        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-border p-8 text-center text-brand-slate">
          Select a campaign to generate AI content.
        </div>
      )}

    </div>
  );
}