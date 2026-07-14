import { Search } from "lucide-react";

export default function CampaignFilters({
  search,
  setSearch,
  status,
  setStatus,
  type,
  setType,
  total,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex flex-1 flex-wrap gap-4">

        {/* Search */}

        <div className="relative w-full lg:w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="
              w-full
              rounded-2xl
              border
              border-brand-border
              bg-white
              py-3
              pl-10
              pr-4
              outline-none
              transition
              focus:border-brand-coral
            "
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            rounded-2xl
            border
            border-brand-border
            bg-white
            px-4
            py-3
            outline-none
            focus:border-brand-coral
          "
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
        </select>

        {/* Type */}

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="
            rounded-2xl
            border
            border-brand-border
            bg-white
            px-4
            py-3
            outline-none
            focus:border-brand-coral
          "
        >
          <option value="all">All Types</option>
          <option value="promotional">Promotional</option>
          <option value="retention">Retention</option>
          <option value="lifecycle">Lifecycle</option>
          <option value="reengagement">Re-engagement</option>
          <option value="awareness">Awareness</option>
        </select>

      </div>

      <div className="text-sm font-medium text-brand-slate">
        {total} Campaigns
      </div>

    </div>
  );
}