// Route handler server-side: único poseedor de la key del API server de
// atención (env var API_SERVER_KEY en Vercel). El widget del navegador nunca
// ve la key — el repo es público, no puede ir en el bundle.
import { NextResponse } from "next/server";

const API_BASE = process.env.CHAT_API_URL || "https://atencion.syberloop.com";
const API_KEY = process.env.API_SERVER_KEY || "";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "Sin mensajes" }, { status: 400 });
  }
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Chat no configurado: falta API_SERVER_KEY en el entorno del servidor." },
      { status: 500 }
    );
  }

  try {
    const upstream = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "hermes-agent",
        messages,
        stream: false,
      }),
      signal: AbortSignal.timeout(55_000),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `El agente respondió ${upstream.status}: ${data?.error?.message || ""}` },
        { status: 502 }
      );
    }
    const content: string = data?.choices?.[0]?.message?.content || "";
    return NextResponse.json({ content });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error de red al agente";
    return NextResponse.json({ error: `No se pudo contactar al agente: ${msg}` }, { status: 502 });
  }
}
