import { Copy, Save, Send, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function ContentToolbar({
  content,
  onSave,
  onSend,
  onSchedule,
}) {
  if (!content) return null;

  async function copyContent() {
    let text = "";

    if (content.subject) {
      text += `Subject: ${content.subject}\n\n`;
    }

    text += content.body;

    await navigator.clipboard.writeText(text);

    toast.success("Content copied to clipboard");
  }

  return (
    <div className="rounded-3xl border border-brand-border bg-white p-5 shadow-card">

      <div className="flex flex-wrap gap-4">

        <button
          onClick={copyContent}
          className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-brand-border
          px-5
          py-3
          hover:bg-brand-paper"
        >
          <Copy size={18} />
          Copy
        </button>

        <button
          onClick={onSave}
          className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-brand-border
          px-5
          py-3
          hover:bg-brand-paper"
        >
          <Save size={18} />
          Save
        </button>

        <button
            onClick={onSend}
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-brand-coral
            px-5
            py-3
            text-white
            hover:opacity-90"
        >
            <Send size={18}/>
            Send Now
        </button>

        <button
          onClick={onSchedule}
          className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-brand-border
          px-5
          py-3
          hover:bg-brand-paper"
        >
          <Calendar size={18} />
          Schedule
        </button>

      </div>

    </div>
  );
}