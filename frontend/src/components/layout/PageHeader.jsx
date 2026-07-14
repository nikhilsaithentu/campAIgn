import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="flex items-center justify-between"
    >
      <div>

        <h1 className="text-3xl font-bold text-slate-900">

          {title}

        </h1>

        {subtitle && (
          <p className="mt-2 text-slate-500">

            {subtitle}

          </p>
        )}

      </div>

      {action && action}

    </motion.div>
  );
}