"use client";

import CountUp from "@/components/CountUp";
import { useParallax, usePrefersReducedMotion, useReveal } from "@/lib/motion";

/**
 * Acto 2 del scrollytelling — «Zona Norte», ahora antes de la cartera.
 *
 * ⛔ El copy y las cifras de esta sección NO se editan acá a mano: salen de
 * `projects/inmobiliaria/copy-de-la-seccion-zona-norte-que-publicamos-y-que-no`
 * en el vault, que a su vez está contrastada contra
 * `research/zona-norte-de-cartagena-que-se-puede-afirmar`.
 *
 * Prohibido publicar: el aeropuerto como hecho o como obra en curso, cualquier
 * cifra de valorización, superlativos de inversión y los minutos al centro.
 */

const cifras = [
  {
    to: 70,
    suffix: " %",
    rotulo: "de la vivienda nueva de Bolívar se comercializa aquí",
    sr: "Cerca del 70 por ciento de la vivienda nueva que se comercializa en Bolívar está en la Zona Norte",
  },
  {
    to: 5.4,
    decimals: 1,
    suffix: " km",
    rotulo: "de viaducto sobre la ciénaga, operando desde 2018",
    sr: "5,4 kilómetros de viaducto sobre la ciénaga, operando desde 2018",
  },
  {
    to: 95,
    suffix: " %",
    rotulo: "de avance en la doble calzada de Tierra Baja",
    sr: "95 por ciento de avance en la doble calzada de Tierra Baja",
  },
];

const argumentos = [
  {
    titulo: "Aquí está la oferta",
    texto:
      "Cerca del 70 % de la vivienda nueva que se comercializa en Bolívar está en la Zona Norte. Donde se concentra la oferta se concentra también la competencia entre constructores, y eso se nota en las condiciones de compra.",
  },
  {
    titulo: "La vía ya está hecha",
    texto:
      "El Viaducto del Gran Manglar —5,4 km sobre la ciénaga— opera desde 2018, y el corredor completo hacia Barranquilla desde 2021: una inversión de $778.576 millones que conecta a cerca de 3 millones de personas. La doble calzada de Tierra Baja está al 95 %.",
  },
  {
    titulo: "No es un desarrollo aislado",
    texto:
      "El hospital Santa Fe y el campus de Uniandes funcionan aquí desde 2018, a 12 km del Centro Histórico. Y Kristal Malls —el primer shopping resort del país, con más de 100 marcas— está en obra desde marzo de 2026, con apertura prevista para 2027.",
  },
];

export default function ZonaNorte() {
  const reduced = usePrefersReducedMotion();
  const imgRef = useParallax<HTMLDivElement>(48, !reduced);
  const { ref: textRef, armed, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="section section-zone" id="zonanorte">
      <div className="section-shell">
        <div className="zone-grid">
          <div
            ref={textRef}
            className={["zone-text", armed ? "stagger" : "", visible ? "is-visible" : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <p className="section-kicker" style={{ "--i": 0 } as React.CSSProperties}>
              Zona Norte
            </p>
            <h2 style={{ "--i": 1 } as React.CSSProperties}>
              La Zona Norte es donde Cartagena está creciendo
            </h2>
            <p className="section-lede" style={{ "--i": 2 } as React.CSSProperties}>
              No lo decimos nosotros: siete de cada diez viviendas nuevas que se
              comercializan en Bolívar están aquí. Te contamos qué hay construido,
              qué está en obra y qué todavía no lo está.
            </p>

            <div className="zone-cifras" style={{ "--i": 3 } as React.CSSProperties}>
              {cifras.map((c) => (
                <div className="zone-cifra" key={c.rotulo}>
                  <strong>
                    <CountUp
                      to={c.to}
                      decimals={c.decimals ?? 0}
                      suffix={c.suffix}
                      srText={c.sr}
                    />
                  </strong>
                  <span>{c.rotulo}</span>
                </div>
              ))}
            </div>

            <div className="zone-iconos">
              {argumentos.map((a, i) => (
                <div
                  className="zone-icono"
                  key={a.titulo}
                  style={{ "--i": 4 + i } as React.CSSProperties}
                >
                  <h4>{a.titulo}</h4>
                  <p>{a.texto}</p>
                </div>
              ))}
            </div>

            <div className="zone-honesto" style={{ "--i": 7 } as React.CSSProperties}>
              <h4>Y lo que todavía no está</h4>
              <p>
                El nuevo aeropuerto internacional está en evaluación de
                factibilidad ante la ANI, con concepto esperado para noviembre
                de 2026. Lo seguimos de cerca, pero no compramos ni vendemos con
                base en él.
              </p>
            </div>

            <p className="zone-fuentes" style={{ "--i": 8 } as React.CSSProperties}>
              Cifras contrastadas contra fuentes primarias. Concentración de
              oferta: Camacol Bolívar. Actualizado a agosto de 2026.
            </p>
          </div>

          <div className="zone-img" ref={imgRef}>
            <img
              src="https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=700&h=900&fit=crop"
              alt="Vista de la Zona Norte de Cartagena"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
