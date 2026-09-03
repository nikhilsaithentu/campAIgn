import { useState } from "react";
import {
  EllipsisVertical,
  Pencil,
  Pause,
  Play,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function CampaignActions({
  campaign,
  onEdit,
  onStatusChange,
  onDelete,
}) {
  const [open, setOpen] = useState(false);

  function handleStatus(status) {
    setOpen(false);
    onStatusChange(campaign.id, status);
  }

  return (
    <div className="relative">

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 hover:bg-brand-paper"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div
          className="
          absolute
          right-0
          top-10
          z-20
          w-56
          overflow-hidden
          rounded-2xl
          border
          border-brand-border
          bg-white
          shadow-xl"
        >

          <button
            onClick={() => {
              setOpen(false);
              onEdit(campaign);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-brand-paper"
          >
            <Pencil size={16} />
            Edit Campaign
          </button>

          {campaign.status !== "paused" && (
            <button
              onClick={() => handleStatus("paused")}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-brand-paper"
            >
              <Pause size={16} />
              Pause Campaign
            </button>
          )}

          {campaign.status === "paused" && (
            <button
              onClick={() => handleStatus("active")}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-brand-paper"
            >
              <Play size={16} />
              Resume Campaign
            </button>
          )}

          {campaign.status !== "completed" && (
            <button
              onClick={() => handleStatus("completed")}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-brand-paper"
            >
              <CheckCircle size={16} />
              Mark Completed
            </button>
          )}

          <hr />

          <button
            onClick={() => {
              setOpen(false);
              onDelete(campaign);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete Campaign
          </button>

        </div>
      )}

    </div>
  );
}