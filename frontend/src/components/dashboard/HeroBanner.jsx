import { Sparkles, ArrowRight } from "lucide-react";
import { APP_NAME } from "../../utils/constants.js";

export default function HeroBanner() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      bg-brand-ink
      p-8
      lg:p-10
      text-white
      shadow-card
    "
    >
      {/* Background Accent */}
      <div
        className="
        absolute
        -right-16
        -top-16
        h-64
        w-64
        rounded-full
        bg-brand-coral/10
      "
      />

      <div
        className="
        absolute
        right-20
        bottom-0
        h-40
        w-40
        rounded-full
        bg-brand-coral/5
      "
      />

      <div className="relative z-10 max-w-3xl">

        <div
          className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-brand-coral/30
          bg-brand-coral/10
          px-4
          py-2
          text-sm
          font-medium
          text-brand-coral
        "
        >
          <Sparkles size={16} />

          AI Powered Marketing Intelligence
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight">
          Welcome to{" "}
          <span className="text-brand-coral">
            {APP_NAME}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Monitor campaigns, understand customer behaviour,
          discover opportunities and receive AI-powered
          recommendations from one unified platform.
        </p>

        <button
          className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-brand-coral
          px-5
          py-3
          font-semibold
          text-white
          transition
          hover:scale-[1.02]
          hover:shadow-lg
        "
        >
          View AI Insights

          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
}