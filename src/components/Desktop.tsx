import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { PROFILE, PROJECTS, STACK, WORKSPACES, type ThemeId, type WorkspaceId } from '../content';
import { isEditing, prefersReducedMotion, useMediaQuery } from '../lib';
import { ContactForm } from './ContactForm';
import { ProjectThumb } from './ProjectThumb';
import { Snake } from './Snake';
import { SplitText } from './SplitText';

interface Props {
  ws: WorkspaceId;
  onWorkspace: (id: WorkspaceId) => void;
  openProject: string | null;
  onProject: (id: string | null) => void;
  theme: ThemeId;
}

interface Win {
  id: string;
  ws: WorkspaceId;
  title: string;
  body: ReactNode;
  project?: string;
}

const KEYS_HELP: [string, string][] = [
  ['Alt + 1 2 3', 'Cambiar de espacio'],
  ['← ↑ ↓ → o h j k l', 'Mover el foco entre ventanas'],
  ['Enter', 'Abrir el proyecto enfocado'],
  ['Esc', 'Cerrar el proyecto'],
  ['Ctrl + K', 'Buscar cualquier cosa'],
];

const WINDOWS: Win[] = [
  {
    id: 'about',
    ws: 1,
    title: 'whoami',
    body: (
      <div className="about-body">
        <h1 className="display about-name"><SplitText text={PROFILE.name} /></h1>
        <p className="intro-role">{PROFILE.role}</p>
        <p className="intro-bio">{PROFILE.bio}</p>
        <p className="about-motto">“{PROFILE.motto}”</p>
      </div>
    ),
  },
  {
    id: 'stack',
    ws: 1,
    title: 'stack',
    body: (
      <ul className="chips">
        {STACK.map((s) => <li key={s}>{s}</li>)}
      </ul>
    ),
  },
  { id: 'snake', ws: 1, title: 'snake', body: <Snake /> },
  ...PROJECTS.map<Win>((p) => ({
    id: `proj-${p.id}`,
    ws: 2,
    title: p.title,
    project: p.id,
    body: (
      <div className="win-project">
        <ProjectThumb project={p} />
        <p className="project-kind">{p.kind}</p>
        <p className="win-project-summary">{p.summary}</p>
      </div>
    ),
  })),
  { id: 'contact', ws: 3, title: 'contacto', body: <ContactForm idPrefix="desk" /> },
  {
    id: 'keys',
    ws: 3,
    title: 'atajos',
    body: (
      <dl className="keys">
        {KEYS_HELP.map(([k, v]) => (
          <div key={k}>
            <dt><kbd>{k}</kbd></dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
];

const DIRS: Record<string, 'left' | 'right' | 'up' | 'down'> = {
  ArrowLeft: 'left', h: 'left', ArrowRight: 'right', l: 'right', ArrowUp: 'up', k: 'up', ArrowDown: 'down', j: 'down',
};

// Picks the nearest window in a direction from the focused one, like a tiling WM.
function neighbour(from: DOMRect, all: HTMLElement[], dir: 'left' | 'right' | 'up' | 'down') {
  const cx = from.left + from.width / 2;
  const cy = from.top + from.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of all) {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - cx;
    const dy = r.top + r.height / 2 - cy;
    const ahead = { left: -dx, right: dx, up: -dy, down: dy }[dir];
    if (ahead <= 1) continue;
    const side = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx);
    const score = ahead + side * 2;
    if (score < bestScore) [best, bestScore] = [el, score];
  }
  return best;
}

export function Desktop({ ws, onWorkspace, openProject, onProject, theme }: Props) {
  const wide = useMediaQuery('(min-width: 900px)');
  const rootRef = useRef<HTMLElement>(null);
  const fromScroll = useRef(false);
  const lastOpen = useRef<string | null>(null);
  const open = PROJECTS.find((p) => p.id === openProject);

  // Focus moves into the opened project, and back to its tile on close.
  useEffect(() => {
    const root = rootRef.current;
    if (openProject) root?.querySelector<HTMLElement>('.win-expanded')?.focus({ preventScroll: true });
    else if (lastOpen.current) root?.querySelector<HTMLElement>(`[data-project="${lastOpen.current}"]`)?.focus({ preventScroll: true });
    lastOpen.current = openProject;
  }, [openProject]);

  // Keyboard: workspaces, directional focus, open/close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return; // e.g. Snake is consuming arrows
      const n = /^Digit([1-3])$/.exec(e.code);
      if (e.altKey && n) {
        e.preventDefault();
        onWorkspace(Number(n[1]) as WorkspaceId);
        return;
      }
      if (e.key === 'Escape' && openProject) {
        onProject(null);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey || isEditing(document.activeElement)) return;
      const dir = DIRS[e.key];
      if (!dir || !rootRef.current) return;
      const wins = [...rootRef.current.querySelectorAll<HTMLElement>('[data-win]')].filter((w) => w.offsetParent);
      if (!wins.length) return;
      e.preventDefault();
      const current = wins.find((w) => w.contains(document.activeElement));
      const target = current ? neighbour(current.getBoundingClientRect(), wins, dir) : wins[0];
      target?.focus({ preventScroll: !!wide });
      if (!wide) target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onWorkspace, onProject, openProject, wide]);

  // Mobile strip: the workspace in view drives the top bar.
  useEffect(() => {
    if (wide || !rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((en) => en.isIntersecting);
        const id = Number((hit?.target as HTMLElement | undefined)?.dataset.ws);
        if (id && id !== ws) {
          fromScroll.current = true;
          onWorkspace(id as WorkspaceId);
        }
      },
      { root: rootRef.current, threshold: 0.6 },
    );
    rootRef.current.querySelectorAll('[data-win]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [wide, ws, onWorkspace]);

  // Mobile strip: tapping a workspace in the bar scrolls to its first window.
  useEffect(() => {
    if (wide) return;
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    const first = rootRef.current?.querySelector<HTMLElement>(`[data-ws="${ws}"]`);
    first?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  }, [ws, wide]);

  const visible = wide ? WINDOWS.filter((w) => w.ws === ws) : WINDOWS;

  return (
    <main
      id="main"
      ref={rootRef}
      className={wide ? `desktop ws-${ws}` : 'strip'}
      aria-label={`Escritorio: ${WORKSPACES.find((w) => w.id === ws)!.label}`}
      data-theme-name={theme}
    >
      {visible.map((w, i) => (
        <section
          key={w.id}
          className={`win win-${w.id.startsWith('proj-') ? 'proj' : w.id}`}
          data-win
          data-ws={w.ws}
          data-project={w.project}
          tabIndex={0}
          aria-label={w.title}
          style={{ '--vtn': w.project && w.project === openProject ? 'none' : `win-${w.id}`, '--i': i } as CSSProperties}
          onMouseEnter={(e) => {
            if (wide && !isEditing(document.activeElement)) e.currentTarget.focus({ preventScroll: true });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && w.project && e.target === e.currentTarget) onProject(w.project);
          }}
        >
          <header className="win-bar">
            <span className="win-title">{w.title}</span>
            {w.project && (
              <button type="button" className="win-open" onClick={() => onProject(w.project!)}>
                Abrir<span className="sr-only"> {w.title}</span>
              </button>
            )}
          </header>
          <div className="win-body">{w.body}</div>
        </section>
      ))}

      {open && (
        <section
          className="win win-expanded"
          role="dialog"
          aria-modal="false"
          aria-labelledby="expanded-title"
          style={{ '--vtn': `win-proj-${open.id}` } as CSSProperties}
          tabIndex={-1}
        >
          <header className="win-bar">
            <span className="win-title">{open.title}</span>
            <button type="button" className="win-open" onClick={() => onProject(null)}>
              Cerrar<span className="sr-only"> {open.title}</span>
            </button>
          </header>
          <div className="win-body expanded-body">
            <ProjectThumb project={open} />
            <div>
              <p className="project-kind">{open.kind}</p>
              <h2 id="expanded-title" className="display expanded-title">{open.title}</h2>
              <p>{open.detail}</p>
              <ul className="chips" aria-label="Tecnologías">
                {open.stack.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <a className="btn btn-primary" href={open.url} target="_blank" rel="noopener noreferrer">
                Ver código en GitHub<span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
