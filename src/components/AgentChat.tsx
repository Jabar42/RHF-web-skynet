"use client";

import { useEffect, useState } from "react";
import ChatWidget from "@tp3/chat-widget";

// Widget flotante oficial (@tp3/chat-widget) → WebSocket directo al gateway
// del perfil de atención (plugin hermes-webchat, puerto 8767), expuesto por el
// túnel Cloudflare como wss://atencion-hrf.syberloop.com. Sin key en el
// navegador ni proxy: el canal WebSocket no lleva autenticación por request.
const WS_URL =
  process.env.NEXT_PUBLIC_CHAT_WS_URL || "wss://atencion-hrf.syberloop.com";

export default function AgentChat() {
  // El widget no se monta hasta que hay navegador. Medido el 2026-09-03: el
  // paquete renderiza <div id="hermes-chat-ssr-placeholder"> en el servidor y
  // <style> en el cliente, y ese desajuste hace fallar la hidratación de React
  // (#418), que descarta el HTML del servidor y reconstruye toda la página en
  // el cliente. `next/dynamic` con ssr:false no lo evitó; esperar al montaje
  // sí, porque servidor y primer render del navegador coinciden en no pintar
  // nada. El arreglo de fondo va en @tp3/chat-widget, no acá.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  if (!montado) return null;

  return (
    <div
      style={
        {
          "--chat-primary": "#1F2A3D", // marino RHF
          "--chat-primary-hover": "#2a3a52",
          "--chat-primary-fg": "#FFFFFF",
          "--chat-bot-text": "#1F2A3D",
          "--chat-code-bg": "rgba(194,165,120,.15)",
          "--chat-shadow": "0 8px 24px rgba(31,42,61,.18)",
          "--chat-shadow-lg": "0 12px 48px rgba(31,42,61,.22)",
        } as React.CSSProperties
      }
    >
      <ChatWidget
        hermesUrl={WS_URL}
        brandName="RHF"
        brandSubtitle="Asesoría inmobiliaria · Cartagena"
        welcomeMessage="👋 ¡Hola! Soy el asistente de la cartera inmobiliaria. Preguntame por Doral Country, Doral West, Acacias Campestre u otro proyecto: precios, disponibilidad y más."
      />
    </div>
  );
}
