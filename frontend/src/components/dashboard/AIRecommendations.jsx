
import {
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";
export default function AIRecommendations({
  narrative,
  targeting = [],
}) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-card">

      {/* Header */}

      <div className="border-b border-brand-border px-6 py-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-brand-coral/10 flex items-center justify-center">

            <Brain
              size={20}
              className="text-brand-coral"
            />

          </div>

          <div>

            <h2 className="font-semibold text-brand-ink">
              AI Executive Summary
            </h2>

            <p className="text-sm text-brand-slate">
              Generated using your latest campaign data
            </p>

          </div>

        </div>

        <Sparkles
          className="text-brand-coral"
          size={20}
        />

      </div>

      {/* Summary */}

      <div className="px-6 pt-6">

        <p className="text-brand-slate leading-8">

          {narrative?.narrative ??
            "No AI summary available."}

        </p>

      </div>

      {/* Recommendations */}

      <div className="px-6 py-6 space-y-4">

        {targeting.slice(0, 3).map((item) => (

          <div
            key={item.customerId}
            className="
            rounded-2xl
            bg-brand-paper
            border
            border-brand-border
            p-4
          "
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-semibold text-brand-ink">

                  {item.customerId}

                </h3>

                <p className="text-sm text-brand-slate mt-1">

                  {item.recommendation}

                </p>

              </div>

              <div
                className="
                rounded-full
                bg-brand-coral/10
                px-3
                py-1
                text-xs
                font-semibold
                text-brand-coral
                h-fit
              "
              >

                {(item.confidence * 100).toFixed(0)}%

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-brand-border px-6 py-4">

        <button
          className="
          flex
          items-center
          gap-2
          text-brand-coral
          font-semibold
          hover:gap-3
          transition-all
        "
        >

          

        </button>

      </div>

    </div>
  );
}