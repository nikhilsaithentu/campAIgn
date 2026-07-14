import {
  Bell,
  Search,
  Plus,
  Moon,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* LEFT */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search campaigns, customers..."
            className="w-[360px] rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white transition"
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* Date */}

        <div className="hidden lg:block text-right">
          <p className="text-sm font-semibold text-slate-700">
            {today}
          </p>

          <p className="text-xs text-slate-500">
            Welcome back 👋
          </p>
        </div>

        {/* Quick Action */}

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 transition">

          <Plus size={18} />

          <span className="font-medium">
            New Campaign
          </span>

        </button>

        {/* Dark Mode (future) */}

        <button className="h-11 w-11 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center">

          <Moon size={18} />

        </button>

        {/* Notifications */}

        <button className="relative h-11 w-11 rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center">

          <Bell size={18} />

          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}

        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 transition">

          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">

            N

          </div>

          <div className="hidden md:block text-left">

            <p className="text-sm font-semibold text-slate-800">
              Nikhil Sai
            </p>

            <p className="text-xs text-slate-500">
              Marketing Manager
            </p>

          </div>

          <ChevronDown
            size={16}
            className="text-slate-500"
          />

        </button>

      </div>

    </header>
  );
}