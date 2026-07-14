export default function Card({
  children,
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
}) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-brand-border
        bg-white
        shadow-card
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between border-b border-brand-border px-6 py-5">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-brand-ink">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-brand-slate">
                {subtitle}
              </p>
            )}
          </div>

          {action && action}
        </div>
      )}

      <div className={bodyClassName || "p-6"}>
        {children}
      </div>
    </div>
  );
}