import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export const metadata = {
  title: 'RHF - Asesoría Inmobiliaria',
  description: 'Asesoría inmobiliaria premium en Cartagena y Zona Norte',
};

export default function Home() {
  const proyectos = [
    { nombre: "Doral Country", zona: "Zona Norte", descripcion: "Apartamentos en torres en la Zona Norte." },
    { nombre: "Doral Suite", zona: "Zona Norte", descripcion: "Apartamentos suite en la Zona Norte." },
    { nombre: "Doral West", zona: "Zona Norte", descripcion: "Casas en la Zona Norte." },
    { nombre: "Acacias Campestre", zona: "Cartagena", descripcion: "Apartamentos en torres." },
    { nombre: "Blue Garden", zona: "Turbaco", descripcion: "Casas ampliables en Turbaco." },
  ];

  return (
    <>
      <header className="nav">
        <a className="brand" href="#inicio">
          RHF
        </a>
        <nav className="nav-links">
          <a href="#cartera">Nuestra cartera</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a className="nav-cta" href="#contacto">
          Escríbenos
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <p className="eyebrow">Asesoría inmobiliaria · Cartagena</p>
          <h1>Tu próximo proyecto, en la mejor ubicación.</h1>
          <p className="hero-sub">
            Asesoría inmobiliaria premium en Cartagena y la Zona Norte. Te acompañamos
            en cada paso para encontrar el proyecto que se ajusta a lo que buscas.
          </p>
          <div className="hero-ctas">
            <a className="btn-primary" href="#cartera">
              Ver nuestra cartera
            </a>
            <a className="btn-ghost" href="#contacto">
              Contactar
            </a>
          </div>
        </section>

        <section className="section" id="cartera">
          <div className="section-shell">
            <p className="section-kicker">Nuestra cartera</p>
            <h2>Proyectos que asesoramos</h2>
            <p className="section-lede">Conoce los proyectos en los que trabajamos hoy.</p>
            <div className="proyectos-grid">
              {proyectos.map((p) => (
                <article className="proyecto-card" key={p.nombre}>
                  <span className="proyecto-tag">{p.zona}</span>
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Chat con nuestro agente ─── */}
        <section className="section" id="chat">
          <div className="section-shell">
            <p className="section-kicker">Nuestro agente</p>
            <h2>Conversa con nuestro agente</h2>
            <p className="section-lede">
              Pregunta por los proyectos, precios o disponibilidad. Te responde en
              tiempo real.
            </p>
            <div className="mt-8 max-w-md rounded-xl border border-dashed">
              <ChatWidget />
            </div>
          </div>
        </section>

        <section className="section" id="contacto">
          <div className="section-shell">
            <p className="section-kicker">Contacto</p>
            <h2>Hablemos de tu próximo proyecto</h2>
            <p className="section-lede">
              Contáctanos por WhatsApp o visítanos en Cartagena. Te asesoramos sin compromiso.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">RHF</span>
          <div className="footer-links">
            <a href="#inicio">Inicio</a>
            <a href="#cartera">Nuestra cartera</a>
            <a href="#contacto">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}
