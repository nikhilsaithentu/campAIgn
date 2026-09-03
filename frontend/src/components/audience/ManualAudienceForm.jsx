import { useState } from "react";

export default function ManualAudienceForm({
  segments,
  channels,
  onSubmit,
}) {
  const [form, setForm] = useState({
    segment: "",
    preferredChannel: "",
    minLifetimeValue: 0,
    minPurchases: 0,
  });

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold text-brand-ink">
        Manual Audience Selection
      </h2>

      <p className="mt-1 text-sm text-brand-slate">
        Filter customers using marketing attributes.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-2 gap-6"
      >

        {/* Segment */}

        <div>

          <label className="mb-2 block text-sm font-medium text-brand-ink">
            Segment
          </label>

          <select
            value={form.segment}
            onChange={(e) =>
              update("segment", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="">
              All Segments
            </option>

            {segments.map((segment) => (
              <option
                key={segment}
                value={segment}
              >
                {segment}
              </option>
            ))}

          </select>

        </div>

        {/* Preferred Channel */}

        <div>

          <label className="mb-2 block text-sm font-medium text-brand-ink">
            Preferred Channel
          </label>

          <select
            value={form.preferredChannel}
            onChange={(e) =>
              update("preferredChannel", e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            <option value="">
              Any Channel
            </option>

            {channels.map((channel) => (
              <option
                key={channel}
                value={channel}
              >
                {channel}
              </option>
            ))}

          </select>

        </div>

        {/* Lifetime Value */}

        <div>

          <label className="mb-2 block text-sm font-medium text-brand-ink">
            Minimum Lifetime Value
          </label>

          <input
            type="number"
            value={form.minLifetimeValue}
            onChange={(e) =>
              update(
                "minLifetimeValue",
                Number(e.target.value)
              )
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />

        </div>

        {/* Purchases */}

        <div>

          <label className="mb-2 block text-sm font-medium text-brand-ink">
            Minimum Purchases
          </label>

          <input
            type="number"
            value={form.minPurchases}
            onChange={(e) =>
              update(
                "minPurchases",
                Number(e.target.value)
              )
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />

        </div>

        <div className="col-span-2 flex justify-end">

          <button
            type="submit"
            className="
              rounded-xl
              bg-brand-coral
              px-6
              py-3
              font-semibold
              text-white
              hover:opacity-90
              transition"
          >
            Find Audience
          </button>

        </div>

      </form>

    </div>
  );
}