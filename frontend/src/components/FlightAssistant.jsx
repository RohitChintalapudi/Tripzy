import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth.jsx";
import API from "../services/api.js";

const ASSISTANT_TIMEOUT_MS = 90_000;
const initialAssistantMessage = {
  role: "assistant",
  content:
    "Hi! Ask me anything about flights, bookings, airports, or travel for this site.",
};

const FlightAssistant = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, scrollToBottom]);

  useEffect(() => {
    if (!isAuthenticated) setOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await API.post(
        "/assistant/chat",
        {
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
        { timeout: ASSISTANT_TIMEOUT_MS }
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Try again.";
      if (err.code === "ECONNABORTED") {
        msg =
          "Request timed out. If you use a cloud backend, it may be waking up—wait and try again.";
      } else if (!err.response) {
        msg =
          "Network error: start the backend locally or set VITE_BASE_URL_BACKEND to your API URL.";
      }
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-2xl text-white shadow-lg ring-2 ring-sky-400/40 transition hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600"
        aria-label={open ? "Close flight assistant" : "Open flight assistant"}
      >
        {open ? "✕" : "✈"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-[2px] dark:bg-black/50"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[100] flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          role="dialog"
          aria-modal="true"
          aria-label="Flight assistant chat"
        >
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3 dark:border-slate-700">
            <p className="text-sm font-semibold text-white">Flight assistant</p>
            <p className="text-xs text-sky-100">
              Flights &amp; bookings only
            </p>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={
                  m.role === "user"
                    ? "ml-6 rounded-2xl rounded-br-md bg-sky-100 px-3 py-2 text-slate-900 dark:bg-sky-900/50 dark:text-slate-100"
                    : "mr-6 rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-6 rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Thinking…
              </div>
            )}
          </div>

          {error && (
            <p className="px-3 pb-1 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about flights…"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-900"
              disabled={loading}
              autoFocus
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightAssistant;
