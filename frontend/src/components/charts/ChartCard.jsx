import { motion } from "framer-motion";

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  height = 350,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35 }}
      className="
      rounded-2xl
      bg-white
      border
      border-slate-200
      shadow-sm
      hover:shadow-lg
      transition-all"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {action}

      </div>

      <div
        className="p-6"
        style={{
          height,
        }}
      >
        {children}
      </div>

    </motion.div>
  );
}
