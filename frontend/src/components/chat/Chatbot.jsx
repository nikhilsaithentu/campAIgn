import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";

import useChat from "../../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const {
    messages,
    loading,
    sendMessage,
    clearConversation,
  } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    const message = input.trim();

    setInput("");

    await sendMessage(message);
  }

  async function handleClear() {
    await clearConversation();
  }

  return (
    <>
      {/* Floating button */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-brand-coral
            text-white
            shadow-lg
            transition
            hover:scale-105
            hover:opacity-90
          "
          aria-label="Open AI assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}

      {open && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-[600px]
            w-[380px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-brand-border
            bg-white
            shadow-2xl
          "
        >

          {/* Header */}

          <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coral text-white">
                <MessageCircle size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-brand-ink">
                  AI Assistant
                </h2>

                <p className="text-xs text-brand-slate">
                  Ask about your marketing data
                </p>
              </div>

            </div>

            <div className="flex items-center gap-1">

              <button
                onClick={handleClear}
                className="rounded-lg p-2 text-brand-slate hover:bg-brand-paper"
                title="Clear conversation"
              >
                <Trash2 size={17} />
              </button>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-brand-slate hover:bg-brand-paper"
                title="Close"
              >
                <X size={19} />
              </button>

            </div>

          </div>

          {/* Messages */}

          <div className="flex-1 space-y-4 overflow-y-auto bg-brand-paper/30 p-4">

            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">

                <div className="max-w-[280px] text-center">

                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-coral text-white">
                    <MessageCircle size={22} />
                  </div>

                  <h3 className="font-semibold text-brand-ink">
                    How can I help?
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-brand-slate">
                    Ask me about campaigns, customers,
                    performance, targeting or marketing insights.
                  </p>

                </div>

              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-5 ${
                    message.role === "user"
                      ? "rounded-br-md bg-brand-coral text-white"
                      : "rounded-bl-md bg-white text-brand-ink shadow-sm"
                  }`}
                >
                  <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => (
                    <p className="mb-3 last:mb-0 leading-6">
                        {children}
                    </p>
                    ),

                    strong: ({ children }) => (
                    <strong className="font-semibold text-brand-ink">
                        {children}
                    </strong>
                    ),

                    ul: ({ children }) => (
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                        {children}
                    </ul>
                    ),

                    ol: ({ children }) => (
                    <ol className="mb-3 ml-5 list-decimal space-y-1">
                        {children}
                    </ol>
                    ),

                    li: ({ children }) => (
                    <li className="leading-6">
                        {children}
                    </li>
                    ),

                    table: ({ children }) => (
                    <div className="my-3 overflow-x-auto rounded-lg border border-brand-border">
                        <table className="w-full min-w-[500px] text-xs">
                        {children}
                        </table>
                    </div>
                    ),

                    thead: ({ children }) => (
                    <thead className="bg-brand-paper">
                        {children}
                    </thead>
                    ),

                    th: ({ children }) => (
                    <th className="border-b border-brand-border px-3 py-2 text-left font-semibold text-brand-ink">
                        {children}
                    </th>
                    ),

                    td: ({ children }) => (
                    <td className="border-b border-brand-border px-3 py-2 align-top text-brand-slate">
                        {children}
                    </td>
                    ),

                    code: ({ children }) => (
                    <code className="rounded bg-brand-paper px-1.5 py-0.5 text-xs">
                        {children}
                    </code>
                    ),
                }}
                >
                {message.content}
                </ReactMarkdown>

                  {/* Sources */}

                  {message.role === "assistant" &&
                    message.sources?.length > 0 && (
                      <div className="mt-3 border-t border-brand-border pt-2">

                        <p className="mb-1 text-xs font-semibold text-brand-slate">
                          Sources
                        </p>

                        {message.sources.map(
                          (source, index) => (
                            <p
                              key={index}
                              className="text-xs text-brand-slate"
                            >
                              {typeof source === "string"
                                ? source
                                : source.title ||
                                  source.source ||
                                  `Source ${index + 1}`}
                            </p>
                          )
                        )}

                      </div>
                    )}

                </div>

              </div>
            ))}

            {/* Loading */}

            {loading && (
              <div className="flex justify-start">

                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">

                  <div className="flex gap-1">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-slate" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-slate [animation-delay:150ms]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-slate [animation-delay:300ms]" />

                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}

          <form
            onSubmit={handleSend}
            className="border-t border-brand-border bg-white p-3"
          >

            <div className="flex items-center gap-2">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                disabled={loading}
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-brand-border
                  px-4
                  py-3
                  text-sm
                  text-brand-ink
                  outline-none
                  placeholder:text-brand-slate
                  focus:border-brand-coral
                "
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-brand-coral
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Send size={18} />
              </button>

            </div>

          </form>

        </div>
      )}
    </>
  );
}