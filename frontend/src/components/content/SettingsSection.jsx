export default function SettingsSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="border-b border-brand-border pb-8 last:border-b-0 last:pb-0">

      <div className="mb-5 flex items-start gap-3">

        <div className="rounded-xl bg-brand-paper p-2">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-brand-ink">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-brand-slate">
              {subtitle}
            </p>
          )}

        </div>

      </div>

      {children}

    </section>
  );
}