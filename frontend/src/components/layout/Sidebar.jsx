import { NavLink } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  LayoutDashboard,
  Megaphone,
  Target,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Logo from "../common/Logo";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    path: "/campaigns",
  },
  {
    title: "Audience",
    icon: Target,
    path: "/targeting",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
  title: "Content Studio",
  icon: FileText,
  path: "/content",
  },
  {
    title: "AI Insights",
    icon: Sparkles,
    path: "/insights",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{
        width: collapsed ? 88 : 280,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
      sticky
      top-0
      h-screen
      bg-brand-ink
      border-r
      border-white/10
      flex
      flex-col
      text-brand-paper"
    >
      {/* Header */}

<div className="h-24 px-5 flex items-center gap-3 border-b border-white/10">

  <Logo collapsed={collapsed} />

  <button
    onClick={() => setCollapsed(!collapsed)}
    className="
      h-9
      w-9
      rounded-xl
      flex
      items-center
      justify-center
      hover:bg-white/10
      transition
    "
  >
    {collapsed ? (
      <ChevronRight size={18} />
    ) : (
      <ChevronLeft size={18} />
    )}
  </button>

</div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-8">

        {!collapsed && (
          <p className="mb-5 px-3 text-xs uppercase tracking-[0.2em] text-brand-slate">
            Workspace
          </p>
        )}

        <div className="space-y-2">

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  px-4
                  py-3
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-brand-coral text-white shadow-card"
                      : "text-brand-paper/70 hover:bg-white/10 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={20} />

                {!collapsed && (
                  <span>{item.title}</span>
                )}
              </NavLink>
            );
          })}

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-white/10 p-4">

        <button
          className="
          flex
          items-center
          gap-3
          w-full
          rounded-2xl
          px-4
          py-3
          text-brand-paper/70
          hover:bg-white/10
          hover:text-white
          transition"
        >
          <Settings size={20} />

          {!collapsed && (
            <span>Settings</span>
          )}

        </button>

        {!collapsed && (

          <div
            className="
            mt-5
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-4"
          >

            <div className="flex items-center gap-3">

              <div
                className="
                h-11
                w-11
                rounded-full
                bg-brand-coral
                flex
                items-center
                justify-center
                text-white
                font-bold"
              >
                N
              </div>

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Nikhil Sai
                </h3>

                <p className="text-xs text-brand-slate">
                  Marketing Manager
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </motion.aside>
  );
}