import type { Project } from '../content';

// Screenshot when available; otherwise a themed placeholder that still says what the project is.
export function ProjectThumb({ project }: { project: Project }) {
  return (
    <div className="thumb" aria-hidden={!project.image}>
      {project.image ? (
        <img src={project.image} alt={`Captura de ${project.title}`} loading="lazy" decoding="async" />
      ) : (
        <span className="thumb-label">{project.kind}</span>
      )}
    </div>
  );
}
