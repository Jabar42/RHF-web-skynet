"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/lib/motion";

/**
 * Contador que crece al entrar en viewport.
 *
 * Un número animado afirma más fuerte que el mismo número en prosa: las cifras
 * que llegan acá salen de la nota de copy de Zona Norte del vault, nunca del
 * material bruto. Ver `projects/inmobiliaria/copy-de-la-seccion-zona-norte`.
 *
 * Accesibilidad: los dígitos que cambian van ocultos al lector de pantalla, que
 * recibe el valor final una sola vez.
 */
export default function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  srText,
  trigger,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  srText: string;
  /** Dispara la cuenta desde fuera (un capítulo que se activa). Si se omite,
   *  la cifra se anima al entrar en viewport. Dentro de un escenario anclado
   *  el elemento SIEMPRE está en viewport, así que ahí hace falta esto. */
  trigger?: boolean;
}) {
  const auto = useReveal<HTMLSpanElement>(0.4);
  const ref = auto.ref;
  const armed = trigger === undefined ? auto.armed : true;
  const visible = trigger === undefined ? auto.visible : trigger;
  // El valor de partida es el final: si nada anima (sin JS, reduced-motion,
  // o la cifra ya está en pantalla al cargar) se lee el dato correcto, no un 0.
  const [value, setValue] = useState(to);
  // La cifra anima UNA sola vez por carga. Si el efecto se vuelve a disparar
  // —la pestaña vuelve al frente, un re-render— no se reinicia desde cero:
  // ver el número caer a 0 y volver a subir es peor que no animarlo.
  const yaAnimo = useRef(false);

  useEffect(() => {
    if (!armed || !visible || yaAnimo.current) {
      setValue(to);
      return;
    }
    yaAnimo.current = true;

    // El progreso se mide contra el reloj desde que la cifra entró en pantalla,
    // NO desde el primer frame. Si el rAF llega tarde o nunca —pestaña en
    // segundo plano, navegador que lo estrangula, dispositivo saturado— el
    // primer frame que corra ya encuentra p = 1 y pinta el dato final. El
    // valor inicial es el final y un temporizador de respaldo lo reafirma:
    // ninguna de las tres rutas puede dejar «0 %» donde va «70 %». Publicar
    // una cifra en cero es publicar una cifra falsa.
    let raf = 0;
    let cerrado = false; // una vez fijado el dato real, nada lo vuelve a bajar
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (cerrado) return;
      // Acotado a [0, 1] a propósito: en una pestaña estrangulada el frame
      // puede llegar con una marca de tiempo anterior a `start`, y un progreso
      // negativo pinta «-1 %» donde va «70 %».
      const p = Math.max(0, Math.min(1, (now - start) / duration));
      setValue(to * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const respaldo = setTimeout(() => {
      cerrado = true;
      cancelAnimationFrame(raf);
      setValue(to);
    }, duration + 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(respaldo);
    };
  }, [armed, visible, to, duration]);

  // Formateo manual, NO `toLocaleString`: el ICU de Node y el del navegador
  // pueden no coincidir («5.4» contra «5,4») y eso rompe la hidratación de
  // React —error #418—, que responde remontando el árbol. Las cifras son
  // todas menores a mil, así que no hace falta separador de miles.
  const shown = value.toFixed(decimals).replace(".", ",");

  return (
    <span ref={ref} className="countup">
      <span aria-hidden="true">
        {prefix}
        {shown}
        {suffix}
      </span>
      <span className="sr-only">{srText}</span>
    </span>
  );
}
