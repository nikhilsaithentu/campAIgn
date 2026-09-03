import { useState } from "react";

export default function ContentGeneratorForm({
  campaigns = [],
  onGenerate,
}) {
  const [form, setForm] = useState({
    campaignId: "",
    channel: "email",
    tone: "professional",
    goal: "increase_sales",
    prompt: "",
  });

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onGenerate(form);
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold text-brand-ink">
        AI Content Generator
      </h2>

      <p className="mt-1 text-sm text-brand-slate">
        Generate marketing content using AI.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-2 gap-6"
      >

        {/* Campaign */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Campaign
          </label>

          <select
            value={form.campaignId}
            onChange={(e) =>
              update("campaignId", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="">
              Select Campaign
            </option>

            {campaigns.map((campaign) => (
              <option
                key={campaign.id}
                value={campaign.id}
              >
                {campaign.name}
              </option>
            ))}

          </select>

        </div>

        {/* Channel */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Channel
          </label>

          <select
            value={form.channel}
            onChange={(e) =>
              update("channel", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>

        </div>

        {/* Tone */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Tone
          </label>

          <select
            value={form.tone}
            onChange={(e) =>
              update("tone", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="professional">
              Professional
            </option>

            <option value="friendly">
              Friendly
            </option>

            <option value="exciting">
              Exciting
            </option>

            <option value="luxury">
              Luxury
            </option>

          </select>

        </div>

        {/* Goal */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Goal
          </label>

          <select
            value={form.goal}
            onChange={(e) =>
              update("goal", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="increase_sales">
              Increase Sales
            </option>

            <option value="customer_retention">
              Customer Retention
            </option>

            <option value="brand_awareness">
              Brand Awareness
            </option>

          </select>

        </div>

        <div className="col-span-2">

          <label className="mb-2 block text-sm font-medium">
            Prompt
          </label>

          <textarea
            rows={6}
            value={form.prompt}
            onChange={(e) =>
              update("prompt", e.target.value)
            }
            className="w-full rounded-2xl border border-brand-border px-4 py-3 resize-none"
            placeholder="Describe what you want the AI to generate..."
          />

        </div>

        <div className="col-span-2 flex justify-end">

          <button
            type="submit"
            className="rounded-xl bg-brand-coral px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Generate Content
          </button>

        </div>

      </form>

    </div>
  );
}