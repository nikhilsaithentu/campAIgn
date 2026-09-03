import { X } from "lucide-react";

export default function CampaignIntelligenceModal({
  open,
  onClose,
  intelligence,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-brand-ink">
              ✨ AI Campaign Insight
            </h2>

            {intelligence && (
              <p className="mt-1 text-sm text-brand-slate">
                {intelligence.campaignName}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-brand-paper"
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}
        <div className="space-y-6 p-6">

          {loading && (
            <div className="py-10 text-center text-brand-slate">
              Analyzing campaign...
            </div>
          )}

          {!loading && intelligence && (
            <>
              {/* Health */}
              <div className="rounded-xl border border-brand-border p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-brand-slate">
                      Campaign Health
                    </p>

                    <p className="mt-1 text-2xl font-bold text-brand-ink">
                      {intelligence.healthScore}/100
                    </p>
                  </div>

                  <span className="rounded-full bg-brand-paper px-3 py-1 text-sm font-medium">
                    {intelligence.health?.replaceAll("_", " ")}
                  </span>

                </div>

              </div>

              {/* Assessment */}
              <section>
                <h3 className="font-semibold text-brand-ink">
                  Am I doing it right?
                </h3>

                <p className="mt-2 text-sm leading-6 text-brand-slate">
                  {intelligence.analysis?.amIDoingItRight}
                </p>
              </section>

              {/* What's working */}
              <section>
                <h3 className="font-semibold text-brand-ink">
                  What's working
                </h3>

                <p className="mt-2 text-sm leading-6 text-brand-slate">
                  {intelligence.analysis?.whatIsWorking}
                </p>
              </section>

              {/* What's not working */}
              <section>
                <h3 className="font-semibold text-brand-ink">
                  What's not working
                </h3>

                <p className="mt-2 text-sm leading-6 text-brand-slate">
                  {intelligence.analysis?.whatIsNotWorking}
                </p>
              </section>

              {/* Recommendations */}
              <section>
                <h3 className="font-semibold text-brand-ink">
                  Best I can do
                </h3>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-slate">
                  {intelligence.analysis?.bestICanDo}
                </p>
              </section>

              {/* Forecast */}
              <section>
                <h3 className="font-semibold text-brand-ink">
                  Goal forecast
                </h3>

                <p className="mt-2 text-sm leading-6 text-brand-slate">
                  {intelligence.analysis?.goalForecast}
                </p>
              </section>

            </>
          )}

        </div>

      </div>

    </div>
  );
}