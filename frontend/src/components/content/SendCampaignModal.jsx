import { Loader2, Mail, Users, Megaphone, AlertTriangle } from "lucide-react";

export default function SendCampaignModal({
  open,
  onClose,
  onSend,
  sending = false,
  campaign,
  audienceCount,
  content,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="border-b border-brand-border px-8 py-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-brand-coral/10 p-3">
              <Megaphone className="h-6 w-6 text-brand-coral" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-brand-ink">
                Launch Email Campaign
              </h2>

              <p className="text-brand-slate mt-1">
                Review everything before sending.
              </p>
            </div>

          </div>

        </div>

        {/* Body */}

        <div className="space-y-6 p-8">

          {/* Campaign */}

          <div className="rounded-2xl border border-brand-border p-5">

            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-slate">
              Campaign
            </h3>

            <div className="text-xl font-semibold text-brand-ink">
              {campaign?.name}
            </div>

            <div className="mt-1 text-brand-slate capitalize">
              {campaign?.type} Campaign
            </div>

          </div>

          {/* Audience */}

          <div className="rounded-2xl border border-brand-border p-5">

            <div className="flex items-center gap-3">

              <Users className="h-5 w-5 text-brand-coral" />

              <div>

                <div className="font-semibold text-brand-ink">
                  {audienceCount} Customers
                </div>

                <div className="text-sm text-brand-slate">
                  Ready to receive this email.
                </div>

              </div>

            </div>

          </div>

          {/* Email */}

          <div className="rounded-2xl border border-brand-border p-5">

            <div className="flex items-center gap-3 mb-5">

              <Mail className="h-5 w-5 text-brand-coral" />

              <h3 className="font-semibold text-brand-ink">
                Email Preview
              </h3>

            </div>

            <div className="space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-brand-slate">
                  Subject
                </label>

                <div className="rounded-xl bg-brand-paper p-4 font-medium">
                  {content?.subject || "No subject"}
                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-brand-slate">
                  Body
                </label>

                <div className="max-h-64 overflow-auto rounded-xl bg-brand-paper p-5 whitespace-pre-wrap">
                  {content?.body || "No content"}
                </div>

              </div>

            </div>

          </div>

          {/* Warning */}

          <div className="flex gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

            <AlertTriangle className="mt-1 h-5 w-5 text-yellow-600" />

            <div>

              <div className="font-semibold text-yellow-800">
                Ready to Launch
              </div>

              <div className="mt-1 text-sm text-yellow-700">
                This email will be sent immediately to the selected audience.
                Please review the content carefully before launching.
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-4 border-t border-brand-border bg-brand-paper px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-brand-border px-6 py-3 font-medium hover:bg-white"
          >
            Cancel
          </button>

          <button
            disabled={sending}
            onClick={onSend}
            className="flex items-center gap-2 rounded-xl bg-brand-coral px-7 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {sending && <Loader2 className="h-4 w-4 animate-spin" />}

            Launch Campaign
          </button>

        </div>

      </div>

    </div>
  );
}