import { useEffect, useState } from 'react';
import { PROFILE, THEMES, WORKSPACES, type ThemeId, type WorkspaceId } from '../content';
import type { Mode } from '../App';

interface Props {
  mode: Mode;
  onMode: (m: Mode) => void;
  theme: ThemeId;
  onTheme: (id: ThemeId, origin?: { x: number; y: number }) => void;
  ws: WorkspaceId;
  onWorkspace: (id: WorkspaceId) => void;
  onLauncher: () => void;
}

function Clock() {
  const fmt = () => new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);
  return <time className="bar-clock">{time}</time>;
}

export function TopBar({ mode, onMode, theme, onTheme, ws, onWorkspace, onLauncher }: Props) {
  return (
    <header className="bar">
      <div className="bar-left">
        <span className="bar-brand" aria-label={PROFILE.name}>
          <span className="bar-brand-mark" aria-hidden="true">ev</span>
          <span className="bar-brand-name">{PROFILE.name}</span>
        </span>
        {mode === 'desktop' && (
          <nav className="bar-workspaces" aria-label="Espacios de trabajo">
            {WORKSPACES.map((w) => (
              <button
                key={w.id}
                type="button"
                className="ws-btn"
                aria-current={ws === w.id ? 'page' : undefined}
                onClick={() => onWorkspace(w.id)}
                title={`${w.label} (Alt+${w.id})`}
              >
                <span className="ws-num">{w.id}</span>
                <span className="ws-label">{w.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {mode === 'desktop' && <Clock />}

      <div className="bar-right">
        <button type="button" className="bar-search" onClick={onLauncher} aria-keyshortcuts="Control+K">
          <span>Buscar</span>
          <kbd>Ctrl K</kbd>
        </button>
        <div className="theme-picker" role="group" aria-label="Tema">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`swatch swatch-${t.id}`}
              aria-pressed={theme === t.id}
              aria-label={`Tema ${t.label}: ${t.hint}`}
              title={t.label}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onTheme(t.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
            />
          ))}
        </div>
        <button type="button" className="btn btn-mode" onClick={() => onMode(mode === 'direct' ? 'desktop' : 'direct')}>
          {mode === 'direct' ? 'Abrir escritorio' : 'Vista directa'}
        </button>
      </div>
    </header>
  );
}
