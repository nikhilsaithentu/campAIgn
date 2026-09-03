import { useEffect, useState } from "react";

export default function EmailEditor({
  content,
  loading,
  onChange,
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setSubject(content?.subject || "");
    setBody(content?.html || content?.body || "");
  }, [content]);

  useEffect(() => {
    onChange?.({
      ...content,
      subject,
      body,
    });
  }, [subject, body]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-brand-border bg-white p-8 shadow-card">
        <div className="animate-pulse space-y-5">

          <div className="h-8 w-48 rounded bg-slate-200" />

          <div className="h-12 rounded bg-slate-200" />

          <div className="h-80 rounded bg-slate-200" />

        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-card overflow-hidden">

      {/* Header */}

      <div className="border-b border-brand-border bg-brand-paper px-6 py-5">

        <h2 className="text-xl font-semibold text-brand-ink">
          Email Editor
        </h2>

        <p className="mt-1 text-sm text-brand-slate">
          Review and edit the generated email before sending.
        </p>

      </div>

      <div className="p-6 space-y-6">

        {/* From */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            From
          </label>

          <input
            disabled
            value="marketing@campAIgn.com"
            className="w-full rounded-xl border border-brand-border bg-brand-paper px-4 py-3"
          />

        </div>

        {/* Subject */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Subject
          </label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-3 outline-none focus:ring-2 focus:ring-brand-coral"
          />

        </div>

        {/* Body */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Email Body
          </label>

          <textarea
            rows={18}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-brand-border px-4 py-4 outline-none focus:ring-2 focus:ring-brand-coral resize-none"
          />

        </div>

      </div>

    </div>
  );
}