"use client";

import { useState, useRef, useEffect } from "react";

// El widget NO conoce la key del API server: habla con /api/chat del mismo
// sitio (route handler server-side), que es quien tiene la key (env de Vercel).
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PALETA = {
  marino: "#1F2A3D",
  camel: "#C2A578",
  marfil: "#F3EFE6",
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Error del servidor (${res.status})`);
      }
      const content: string = data.content || "";
      if (!content) throw new Error("El agente no respondió contenido.");
      const assistantMsg: ChatMessage = { role: "assistant", content };
      setMessages([...history, assistantMsg]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.role === "assistant" && !m.content
            ? { ...m, content: `⚠️ No pude procesar tu mensaje. ${msg}` }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ borderColor: PALETA.camel, background: "#fff" }}
      className="flex flex-col w-full max-w-xl rounded-2xl border overflow-hidden shadow-lg mx-auto"
    >
      <div style={{ background: PALETA.marino }} className="px-5 py-4 text-white">
        <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>
          Asistente RHF
        </p>
        <p className="text-xs opacity-80">
          Pregunta por proyectos, precios y disponibilidad de la cartera.
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ minHeight: 280, maxHeight: 420, background: PALETA.marfil }}
      >
        {messages.length === 0 && !loading && (
          <div className="text-sm" style={{ color: "#6B4A2F" }}>
            Hola 👋 Soy el asistente de la cartera inmobiliaria. Pregúntame por{" "}
            <strong>Doral Country</strong>, <strong>Doral West</strong>,{" "}
            <strong>Acacias Campestre</strong> u otro proyecto.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap"
              style={
                m.role === "user"
                  ? { background: PALETA.camel, color: "#fff" }
                  : { background: "#fff", color: PALETA.marino, border: "1px solid #e5e0d5" }
              }
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
        {loading && !messages.some((m) => m.role === "assistant" && m.content) && (
          <div className="text-xs italic" style={{ color: "#6B4A2F" }}>
            Escribiendo…
          </div>
        )}
        {error && (
          <div className="text-xs" style={{ color: "#b00020" }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t p-3" style={{ borderColor: "#e5e0d5", background: "#fff" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje…"
          disabled={loading}
          className="flex-1 rounded-full border px-4 py-2 text-sm outline-none"
          style={{ borderColor: "#d8d2c4" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: PALETA.marino }}
        >
          {loading ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </div>
  );
}
