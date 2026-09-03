import { useEffect, useState } from "react";

const CAMPAIGN_TYPES = [
  "promotional",
  "retention",
  "awareness",
  "reengagement",
  "lifecycle",
];

const CHANNELS = [
  "email",
  "sms",
  "social",
  "web",
];

const SEGMENTS = [
  "Young Professional",
  "Premium Shopper",
  "Loyal Customer",
  "Occasional Buyer",
];

const initialState = {
  name: "",
  type: "promotional",
  goal: "",
  description: "",
  budget: "",
  startDate: "",
  endDate: "",
  channels: [],
  targetSegments: [],
};

export default function CampaignForm({
  mode = "create",
  campaign = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (mode === "edit" && campaign) {
      setForm({
        name: campaign.name || "",
        type: campaign.type || "promotional",
        goal: campaign.goal || "",
        description: campaign.description || "",
        budget: campaign.budget || "",
        startDate: campaign.startDate || "",
        endDate: campaign.endDate || "",
        channels: campaign.channels || [],
        targetSegments: campaign.targetSegments || [],
      });
    } else {
      setForm(initialState);
    }
  }, [mode, campaign]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleArrayValue(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Campaign name is required.");
    }

    if (!form.goal.trim()) {
      return alert("Goal is required.");
    }

    if (form.channels.length === 0) {
      return alert("Select at least one channel.");
    }

    if (form.targetSegments.length === 0) {
      return alert("Select at least one audience segment.");
    }

    onSubmit({
      ...form,
      budget: Number(form.budget),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">

      {/* Campaign Name */}

      <div>
        <label className="block mb-2 text-sm font-semibold text-brand-ink">
          Campaign Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-brand-border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-coral"
          placeholder="Summer Sale 2026"
        />
      </div>

      {/* Type + Goal */}

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 text-sm font-semibold text-brand-ink">
            Campaign Type
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            {CAMPAIGN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-brand-ink">
            Goal
          </label>

          <input
            name="goal"
            value={form.goal}
            onChange={handleChange}
            placeholder="increase_sales"
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />
        </div>

      </div>

      {/* Budget + Dates */}

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <label className="block mb-2 text-sm font-semibold text-brand-ink">
            Budget
          </label>

          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-brand-ink">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-brand-ink">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />
        </div>

      </div>

      {/* Description */}

      <div>
        <label className="block mb-2 text-sm font-semibold text-brand-ink">
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-brand-border px-4 py-3 resize-none"
        />
      </div>

      {/* Channels */}

      <div>

        <h3 className="mb-3 font-semibold text-brand-ink">
          Channels
        </h3>

        <div className="flex flex-wrap gap-3">

          {CHANNELS.map((channel) => (

            <button
              key={channel}
              type="button"
              onClick={() => toggleArrayValue("channels", channel)}
              className={`px-4 py-2 rounded-full border transition ${
                form.channels.includes(channel)
                  ? "bg-brand-coral text-white border-brand-coral"
                  : "border-brand-border hover:bg-brand-paper"
              }`}
            >
              {channel.toUpperCase()}
            </button>

          ))}

        </div>

      </div>

      {/* Segments */}

      <div>

        <h3 className="mb-3 font-semibold text-brand-ink">
          Target Segments
        </h3>

        <div className="flex flex-wrap gap-3">

          {SEGMENTS.map((segment) => (

            <button
              key={segment}
              type="button"
              onClick={() =>
                toggleArrayValue("targetSegments", segment)
              }
              className={`px-4 py-2 rounded-full border transition ${
                form.targetSegments.includes(segment)
                  ? "bg-brand-coral text-white border-brand-coral"
                  : "border-brand-border hover:bg-brand-paper"
              }`}
            >
              {segment}
            </button>

          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-4 pt-4">

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-brand-border"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-brand-coral text-white font-semibold hover:opacity-90"
        >
          {mode === "create" ? "Create Campaign" : "Update Campaign"}
        </button>

      </div>

    </form>
  );
}