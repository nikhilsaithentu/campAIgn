import { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

export default function ScheduleCampaignModal({
  open,
  onClose,
  campaign,
  audienceCount,
  onSchedule,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!open) return null;

  async function handleSchedule() {
    if (!date || !time) return;

    const scheduledAt = new Date(`${date}T${time}`).toISOString();

    await onSchedule(scheduledAt);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-brand-ink">
              Schedule Email
            </h2>

            <p className="mt-1 text-sm text-brand-slate">
              Choose when this campaign should be sent.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-brand-paper"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          <div>
            <label className="text-sm font-medium">
              Campaign
            </label>

            <div className="mt-1 rounded-lg border border-brand-border bg-brand-paper p-3">
              {campaign?.name}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Audience
            </label>

            <div className="mt-1 rounded-lg border border-brand-border bg-brand-paper p-3">
              {audienceCount} recipients
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Calendar size={16} />
              Date
            </label>

            <input
              type="date"
              className="w-full rounded-lg border border-brand-border p-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Clock size={16} />
              Time
            </label>

            <input
              type="time"
              className="w-full rounded-lg border border-brand-border p-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-brand-border px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-brand-border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSchedule}
            className="rounded-xl bg-brand-coral px-5 py-2 font-medium text-white"
          >
            Schedule Email
          </button>

        </div>

      </div>

    </div>
  );
}