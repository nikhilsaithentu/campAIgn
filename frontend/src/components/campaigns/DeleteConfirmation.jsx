import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmation({
  open,
  title = "Delete Item",
  description = "This action cannot be undone.",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
      />

      <div
        className="
        relative
        w-full
        max-w-md
        rounded-3xl
        border
        border-brand-border
        bg-white
        shadow-2xl
        p-8"
      >

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

          <AlertTriangle
            className="text-red-600"
            size={30}
          />

        </div>

        <h2 className="text-center text-2xl font-bold text-brand-ink">
          {title}
        </h2>

        <p className="mt-3 text-center text-brand-slate">
          {description}
        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            disabled={loading}
            onClick={onCancel}
            className="
            rounded-xl
            border
            border-brand-border
            px-5
            py-3
            font-medium"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="
            rounded-xl
            bg-red-600
            px-5
            py-3
            font-semibold
            text-white
            disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}