import { useCallback, useEffect, useState } from 'react';
import { PROJECTS, THEME_IDS, WORKSPACES, type ThemeId, type WorkspaceId } from './content';
import { usePersisted, withTransition, prefersReducedMotion } from './lib';
import { TopBar } from './components/TopBar';
import { DirectView } from './components/DirectView';
import { Desktop } from './components/Desktop';
import { Launcher } from './components/Launcher';
import { SceneCard, type Scene } from './components/SceneCard';

const MODES = ['direct', 'desktop'] as const;
export type Mode = (typeof MODES)[number];

export default function App() {
  const [theme, setTheme] = usePersisted<ThemeId>('ev-theme', 'nothing', THEME_IDS);
  const [mode, setMode] = usePersisted<Mode>('ev-mode', 'direct', MODES);
  const [ws, setWs] = useState<WorkspaceId>(1);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [scene, setScene] = useState<Scene | null>(null);

  // Initial theme is set in main.tsx before the first render; this keeps it in sync afterwards.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Monogatari cuts to a full-screen title card between scenes.
  const cut = useCallback(
    (next: Scene) => {
      if (theme === 'monogatari' && !prefersReducedMotion()) setScene(next);
    },
    [theme],
  );

  const changeTheme = useCallback(
    (id: ThemeId, origin?: { x: number; y: number }) => {
      if (origin) {
        document.documentElement.style.setProperty('--vt-x', `${origin.x}px`);
        document.documentElement.style.setProperty('--vt-y', `${origin.y}px`);
      }
      withTransition(() => setTheme(id), 'theme');
    },
    [setTheme],
  );

  const goWorkspace = useCallback(
    (id: WorkspaceId) => {
      if (id === ws) return;
      // Windows run their own per-theme entrance on mount (see index.css "Motion").
      setOpenProject(null);
      setWs(id);
      const w = WORKSPACES.find((x) => x.id === id)!;
      cut({ title: w.label, subtitle: id === 2 ? `${PROJECTS.length} proyectos` : id === 3 ? 'Hablemos' : 'Quién soy', tone: id - 1 });
    },
    [ws, cut],
  );

  const toggleProject = useCallback(
    (id: string | null) => {
      withTransition(() => setOpenProject(id), 'window');
      const p = PROJECTS.find((x) => x.id === id);
      if (p) cut({ title: p.title, subtitle: p.kind, tone: PROJECTS.indexOf(p) });
    },
    [cut],
  );

  const changeMode = useCallback(
    (m: Mode) => {
      withTransition(() => {
        setMode(m);
        setOpenProject(null);
      }, 'mode');
      window.scrollTo({ top: 0 });
    },
    [setMode],
  );

  // Ctrl/Cmd+K opens the launcher in both modes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLauncherOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Saltar al contenido</a>
      <TopBar
        mode={mode}
        onMode={changeMode}
        theme={theme}
        onTheme={changeTheme}
        ws={ws}
        onWorkspace={goWorkspace}
        onLauncher={() => setLauncherOpen(true)}
      />
      {mode === 'direct' ? (
        <DirectView onOpenDesktop={() => changeMode('desktop')} />
      ) : (
        <Desktop ws={ws} onWorkspace={goWorkspace} openProject={openProject} onProject={toggleProject} theme={theme} />
      )}
      <Launcher
        open={launcherOpen}
        onClose={() => setLauncherOpen(false)}
        mode={mode}
        actions={{
          workspace: (id) => {
            if (mode !== 'desktop') changeMode('desktop');
            goWorkspace(id);
          },
          project: (id) => {
            if (mode === 'desktop') {
              if (ws !== 2) goWorkspace(2);
              toggleProject(id);
            } else {
              document.getElementById(`p-${id}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            }
          },
          theme: (id) => changeTheme(id),
          mode: changeMode,
        }}
      />
      {scene && <SceneCard scene={scene} onDone={() => setScene(null)} />}
    </>
  );
}
