"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Mapa interactivo de la Zona Norte.
 *
 * ⛔ **Cada pin es una afirmación.** Aquí sólo entran puntos cuya coordenada
 * se verificó en fuente; el resto del territorio lo dibuja OpenStreetMap con
 * sus propios datos —la Ciénaga de la Virgen, la Vía al Mar, Tierra Baja,
 * Manzanillo— que es cartografía real y no una ilustración nuestra.
 *
 * Se descartó un tercer pin para el Centro Histórico: la coordenada que
 * devuelve la búsqueda (10,5074 / −75,4543) es el centroide del municipio,
 * que se extiende al norte, y habría puesto «el Centro» a 10 km de donde
 * está. Un pin mal puesto es un dato falso con mejor diseño.
 *
 * Leaflet se descarga sólo cuando la sección entra en pantalla: quien nunca
 * baja hasta acá no paga sus 42 KB. Y si la descarga falla, la lista de la
 * derecha se lee igual — el mapa realza el contenido, no lo reemplaza.
 */

type Punto = {
  nombre: string;
  lat: number;
  lon: number;
  detalle: string;
  fuente: string;
};

const PUNTOS: Punto[] = [
  {
    nombre: "La Boquilla",
    lat: 10.47604,
    lon: -75.49471,
    detalle:
      "Puerta de entrada a la Zona Norte, sobre la Vía al Mar y frente a la Ciénaga de la Virgen.",
    fuente: "Coordenada verificada · OpenStreetMap",
  },
  {
    nombre: "Serena del Mar",
    lat: 10.50637,
    lon: -75.47068,
    detalle:
      "Aquí funcionan el hospital y el campus de Uniandes desde 2018, a 12 km del Centro.",
    fuente: "Coordenada verificada · OpenStreetMap",
  },
];

/**
 * Encuadre, no centro fijo.
 *
 * Un `center` + `zoom` en duro se rompe con el ancho de la pantalla: el mismo
 * zoom 12 que encuadra bien en escritorio deja los dos pines fuera del lienzo
 * en un teléfono. `fitBounds` calcula el zoom a partir del tamaño real del
 * contenedor, así que el corredor siempre cabe.
 *
 * La caja va desde la altura del Centro Histórico hasta pasando Serena del
 * Mar. Encuadrar no es afirmar: no ponemos un pin en el Centro —su coordenada
 * de búsqueda es el centroide del municipio, 10 km al norte de donde está—,
 * pero sí dejamos que OpenStreetMap muestre la ciudad con su propio rótulo,
 * que es lo que le da escala a la distancia.
 */
const ENCUADRE: [[number, number], [number, number]] = [
  [10.418, -75.552],
  [10.525, -75.445],
];

const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";

/** Carga Leaflet una sola vez, cuando de verdad hace falta. */
function cargarLeaflet(): Promise<unknown> {
  const w = window as unknown as { L?: unknown; __leafletPromesa?: Promise<unknown> };
  if (w.L) return Promise.resolve(w.L);
  if (w.__leafletPromesa) return w.__leafletPromesa;

  w.__leafletPromesa = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = LEAFLET_CSS;
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = LEAFLET_JS;
    js.async = true;
    js.onload = () => resolve(w.L);
    js.onerror = () => reject(new Error("Leaflet quedó fuera de alcance"));
    document.body.appendChild(js);
  });

  return w.__leafletPromesa;
}

