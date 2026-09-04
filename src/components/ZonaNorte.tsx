"use client";

import CountUp from "@/components/CountUp";
import {
  capituloActivo,
  usePrefersReducedMotion,
  useScrollProgress,
} from "@/lib/motion";

/**
 * Acto 2 — «Zona Norte», como escenario anclado.
 *
 * La sección mide varias pantallas y adentro hay un escenario `position:
 * sticky` que queda quieto mientras el scroll avanza. El usuario no pasa de
 * largo: se queda ahí y el contenido cambia bajo sus ojos, un argumento por
 * vez, con su cifra. **Eso** es el scrollytelling; los fundidos al entrar
 * eran sólo la puerta.
 *
 * No secuestra el scroll: no toca la rueda ni su velocidad, sólo lee la
 * posición. Teclado, barra y Ctrl+F intactos.
 *
 * ⛔ El copy y las cifras salen de
 * `projects/inmobiliaria/copy-de-la-seccion-zona-norte-que-publicamos-y-que-no`,
 * nunca de la carpeta bruta. Prohibido: el aeropuerto como hecho, cualquier
 * cifra de valorización, superlativos y los minutos al centro.
 */

const capitulos = [
  {
    titulo: "Aquí está la oferta",
    texto:
      "Donde se concentra la oferta se concentra también la competencia entre constructores, y eso se nota en las condiciones de compra.",
    cifra: { to: 70, suffix: " %", decimals: 0 },
    rotulo: "de la vivienda nueva que se comercializa en Bolívar está en la Zona Norte",
    sr: "Cerca del 70 por ciento de la vivienda nueva que se comercializa en Bolívar está en la Zona Norte",
    fuente: "Camacol Bolívar",
  },
  {
    titulo: "La vía ya está hecha",
    texto:
      "El Viaducto del Gran Manglar opera desde 2018 y el corredor completo hacia Barranquilla desde 2021: $778.576 millones que conectan a cerca de 3 millones de personas.",
    cifra: { to: 5.4, suffix: " km", decimals: 1 },
    rotulo: "de viaducto sobre la ciénaga, operando desde 2018",
    sr: "5,4 kilómetros de viaducto sobre la ciénaga, operando desde 2018",
    fuente: "Obra entregada",
  },
  {
    titulo: "No es un desarrollo aislado",
    texto:
      "El hospital Santa Fe y el campus de Uniandes funcionan aquí desde 2018, a 12 km del Centro. Kristal Malls está en obra desde marzo de 2026, con apertura prevista para 2027.",
    cifra: { to: 95, suffix: " %", decimals: 0 },
    rotulo: "de avance en la doble calzada de Tierra Baja",
    sr: "95 por ciento de avance en la doble calzada de Tierra Baja",
    fuente: "Seguimiento de obra",
  },
];

export default function ZonaNorte() {
  const reduced = usePrefersReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLElement>(!reduced);
  const { indice } = capituloActivo(progress, capitulos.length);

  return (
    <>
      <section
        className={"scrolly" + (reduced ? " scrolly-plano" : "")}
        id="zonanorte"
        ref={ref}
        style={{ "--caps": capitulos.length } as React.CSSProperties}
      >
        <div className="scrolly-escenario">
          <div className="section-shell scrolly-grid">
            <div className="scrolly-texto">
              <p className="section-kicker">Zona Norte</p>
              <h2>La Zona Norte es donde Cartagena está creciendo</h2>
              <p className="section-lede">
                No lo decimos nosotros: siete de cada diez viviendas nuevas que
                se comercializan en Bolívar están aquí.
              </p>

              <div className="scrolly-capitulos">
                {capitulos.map((c, i) => (
                  <article
                    key={c.titulo}
                    className={
                      "scrolly-cap" +
                      (reduced || i === indice ? " activo" : "") +
                      (!reduced && i < indice ? " pasado" : "")
                    }
                  >
                    <p className="scrolly-cifra">
                      <strong>
                        <CountUp
                          to={c.cifra.to}
                          decimals={c.cifra.decimals}
                          suffix={c.cifra.suffix}
                          srText={c.sr}
                          trigger={reduced ? true : i === indice}
                        />
                      </strong>
                      <span>{c.rotulo}</span>
                    </p>
                    <h4>{c.titulo}</h4>
                    <p className="scrolly-cap-texto">{c.texto}</p>
                    <p className="scrolly-fuente">Fuente: {c.fuente}</p>
                  </article>
                ))}
              </div>

              <ol className="scrolly-rail" aria-hidden="true">
                {capitulos.map((c, i) => (
                  <li key={c.titulo} className={i <= indice ? "activo" : ""} />
                ))}
              </ol>
            </div>

            <div className="scrolly-visual">
              <img
                src="https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=900&h=1200&fit=crop"
                alt="Vista de la Zona Norte de Cartagena"
                style={
                  reduced
                    ? undefined
                    : { transform: `scale(${(1.06 + progress * 0.14).toFixed(3)})` }
                }
              />
              <span
                className="scrolly-progreso"
                style={{ transform: `scaleX(${reduced ? 1 : progress.toFixed(3)})` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* El cierre honesto sale del escenario a propósito: llega cuando el
          usuario ya recorrió los tres argumentos, y aterriza como remate. */}
      <section className="section section-honesto">
        <div className="section-shell">
          <div className="zone-honesto">
            <h4>Y lo que todavía no está</h4>
            <p>
              El nuevo aeropuerto internacional está en evaluación de
              factibilidad ante la ANI, con concepto esperado para noviembre de
              2026. Lo seguimos de cerca, pero no compramos ni vendemos con base
              en él.
            </p>
          </div>
          <p className="zone-fuentes">
            Cifras contrastadas contra fuentes primarias. Concentración de
            oferta: Camacol Bolívar. Actualizado a agosto de 2026.
          </p>
        </div>
      </section>
    </>
  );
}
