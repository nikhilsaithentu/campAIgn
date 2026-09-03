import { useState } from "react";

const campaignTypes = [
  "promotional",
  "retention",
  "awareness",
  "reengagement",
];

export default function AIAudienceForm({ onSubmit }) {
  const [campaignType, setCampaignType] = useState("promotional");
  const [minConfidence, setMinConfidence] = useState(0.5);

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      campaignType,
      minConfidence: Number(minConfidence),
    });
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold text-brand-ink">
        AI Audience Selection
      </h2>

      <p className="mt-1 text-sm text-brand-slate">
        Let AI recommend the most suitable audience.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-2 gap-6"
      >

        <div>

          <label className="mb-2 block text-sm font-medium">
            Campaign Type
          </label>

          <select
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            {campaignTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Minimum Confidence
          </label>

          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />

        </div>

        <div className="col-span-2 flex justify-end">

          <button
            type="submit"
            className="rounded-xl bg-brand-coral px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Generate Audience
          </button>

        </div>

      </form>

    </div>
  );
}