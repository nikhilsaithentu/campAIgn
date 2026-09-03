export default function AudienceModeToggle({
  mode,
  setMode,
}) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-2 inline-flex gap-2">

      <button
        onClick={() => setMode("manual")}
        className={`
          rounded-2xl
          px-5
          py-3
          font-medium
          transition
          ${
            mode === "manual"
              ? "bg-brand-coral text-white"
              : "text-brand-slate hover:bg-brand-paper"
          }
        `}
      >
        Manual Filter
      </button>

      <button
        onClick={() => setMode("ai")}
        className={`
          rounded-2xl
          px-5
          py-3
          font-medium
          transition
          ${
            mode === "ai"
              ? "bg-brand-coral text-white"
              : "text-brand-slate hover:bg-brand-paper"
          }
        `}
      >
        AI Recommended
      </button>

    </div>
  );
}