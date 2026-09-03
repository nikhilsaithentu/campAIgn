import PageHeader from "../components/layout/PageHeader";

import AudienceModeToggle from "../components/audience/AudienceModeToggle";
import ManualAudienceForm from "../components/audience/ManualAudienceForm";
import AIAudienceForm from "../components/audience/AIAudienceForm";
import AudienceSummary from "../components/audience/AudienceSummary";
import AudienceTable from "../components/audience/AudienceTable";

import useAudience from "../hooks/useAudience";

import { useState } from "react";

export default function Audience() {
  const [mode, setMode] = useState("manual");

  const {
    loading,

    segments,
    channels,

    customers,
    count,

    filterAudience,
    autoSelectAudience,
  } = useAudience();

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        Loading audience...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="View Audience"
        subtitle="View audiences manually or let AI recommend the best audience."
      />

      <AudienceModeToggle
        mode={mode}
        setMode={setMode}
      />

      {mode === "manual" ? (
        <ManualAudienceForm
          segments={segments}
          channels={channels}
          onSubmit={filterAudience}
        />
      ) : (
        <AIAudienceForm
          onSubmit={autoSelectAudience}
        />
      )}

      <AudienceSummary
        count={count}
      />

      <AudienceTable
        customers={customers}
      />

    </div>
  );
}