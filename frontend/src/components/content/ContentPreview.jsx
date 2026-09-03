import { Mail, MessageSquare, Sparkles } from "lucide-react";

export default function ContentPreview({
  content,
}) {
  if (!content) {
    return (
      <div className="rounded-3xl border border-dashed border-brand-border bg-white p-16 text-center shadow-card">

        <Sparkles
          size={50}
          className="mx-auto text-brand-coral"
        />

        <h2 className="mt-6 text-2xl font-semibold text-brand-ink">
          AI Content Preview
        </h2>

        <p className="mt-2 text-brand-slate">
          Generate content to preview your email or SMS.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-card overflow-hidden">

      {/* Header */}

      <div className="border-b border-brand-border px-6 py-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-brand-ink">
            Generated Content
          </h2>

          <p className="text-sm text-brand-slate mt-1">
            AI generated marketing message
          </p>

        </div>

        <div className="rounded-full bg-brand-paper px-4 py-2 text-sm font-medium capitalize">

          {content.channel === "sms" ? (
            <span className="flex items-center gap-2">
              <MessageSquare size={16} />
              SMS
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail size={16} />
              Email
            </span>
          )}

        </div>

      </div>

      <div className="p-6 space-y-6">

        {/* Subject */}

        {content.subject && (

          <div>

            <p className="text-xs uppercase tracking-wider text-brand-slate font-semibold">
              Subject
            </p>

            <div className="mt-2 rounded-xl bg-brand-paper p-4 font-semibold text-brand-ink">
              {content.subject}
            </div>

          </div>

        )}

        {/* Body */}

        <div>

          <p className="text-xs uppercase tracking-wider text-brand-slate font-semibold">
            Content
          </p>

          <div
            className="
            mt-2
            rounded-2xl
            border
            border-brand-border
            bg-brand-paper
            p-6
            whitespace-pre-wrap
            leading-8
            text-brand-ink"
          >
            <div
            className="prose max-w-none whitespace-normal"
            dangerouslySetInnerHTML={{
                __html: content.body,
            }}
            />
          </div>

        </div>

        {/* Footer */}

        <div className="grid grid-cols-3 gap-4">

          <div className="rounded-xl bg-brand-paper p-4">

            <p className="text-xs text-brand-slate">
              Words
            </p>

            <h3 className="mt-1 text-xl font-bold text-brand-ink">
              {content.body?.split(" ").length || 0}
            </h3>

          </div>

          <div className="rounded-xl bg-brand-paper p-4">

            <p className="text-xs text-brand-slate">
              Tone
            </p>

            <h3 className="mt-1 text-xl font-bold capitalize text-brand-ink">
              {content.tone}
            </h3>

          </div>

          <div className="rounded-xl bg-brand-paper p-4">

            <p className="text-xs text-brand-slate">
              Goal
            </p>

            <h3 className="mt-1 text-sm font-semibold capitalize text-brand-ink">
              {content.goal?.replaceAll("_", " ")}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}