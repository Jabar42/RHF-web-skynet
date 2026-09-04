"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motor de scrollytelling — sin dependencias.
 *
 * Todo lo que el plan pedía (fade-up, stagger, parallax, contadores) sale de
 * IntersectionObserver + rAF + CSS. No entra ninguna librería de animación:
 * el bundle ya carga Three.js por el héroe y no hay línea base de rendimiento.
 *
 * Regla transversal: si el sistema pide reducir el movimiento, no hay animación
 * — el contenido aparece en su estado final, nunca queda oculto.
 */

/** ¿El sistema pide reducir el movimiento? Reactivo si el usuario lo cambia. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Prepara un elemento para revelarse al hacer scroll.
 *
 * El contrato es al revés de lo habitual, y es deliberado: **el HTML sale
 * visible**. La clase que oculta (`armed`) la pone este hook en el navegador,
 * y sólo sobre lo que todavía está fuera de pantalla. Consecuencias:
 *
 * - Sin JS, con JS a medio hidratar o en un crawler: se ve todo. Nunca hay
 *   una landing en blanco esperando un observer que no llegó.
 * - Lo que ya está en pantalla al cargar no se arma: aparece y punto. Armarlo
 *   sería ocultar algo que el usuario ya está viendo, para volver a mostrarlo.
 * - Con reduced-motion no se arma nada.
 *
 * Devuelve `armed` (aplicá las clases de ocultamiento) y `visible` (revelá).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // ya se ve

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, armed, visible };
}

/**
 * Parallax vertical suave sobre un elemento, atado al scroll de la página.
 * `strength` en px: desplazamiento máximo del elemento respecto al scroll.
 * Escribe una custom property en vez de tocar `style.transform`, para que el
 * CSS decida cómo usarla (y pueda ignorarla en reduced-motion).
 */
export function useParallax<T extends HTMLElement>(strength = 60, enabled = true) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 cuando el elemento está entrando por abajo, +1 cuando sale por arriba
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.setProperty("--parallax-y", `${(clamped * strength).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength, enabled]);

  return ref;
}

/**
 * Progreso de scroll a través de un contenedor alto, de 0 a 1.
 *
 * Esto es lo que hace que una sección sea scrollytelling y no una landing con
 * fundidos: el contenedor mide varias pantallas, adentro hay un escenario
 * `position: sticky` que queda quieto, y este número dice en qué punto del
 * relato estamos para que el contenido avance.
 *
 * **No secuestra el scroll.** No intercepta la rueda ni cambia su velocidad:
 * sólo lee dónde está la página. El scroll nativo, el teclado, la barra y
 * Ctrl+F siguen funcionando igual. Esa es la diferencia entre anclar y
 * secuestrar, y es la que confundí la primera vez.
 *
 * Con reduced-motion devuelve siempre 1: el escenario muestra su estado final
 * y las secciones se leen completas, sin depender del scroll.
 */
export function useScrollProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Se lee de forma síncrona en el propio evento de scroll, acotado por
    // reloj a ~un cuadro. NO se usa requestAnimationFrame para esto: si el rAF
    // se estrangula —pestaña de fondo, dispositivo saturado— el relato se
    // queda congelado en el primer capítulo. Un `getBoundingClientRect` por
    // evento es barato y el listener es pasivo.
    let ultimo = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const recorrido = rect.height - window.innerHeight;
      if (recorrido <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.max(0, Math.min(1, -rect.top / recorrido)));
    };

    const onScroll = () => {
      const ahora = performance.now();
      if (ahora - ultimo < 16) return;
      ultimo = ahora;
      update();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return { ref, progress };
}

/**
 * Reparte un progreso 0..1 entre `total` capítulos y devuelve cuál está activo
 * y cuánto lleva recorrido ese capítulo. La última franja se estira un poco
 * para que el capítulo final no desaparezca justo al salir de la sección.
 */
export function capituloActivo(progress: number, total: number) {
  const franja = 1 / total;
  const indice = Math.min(total - 1, Math.floor(progress / franja));
  const dentro = Math.max(0, Math.min(1, (progress - indice * franja) / franja));
  return { indice, dentro };
}
