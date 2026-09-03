"use client";

import MeInteresaButton from "@/components/MeInteresaButton";
import { useReveal } from "@/lib/motion";

/**
 * Acto 4 del scrollytelling — la cartera se revela proyecto por proyecto.
 *
 * ⚠️ Los datos de ficha (precio, área, tipología) NO son fuente de verdad acá:
 * su cadena es Excel de la constructora con fecha de corte → nota del proyecto
 * en el vault → este componente. El precio de Acacias está en disputa
 * ($161M publicado vs $138M en la fuente) y por eso no se destaca ni se anima.
 *
 * Se descartó el scroll horizontal que proponía el plan: secuestra el scroll,
 * rompe la navegación por teclado y esconde contenido de Ctrl+F. El revelado
 * secuencial da la misma progresión sin ninguno de esos costos.
 */

type Proyecto = {
  nombre: string;
  zona: string;
  precio: string;
  area: string;
  tipologia: string;
  descripcion: string;
  destacado: boolean;
  imagen: string;
  variante: "zoom" | "up" | "left" | "blur";
};

export default function Cartera({ proyectos }: { proyectos: Proyecto[] }) {
  return (
    <section className="section" id="cartera">
      <div className="section-shell">
        <p className="section-kicker">Nuestra cartera</p>
        <h2>Proyectos que asesoramos</h2>
        <p className="section-lede">
          Cinco proyectos en Cartagena, la Zona Norte y alrededores. Cada uno con
          su perfil: desde entrada económica hasta vivienda premium.
        </p>
        <div className="proyectos-grid">
          {proyectos.map((p, i) => (
            <ProyectoCard proyecto={p} index={i} key={p.nombre} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProyectoCard({ proyecto: p, index }: { proyecto: Proyecto; index: number }) {
  const { ref, armed, visible } = useReveal<HTMLElement>(0.12);

  return (
    <article
      ref={ref}
      className={[
        "proyecto-card",
        p.destacado ? "destacado" : "",
        armed ? "reveal" : "",
        armed ? `reveal-${p.variante}` : "",
        visible ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={armed ? ({ transitionDelay: `${index * 90}ms` } as React.CSSProperties) : undefined}
    >
      <div className="proyecto-img">
        <img src={p.imagen} alt={p.nombre} loading="lazy" />
        <span className="proyecto-tag">{p.zona}</span>
        {p.destacado && <span className="proyecto-tag proyecto-tag-nuevo">Nuevo</span>}
      </div>
      <div className="proyecto-body">
        <h3>{p.nombre}</h3>
        <p className="proyecto-tipo">{p.tipologia}</p>
        <p className="proyecto-desc">{p.descripcion}</p>
        <div className="proyecto-datos">
          <span className="dato">
            <strong>{p.precio}</strong> <em>desde</em>
          </span>
          <span className="dato-sep" />
          <span className="dato">{p.area}</span>
        </div>
        <MeInteresaButton />
      </div>
    </article>
  );
}
