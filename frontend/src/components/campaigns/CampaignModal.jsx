import { useState } from "react";
import { X } from "lucide-react";
import CampaignForm from "./CampaignForm";

export default function CampaignModal({
  open,
  mode = "create",
  campaign = null,
  onClose,
  onSubmit,
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(data) {
    try {
      setLoading(true);

      const success = await onSubmit(data);

      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onClose}
      />

      <div
        className="
          relative
          w-full
          max-w-4xl
          rounded-3xl
          bg-brand-paper
          border
          border-brand-border
          shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-brand-border px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold text-brand-ink">
              {mode === "create"
                ? "Create Campaign"
                : "Edit Campaign"}
            </h2>

            <p className="text-brand-slate mt-1">
              {mode === "create"
                ? "Create a new marketing campaign."
                : "Update campaign information."}
            </p>
          </div>

          <button
            onClick={loading ? undefined : onClose}
            className="rounded-xl p-2 hover:bg-brand-paper"
          >
            <X />
          </button>

        </div>

        <CampaignForm
          mode={mode}
          campaign={campaign}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />

      </div>
    </div>
  );
}