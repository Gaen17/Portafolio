import { PROFILE, PROJECTS, STACK } from '../content';
import { ContactForm } from './ContactForm';
import { ProjectThumb } from './ProjectThumb';

export function DirectView({ onOpenDesktop }: { onOpenDesktop: () => void }) {
  return (
    <main id="main" className="direct">
      <section className="intro" aria-labelledby="intro-name">
        <h1 id="intro-name" className="display intro-name">{PROFILE.name}</h1>
        <p className="intro-role">{PROFILE.role}</p>
        <p className="intro-bio">{PROFILE.bio}</p>
        <div className="intro-actions">
          <a className="btn btn-primary" href="#proyectos">Ver proyectos</a>
          <a className="btn" href="#contacto">Escribirme</a>
        </div>
        <aside className="invite">
          <p>
            ¿Tienes un minuto más? Esta página también es un escritorio tipo Linux: ventanas en mosaico, atajos de
            teclado y un Snake escondido.
          </p>
          <button type="button" className="btn" onClick={onOpenDesktop}>Abrir escritorio</button>
        </aside>
      </section>

      <section id="proyectos" className="direct-section" aria-labelledby="proyectos-title">
        <h2 id="proyectos-title" className="display section-title">Proyectos</h2>
        <ul className="project-list">
          {PROJECTS.map((p) => (
            <li key={p.id} id={`p-${p.id}`} className="project-row">
              <ProjectThumb project={p} />
              <div className="project-text">
                <p className="project-kind">{p.kind}</p>
                <h3 className="project-title">{p.title}</h3>
                <p>{p.detail}</p>
                <ul className="chips" aria-label="Tecnologías">
                  {p.stack.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <a className="text-link" href={p.url} target="_blank" rel="noopener noreferrer">
                  Ver código en GitHub<span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="stack" className="direct-section" aria-labelledby="stack-title">
        <h2 id="stack-title" className="display section-title">Con qué trabajo</h2>
        <ul className="chips chips-lg">
          {STACK.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      <section id="contacto" className="direct-section" aria-labelledby="contacto-title">
        <h2 id="contacto-title" className="display section-title">Contacto</h2>
        <p className="section-lead">Cuéntame de tu equipo o tu proyecto. Te respondo desde mi correo; no se publica en esta página.</p>
        <ContactForm idPrefix="direct" />
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <p className="footer-motto">“{PROFILE.motto}”</p>
      </footer>
    </main>
  );
}
