import {
  X,
  Mail,
  Phone,
  MapPin,
  Users,
} from "lucide-react";

export default function AudienceModal({
  open,
  onClose,
  customers = [],
  count = 0,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-brand-ink">
              Selected Audience
            </h2>

            <p className="mt-1 text-sm text-brand-slate">
              {count} customers will receive this email.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-brand-paper"
          >
            <X size={20} />
          </button>

        </div>

        {/* Customers */}

        <div className="max-h-[500px] overflow-y-auto">

          {customers.length === 0 ? (

            <div className="py-16 text-center text-brand-slate">
              No audience selected.
            </div>

          ) : (

            <div className="divide-y divide-brand-border">

              {customers.map((customer) => (

                <div
                  key={customer.id}
                  className="flex items-center justify-between px-6 py-5"
                >

                  <div>

                    <h3 className="font-semibold text-brand-ink">
                      {customer.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-brand-slate">

                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {customer.email}
                      </span>

                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {customer.phone}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {customer.city}
                      </span>

                    </div>

                  </div>

                  <div className="text-right">

                    <div className="rounded-full bg-brand-paper px-3 py-1 text-xs font-medium">

                      {customer.segment}

                    </div>

                    <div className="mt-2 text-sm text-brand-slate">

                      LTV: ₹{customer.lifetimeValue}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-brand-border px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-brand-coral px-5 py-2 font-medium text-white hover:opacity-90"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}