"use client";

export default function MeInteresaButton() {
  return (
    <button
      className="btn-card"
      onClick={() => {
        const btn = document.querySelector(
          ".tp3-chat-toggle, [data-chat-toggle]"
        ) as HTMLElement;
        btn?.click();
      }}
    >
      Me interesa
    </button>
  );
}
