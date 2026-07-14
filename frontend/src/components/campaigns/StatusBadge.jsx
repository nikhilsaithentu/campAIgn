const colors = {
  active:
    "bg-green-100 text-green-700",

  completed:
    "bg-blue-100 text-blue-700",

  paused:
    "bg-yellow-100 text-yellow-700",

  draft:
    "bg-slate-100 text-slate-700",

  scheduled:
    "bg-purple-100 text-purple-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`
      inline-flex
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      capitalize
      ${
        colors[status?.toLowerCase()] ||
        colors.draft
      }
    `}
    >
      {status}
    </span>
  );
}