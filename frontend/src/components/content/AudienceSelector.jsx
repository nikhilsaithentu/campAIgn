import { useEffect, useState } from "react";

export default function AudienceSelector({
  campaign,
  audience,
}) {
  const {
    loading,
    segments,
    channels,
    filterAudience,
    autoSelect,
  } = audience;

  const [mode, setMode] = useState("auto");

  const [segment, setSegment] = useState("");
  const [channel, setChannel] = useState("");
  const [minLifetimeValue, setMinLifetimeValue] = useState(5000);
  const [minPurchases, setMinPurchases] = useState(3);
  const [minConfidence, setMinConfidence] = useState(0.5);

  useEffect(() => {
    if (!campaign) return;

    setSegment(campaign.targetSegments?.[0] || "");
    setChannel(campaign.channels?.[0] || "");
  }, [campaign]);

  async function handleSelect() {
    if (!campaign) return;

    if (mode === "auto") {
      await autoSelect({
        campaignType: campaign.type,
        minConfidence,
      });

      return;
    }

    await filterAudience({
      segment,
      preferredChannel: channel,
      minLifetimeValue: Number(minLifetimeValue),
      minPurchases: Number(minPurchases),
    });
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <h2 className="text-xl font-semibold">
        Audience Selection
      </h2>

      <div className="mt-5 flex gap-6">

        <label className="flex items-center gap-2">

          <input
            type="radio"
            checked={mode === "auto"}
            onChange={() => setMode("auto")}
          />

          Auto Select

        </label>

        <label className="flex items-center gap-2">

          <input
            type="radio"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />

          Manual Filter

        </label>

      </div>

      {mode === "auto" ? (

        <div className="mt-6 space-y-4">

          <div>

            <label className="block mb-2 text-sm font-medium">
              Campaign Type
            </label>

            <input
              disabled
              value={campaign?.type || ""}
              className="w-full rounded-xl border border-brand-border bg-brand-paper px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium">
              Minimum Confidence
            </label>

            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={minConfidence}
              onChange={(e) =>
                setMinConfidence(e.target.value)
              }
              className="w-full rounded-xl border border-brand-border px-4 py-3"
            />

          </div>

        </div>

      ) : (

        <div className="mt-6 space-y-4">

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            {segments.map((s) => (
              <option key={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          >
            {channels.map((c) => (
              <option key={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Minimum Lifetime Value"
            value={minLifetimeValue}
            onChange={(e) =>
              setMinLifetimeValue(e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />

          <input
            type="number"
            placeholder="Minimum Purchases"
            value={minPurchases}
            onChange={(e) =>
              setMinPurchases(e.target.value)
            }
            className="w-full rounded-xl border border-brand-border px-4 py-3"
          />

        </div>

      )}

      <button
        onClick={handleSelect}
        disabled={!campaign || loading}
        className="mt-6 w-full rounded-xl bg-brand-coral py-3 text-white font-semibold"
      >
        {loading ? "Selecting..." : "Select Audience"}
      </button>

    </div>
  );
}