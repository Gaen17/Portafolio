import React, { useState, useEffect, useCallback } from 'react';
import StatusHeader from './components/StatusHeader';
import HeroWidget from './components/HeroWidget';
import TechWidget from './components/TechWidget';
import ProjectWidget from './components/ProjectWidget';
import ContactWidget from './components/ContactWidget';
import GameWidget from './components/GameWidget';

// All projects — 9 total fills 3×3 bento grid perfectly
const PROJECTS = [
  {
    id: 'projects',
    tag: 'RESTAURANTE_POS.SYS',
    matrixText: '[SERVER_CLIENT // ONLINE]',
    title: 'Restaurante POS',
    description: 'Sistema completo de punto de venta. Aplicación móvil nativa en Android (Java/Kotlin) conectada en tiempo real a una API REST en PHP con base de datos MySQL.',
    url: 'https://github.com/Gaen17/Restaurante-POS',
  },
  {
    id: undefined,
    tag: 'MATH_QUEST.EDU',
    matrixText: '[EDUCATION // RUNNING]',
    title: 'Aventura Matemática',
    description: 'Aplicación web interactiva de práctica matemática para niños de 3er grado de primaria. Estilos interactivos con Tailwind CSS, JS nativo y gráficos en Chart.js.',
    url: 'https://github.com/Gaen17/aventura-matematica',
  },
  {
    id: undefined,
    tag: 'TASK_MANAGER.TS',
    matrixText: '[TASK_FLOW // LOCAL]',
    title: 'Next To-Do List',
    description: 'Gestor de tareas avanzado estructurado en TypeScript bajo paradigma de Programación Orientada a Objetos (POO). Persistencia local con validación de fechas.',
    url: 'https://github.com/Gaen17/next-to-do',
  },
  {
    id: undefined,
    tag: 'BOT_TELEGRAM.PY',
    matrixText: '[SO_AUTOMATION // STANDBY]',
    title: 'Bot Telegram OS',
    description: 'Script en Python para la automatización de tareas y control remoto del sistema operativo mediante comandos integrados con la API de Telegram Bots.',
    url: 'https://github.com/Gaen17',
  },
  {
    id: undefined,
    tag: 'IOT_DASHBOARD.UI',
    matrixText: '[METRICS_FLOW // STATIC]',
    title: 'Explorador IoT',
    description: 'Dashboard interactivo de visualización de métricas de eficiencia energética y adopción global de tecnologías IoT. Desarrollado con Tailwind CSS y Chart.js.',
    url: 'https://github.com/Gaen17/Explorador-de-Vanguardia-IoT-Soluciones-Globales',
  },
  {
    id: undefined,
    tag: 'NOTHING_PORTFOLIO.UI',
    matrixText: '[BENTO_GRID // ACTIVE]',
    title: 'NOS Bento Portfolio',
    description: 'Este portafolio interactivo basado en widgets estilo Nothing OS. Desarrollado en React, TypeScript y CSS modular con soporte para modo oscuro.',
    url: 'https://github.com/Gaen17',
  },
];

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState('about');
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Global toast — rendered at App root so it's never clipped by widget overflow:hidden
  const [toast, setToast] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Accurate ScrollSpy using IntersectionObserver
  useEffect(() => {
    const sectionIds = ['about', 'tech', 'projects', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          // On page load (scrollY ≈ 0) always keep 'about' active —
          // prevents the observer's initial burst from selecting 'tech'
          // because it happens to appear in the shrunken intersection root.
          if (window.scrollY < 80) {
            setActiveSection('about');
            return;
          }
          setActiveSection(id);
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Global copy handler — passed to ContactWidget so toast renders at App root
  const handleCopyToast = useCallback((label: string) => {
    setToast(label);
    setTimeout(() => setToast(null), 2500);
  }, []);

  return (
    <div className="dashboard-container">
      <StatusHeader
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="bento-grid">
        <HeroWidget />
        <TechWidget />

        {PROJECTS.map((p) => (
          <ProjectWidget
            key={p.tag}
            id={p.id}
            tag={p.tag}
            matrixText={p.matrixText}
            title={p.title}
            description={p.description}
            url={p.url}
          />
        ))}

        <ContactWidget onCopyToast={handleCopyToast} />

        {/* Snake mini-game — fills the 3rd column next to ContactWidget */}
        <GameWidget />
      </main>

      <footer className="system-footer">
        <p>© 2026 Ernesto Veramendi. Todos los derechos reservados.</p>
        <p className="footer-system-status">SYS_STATUS: OPTIMAL</p>
      </footer>

      {/* Floating Scroll-to-top */}
      <button
        className={`scroll-top-btn ${showScrollTop ? 'scroll-top-btn--visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Global Toast — at App root, never clipped by widget overflow:hidden */}
      <div
        className={`copy-toast ${toast ? 'copy-toast--visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="copy-toast-dot" />
        <span className="copy-toast-text">{toast ? `${toast} COPIADO` : ''}</span>
      </div>
    </div>
  );
};

export default App;
