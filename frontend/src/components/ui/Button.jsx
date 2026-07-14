import { motion } from "framer-motion";

export default function Button({
  children,
  icon: Icon,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      className={`
        inline-flex
        items-center
        gap-2
        rounded-xl
        px-5
        py-3
        font-medium
        transition
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={18} />}

      {children}
    </motion.button>
  );
}