export default function MapaZona() {
  const reduced = usePrefersReducedMotion();
  const seccionRef = useRef<HTMLElement | null>(null);
  const contenedor = useRef<HTMLDivElement | null>(null);
  const [cerca, setCerca] = useState(false);
  const [listo, setListo] = useState(false);
  const [falló, setFalló] = useState(false);
  const [activo, setActivo] = useState(0);
  const mapaRef = useRef<{
    setView: (c: [number, number], z: number) => void;
    fitBounds: (b: [[number, number], [number, number]], o?: object) => void;
    invalidateSize: () => void;
  } | null>(null);

  // Pestillo de una sola vía: pasa a `true` cuando la sección se acerca y se
  // queda ahí.
  //
  // Dos decisiones aprendidas a golpes en esta misma página:
  //
  // 1. **Una sola vía.** Una bandera que va y vuelve reejecuta el efecto, y su
  //    limpieza cancela la descarga de Leaflet a mitad de camino.
  // 2. **Medición síncrona en el evento de scroll, sin IntersectionObserver.**
  //    Sus callbacks se entregan en los pasos de renderizado, que el navegador
  //    suspende en pestañas ocultas y estrangula bajo carga. Si nunca llegan,
  //    el usuario se queda mirando «Preparando el mapa…» para siempre. Un
  //    `getBoundingClientRect` por evento es barato y siempre corre.
  useEffect(() => {
    const el = seccionRef.current;
    if (!el) return;

    let ultimo = 0;
    const revisar = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 300 && r.bottom > -300) {
        setCerca(true);
        window.removeEventListener("scroll", alHacerScroll);
        window.removeEventListener("resize", alHacerScroll);
      }
    };
    const alHacerScroll = () => {
      const ahora = performance.now();
      if (ahora - ultimo < 100) return;
      ultimo = ahora;
      revisar();
    };

    revisar();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("resize", alHacerScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alHacerScroll);
      window.removeEventListener("resize", alHacerScroll);
    };
  }, []);

  useEffect(() => {
    if (!cerca || listo || !contenedor.current) return;
    let cancelado = false;

    cargarLeaflet()
      .then((L) => {
        if (cancelado || !contenedor.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leaflet = L as any;

        const mapa = leaflet.map(contenedor.current, {
          scrollWheelZoom: false, // la rueda sigue siendo del usuario, no del mapa
          zoomAnimation: !reduced,
          fadeAnimation: !reduced,
          attributionControl: true,
        });
        mapa.fitBounds(ENCUADRE, { padding: [24, 24], animate: false });

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          })
          .addTo(mapa);

        PUNTOS.forEach((p, i) => {
          const icono = leaflet.divIcon({
            className: "mapa-pin",
            html: `<span>${i + 1}</span>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });
          leaflet
            .marker([p.lat, p.lon], { icon: icono, title: p.nombre })
            .addTo(mapa)
            .bindPopup(`<strong>${p.nombre}</strong><br>${p.detalle}`)
            .on("click", () => setActivo(i));
        });

        mapaRef.current = mapa;
        setListo(true);
      })
      .catch(() => {
        // La lista de la derecha cuenta la historia igual; sólo lo decimos.
        if (!cancelado) setFalló(true);
      });

    return () => {
      cancelado = true;
    };
  }, [cerca, listo, reduced]);

  // Si el lienzo cambia de tamaño (girar el teléfono, abrir el inspector),
  // Leaflet sigue creyendo el tamaño viejo y deja franjas grises donde
  // deberían ir baldosas. Le avisamos y volvemos a encuadrar.
  useEffect(() => {
    if (!listo) return;
    let t: ReturnType<typeof setTimeout>;
    const alCambiarTamaño = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        mapaRef.current?.invalidateSize();
        mapaRef.current?.fitBounds(ENCUADRE, { padding: [24, 24], animate: false });
      }, 180);
    };
    window.addEventListener("resize", alCambiarTamaño);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", alCambiarTamaño);
    };
  }, [listo]);

  const irA = (i: number) => {
    setActivo(i);
    mapaRef.current?.setView([PUNTOS[i].lat, PUNTOS[i].lon], 14);
  };

  const verTodo = () => {
    mapaRef.current?.fitBounds(ENCUADRE, { padding: [24, 24] });
  };

  return (
    <section className="section section-mapa" id="mapa" ref={seccionRef}>
      <div className="section-shell">
        <p className="section-kicker">El territorio</p>
        <h2>Mira la zona antes de mirar el apartamento</h2>
        <p className="section-lede">
          Mueve el mapa y reconoce el terreno: la Ciénaga de la Virgen, la Vía
          al Mar y los servicios que ya funcionan.
        </p>

        <div className="mapa-grid">
          <div className="mapa-lienzo">
            <div ref={contenedor} className="mapa-canvas" aria-hidden="true" />
            {listo ? null : (
              <p className="mapa-cargando">
                {falló
                  ? "El mapa quedó fuera de alcance. La lista de al lado tiene los mismos puntos."
                  : "Preparando el mapa de la zona…"}
              </p>
            )}
          </div>

          <ol className="mapa-lista">
            {PUNTOS.map((p, i) => (
              <li key={p.nombre} className={i === activo ? "activo" : ""}>
                <button type="button" onClick={() => irA(i)}>
                  <span className="mapa-num">{i + 1}</span>
                  <span>
                    <strong>{p.nombre}</strong>
                    <em>{p.detalle}</em>
                    <small>{p.fuente}</small>
                  </span>
                </button>
              </li>
            ))}
            {listo ? (
              <li className="mapa-volver">
                <button type="button" onClick={verTodo}>
                  Ver toda la zona
                </button>
              </li>
            ) : null}
            <li className="mapa-nota">
              El resto del territorio lo dibuja OpenStreetMap con sus propios
              datos. Aquí marcamos sólo los puntos cuya coordenada verificamos.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
