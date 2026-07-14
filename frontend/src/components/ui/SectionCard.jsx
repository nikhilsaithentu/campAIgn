import { motion } from "framer-motion";

export default function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>

            {title && (
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}

          </div>

          {action}

        </div>
      )}

      <div className="p-6">

        {children}

      </div>
    </motion.section>
  );
}