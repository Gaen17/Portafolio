import React, { useState, useEffect } from 'react';

interface StatusHeaderProps {
  activeSection: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  activeSection,
  theme,
  onToggleTheme,
}) => {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll helper — works for both anchors AND scroll-to-top
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80; // header height compensation
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const NAV_LINKS = [
    { id: 'top', label: 'Inicio', section: 'about' },
    { id: 'tech', label: 'Sistema', section: 'tech' },
    { id: 'projects', label: 'Proyectos', section: 'projects' },
    { id: 'contact', label: 'Contacto', section: 'contact' },
  ];

  return (
    <header className="status-header">
      <div className="status-logo">
        <span className="dot-logo" />
        <span className="logo-text">EV.SYS // ACTIVE</span>
      </div>
      <nav className="status-nav" aria-label="Secciones del portafolio">
        {NAV_LINKS.map(({ id, label, section }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-link ${activeSection === section ? 'active' : ''}`}
            onClick={(e) => scrollTo(e, id)}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="status-controls">
        <button
          id="theme-toggle"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          title={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          data-theme={theme}
        >
          <span className="toggle-dot" />
        </button>
        <div className="status-time">
          <span>{time}</span>
        </div>
      </div>
    </header>
  );
};

export default StatusHeader;
