export default function BudgetProgress({
  spent,
  budget,
}) {
  const percentage = Math.min(
    (spent / budget) * 100,
    100
  );

  return (
    <div className="space-y-2">

      <div className="flex justify-between text-sm">

        <span className="text-brand-slate">
          ₹{spent.toLocaleString()}
        </span>

        <span className="font-medium text-brand-ink">
          {percentage.toFixed(0)}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-brand-paper overflow-hidden">

        <div
          className="h-full rounded-full bg-brand-coral"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}