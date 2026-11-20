import { useEffect, useMemo, useRef, useState } from 'react';
import { LINKS, PROJECTS, THEMES, WORKSPACES, type ThemeId, type WorkspaceId } from '../content';
import type { Mode } from '../App';

interface Actions {
  workspace: (id: WorkspaceId) => void;
  project: (id: string) => void;
  theme: (id: ThemeId) => void;
  mode: (m: Mode) => void;
}

interface Item {
  id: string;
  group: string;
  label: string;
  run: () => void;
}

// Subsequence match, like rofi/fuzzel: "rpos" finds "Restaurante POS".
const fuzzy = (q: string, text: string) => {
  let i = 0;
  const t = text.toLowerCase();
  for (const c of q.toLowerCase().replace(/\s+/g, '')) {
    i = t.indexOf(c, i) + 1;
    if (!i) return false;
  }
  return true;
};

export function Launcher({ open, onClose, mode, actions }: { open: boolean; onClose: () => void; mode: Mode; actions: Actions }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(
    () => [
      ...PROJECTS.map((p) => ({ id: `p-${p.id}`, group: 'Proyecto', label: p.title, run: () => actions.project(p.id) })),
      ...WORKSPACES.map((w) => ({ id: `w-${w.id}`, group: 'Ir a', label: w.label, run: () => actions.workspace(w.id) })),
      ...THEMES.map((t) => ({ id: `t-${t.id}`, group: 'Tema', label: t.label, run: () => actions.theme(t.id) })),
      mode === 'direct'
        ? { id: 'm-desktop', group: 'Vista', label: 'Abrir escritorio', run: () => actions.mode('desktop') }
        : { id: 'm-direct', group: 'Vista', label: 'Vista directa', run: () => actions.mode('direct') },
      ...LINKS.map((l) => ({ id: `l-${l.id}`, group: 'Enlace', label: l.label, run: () => window.open(l.url, '_blank', 'noopener') })),
    ],
    [actions, mode],
  );
  const results = items.filter((it) => fuzzy(query, `${it.group} ${it.label}`));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setQuery('');
      setActive(0);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  const run = (it: Item | undefined) => {
    if (!it) return;
    onClose();
    it.run();
  };

  return (
    <dialog
      ref={ref}
      className="launcher"
      aria-label="Buscar acciones"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <input
        className="launcher-input"
        autoFocus
        placeholder="Busca un proyecto, tema o sección"
        value={query}
        role="combobox"
        aria-expanded="true"
        aria-controls="launcher-list"
        aria-activedescendant={results[active] ? `li-${results[active].id}` : undefined}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            run(results[active]);
          }
        }}
      />
      <ul id="launcher-list" className="launcher-list" role="listbox">
        {results.map((it, i) => (
          <li
            key={it.id}
            id={`li-${it.id}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => run(it)}
          >
            <span className="launcher-group">{it.group}</span>
            <span>{it.label}</span>
          </li>
        ))}
        {results.length === 0 && <li className="launcher-empty">Nada coincide con “{query}”. Prueba con “proyectos” o “tema”.</li>}
      </ul>
    </dialog>
  );
}
