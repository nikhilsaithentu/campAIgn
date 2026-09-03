import { Users } from "lucide-react";

export default function AudienceSummary({ count }) {
  return (
    <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-card">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-brand-coral/10 p-4">

          <Users
            size={28}
            className="text-brand-coral"
          />

        </div>

        <div>

          <p className="text-sm text-brand-slate">
            Matching Audience
          </p>

          <h2 className="text-3xl font-bold text-brand-ink">
            {count.toLocaleString()}
          </h2>

          <p className="text-sm text-brand-slate">
            Customers selected
          </p>

        </div>

      </div>

    </div>
  );
}