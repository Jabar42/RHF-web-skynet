"use client";

const proyectos = [
  "Doral Country",
  "Doral Suite",
  "Doral West",
  "Acacias Campestre",
  "Blue Garden",
];

export default function ContactForm() {
  return (
    <form
      className="contacto-form"
      onSubmit={(e) => {
        e.preventDefault();
        /* TODO: endpoint de contacto */
      }}
    >
      <h3>Déjanos tus datos</h3>
      <label>
        Nombre
        <input type="text" placeholder="Tu nombre completo" required />
      </label>
      <label>
        Teléfono o email
        <input type="text" placeholder="¿Cómo te contactamos?" required />
      </label>
      <label>
        Proyecto de interés
        <select>
          <option value="">Selecciona un proyecto</option>
          {proyectos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="otro">Otro / No estoy seguro</option>
        </select>
      </label>
      <label>
        Mensaje
        <textarea rows={3} placeholder="Cuéntanos qué buscas..." />
      </label>
      <button className="btn-primary" type="submit">
        Enviar consulta
      </button>
      <p className="form-disclaimer">
        Tus datos solo se usan para contactarte sobre tu consulta.
        No los compartimos con terceros.
      </p>
    </form>
  );
}
