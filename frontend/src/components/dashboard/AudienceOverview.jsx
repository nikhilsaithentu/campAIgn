import { Users, IndianRupee, ShoppingBag, Target } from "lucide-react";

export default function AudienceOverview({ customers = [] }) {
  if (!customers.length) {
    return (
      <div className="rounded-3xl border border-brand-border bg-white shadow-card p-6">
        <p className="text-brand-slate">No audience data available.</p>
      </div>
    );
  }

  const totalCustomers = customers.length;

  const avgLifetimeValue =
    customers.reduce((sum, c) => sum + c.lifetimeValue, 0) /
    totalCustomers;

  const avgPurchases =
    customers.reduce((sum, c) => sum + c.totalPurchases, 0) /
    totalCustomers;

  const segmentCounts = customers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {});

  const topSegment = Object.entries(segmentCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const stats = [
    {
      title: "Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Avg Lifetime Value",
      value: `₹${avgLifetimeValue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
      icon: IndianRupee,
    },
    {
      title: "Avg Purchases",
      value: avgPurchases.toFixed(1),
      icon: ShoppingBag,
    },
    {
      title: "Largest Segment",
      value: topSegment?.[0] ?? "-",
      icon: Target,
    },
  ];

  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-card">

      <div className="border-b border-brand-border px-6 py-5">
        <h2 className="text-xl font-semibold text-brand-ink">
          Audience Overview
        </h2>

        <p className="mt-1 text-sm text-brand-slate">
          Key customer metrics at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 p-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl bg-brand-paper p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coral/10">
                  <Icon
                    size={20}
                    className="text-brand-coral"
                  />
                </div>

                <span className="text-sm text-brand-slate">
                  {stat.title}
                </span>
              </div>

              <p className="text-2xl font-bold text-brand-ink">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}