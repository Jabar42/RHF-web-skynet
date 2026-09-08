"use client";

/**
 * Abre el widget de chat del agente de atención.
 *
 * `label` y `className` son opcionales para no romper los usos existentes
 * (`<MeInteresaButton />` en la home y en Cartera).
 */
export default function MeInteresaButton({
  label = "Me interesa",
  className = "btn-card",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      className={className}
      onClick={() => {
        const btn = document.querySelector(
          ".tp3-chat-toggle, [data-chat-toggle]"
        ) as HTMLElement;
        btn?.click();
      }}
    >
      {label}
    </button>
  );
}
