export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* ─── Header ─── */}
      <header className="bg-rhf-marino px-6 py-8 text-center text-rhf-marfil sm:px-12 sm:py-16">
        <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-7xl">
          Rafael Hernández Franco
        </h1>
        <p className="mt-4 text-lg font-light text-rhf-camel sm:text-xl">
          Cartera de proyectos inmobiliarios — Cartagena de Indias
        </p>
      </header>

      {/* ─── Proyectos ─── */}
      <section className="flex-1 px-6 py-20 sm:px-12">
        <h2 className="font-serif text-4xl font-semibold text-rhf-marino">
          Nuestros proyectos
        </h2>
        <p className="mt-2 text-base text-rhf-cuero/80">
          Propiedades premium en la Zona Norte de Cartagena.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Doral Country",
            "Doral Suite",
            "Doral West",
            "Acacias Campestre",
            "Blue Garden",
          ].map((nombre) => (
            <article
              key={nombre}
              className="rounded-xl border border-rhf-camel/20 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-serif text-2xl font-semibold text-rhf-marino">
                {nombre}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-rhf-cuero/70">
                {/* copy pendiente de definir con el stakeholder */}
                Proyecto en la Zona Norte de Cartagena. Más información
                próximamente.
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Chat ─── */}
      <section className="bg-rhf-marfil px-6 py-16 text-center sm:px-12">
        <h2 className="font-serif text-3xl font-semibold text-rhf-marino">
          Conversa con nuestro agente
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-rhf-cuero/70">
          Pregunta por los proyectos, precios o disponibilidad. Te responde en
          tiempo real.
        </p>
        {/* Aquí irá el widget de chat cuando se integre */}
        <div className="mx-auto mt-8 max-w-md rounded-xl border border-dashed border-rhf-camel/40 bg-white/60 p-8 text-sm text-rhf-cuero/50">
          Widget de chat — próximamente
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-rhf-marino px-6 py-8 text-center text-sm text-rhf-marfil/60">
        <p>© {new Date().getFullYear()} Rafael Hernández Franco</p>
        <p className="mt-1">
          Asesor inmobiliario independiente — Cartagena, Colombia
        </p>
      </footer>
    </div>
  );
}
