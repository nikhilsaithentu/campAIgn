export default function ReachProgress({
  actual,
  target,
}) {
  const percentage =
    target > 0
      ? Math.min((actual / target) * 100, 100)
      : 0;

  return (
    <div className="w-52">

      <div className="flex justify-between text-sm mb-2">

        <span className="text-brand-slate">
          {actual.toLocaleString()} / {target.toLocaleString()}
        </span>

        <span className="font-semibold text-brand-ink">
          {percentage.toFixed(0)}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-brand-paper overflow-hidden">

        <div
          className="h-full rounded-full bg-green-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}