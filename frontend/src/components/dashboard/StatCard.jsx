import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = "blue",
}) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
    },
  };

  const theme = colors[color] || colors.blue;

  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
      bg-white
      rounded-2xl
      border
      border-slate-200
      p-6
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300"
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        {Icon && (
          <div
            className={`
            h-12
            w-12
            rounded-xl
            flex
            items-center
            justify-center
            ${theme.bg}
            ${theme.icon}
            `}
          >
            <Icon size={24} />
          </div>
        )}

      </div>

      {(trend || subtitle) && (

        <div className="mt-6 flex items-center justify-between">

          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                trend >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}

              {Math.abs(trend)}%
            </div>
          )}

          <p className="text-xs text-slate-500">

            {trendLabel || subtitle}

          </p>

        </div>

      )}

    </motion.div>
  );
}