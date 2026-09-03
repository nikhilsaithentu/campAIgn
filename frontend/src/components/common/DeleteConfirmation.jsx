import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmation({
  open,
  title,
  description,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white border border-brand-border p-8 shadow-2xl">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="text-red-600" size={30} />
        </div>

        <h2 className="text-center text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-3 text-center text-brand-slate">
          {description}
        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-brand-border px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 text-white font-semibold"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}