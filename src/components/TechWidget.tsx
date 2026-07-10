import React from 'react';
import { Widget } from './Widget';

interface TechItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Inline SVGs — zero external requests, scales perfectly, theme-aware via CSS
const TECH_ITEMS: TechItem[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill="currentColor" opacity="0.08"/>
        <path d="M6 6h20v20H6z" fill="none"/>
        <path d="M18.774 19.386c.44.743.959 1.286 1.918 1.286.807 0 1.322-.404 1.322-.963 0-.669-.53-.907-1.421-1.295l-.488-.209c-1.407-.599-2.342-1.35-2.342-2.937 0-1.462 1.113-2.575 2.852-2.575 1.239 0 2.129.43 2.77 1.558l-1.517.974c-.334-.597-.694-.831-1.253-.831-.571 0-.934.363-.934.831 0 .582.363.818 1.202 1.178l.488.209c1.658.711 2.594 1.438 2.594 3.069 0 1.759-1.382 2.72-3.239 2.72-1.815 0-2.987-.864-3.559-1.996l1.607-.92zM12.067 19.596c.32.566.612.046.612.046L14 20.5s-.738 1.356-2.063 1.356c-1.583 0-2.313-.965-2.313-2.416v-5.88H11.4v5.752c0 .568.11.839.567.839.156 0 .1-.555.1-.555z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill="currentColor" opacity="0.08"/>
        <path d="M7 7h18v18H7z" fill="none"/>
        <path d="M16.612 17.3h2.511v.677c0 .972-.791 1.763-1.763 1.763H16.5a1.763 1.763 0 01-1.763-1.763v-3.954A1.763 1.763 0 0116.5 12.26h.86c.972 0 1.763.791 1.763 1.763v.177h-1.4v-.177a.363.363 0 00-.363-.363h-.86a.363.363 0 00-.363.363v3.954c0 .2.163.363.363.363h.86a.363.363 0 00.363-.363V18.7h-1.111v-1.4zM8 13.66h2.051v6.4H11.5v-6.4h2.051v-1.4H8v1.4z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'react',
    name: 'React',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <circle cx="16" cy="16" r="2.4" fill="currentColor"/>
        <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.4"/>
        <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 16 16)"/>
        <ellipse cx="16" cy="16" rx="12" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 16 16)"/>
      </svg>
    ),
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <path d="M16 4l10 5.77v11.54L16 27 6 21.31V9.77L16 4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M16 10v6l5.2 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'java',
    name: 'Java',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <path d="M13.5 21.5s-1.2.7.85.94c2.5.29 3.77.24 6.52-.27 0 0 .72.45 1.73.84-6.15 2.64-13.92-.15-9.1-1.51z" fill="currentColor"/>
        <path d="M12.75 18.5s-1.35 1 .71 1.21c2.66.28 4.76.3 8.39-.41 0 0 .5.51 1.29.79-7.43 2.17-15.7.17-10.39-1.59z" fill="currentColor" opacity="0.8"/>
        <path d="M17.66 13.06c1.51 1.74-.4 3.31-.4 3.31s3.84-1.98 2.08-4.46c-1.65-2.32-2.91-3.47 3.93-7.44 0 0-10.74 2.68-5.61 8.59z" fill="currentColor"/>
        <path d="M23.5 24.5s.89.73-1 1.3c-3.5 1.06-14.6.69-17.67.02-1.1-.24-.97-1.34.21-1.69.56-.17 1.38-.27 2.16-.27-2.5-.9-16.12 3.45-6.92 4.95 25.08 4.07 45.7-1.83 23.22-4.31z" fill="currentColor" opacity="0.6"/>
        <path d="M14 5s-7.87 1.97-2.88 5.37c1.47 1 4.4 1.54 6.13 2.3 1.73.77 4.36 2.17 4.36 4.34 0 2.17-2.43 3.46-3.74 4.1 3.62-1.88 9.44-5.97.76-9.57C14.84 9.52 8.68 8.33 14 5z" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'python',
    name: 'Python',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <path d="M15.9 5C10.84 5 11.15 7.23 11.15 7.23v2.34h4.89v.7H8.66S5 9.82 5 14.93c0 5.12 3.25 4.94 3.25 4.94H10v-2.38s-.13-3.25 3.19-3.25h5.49s3.08.05 3.08-2.98V8.13S22.3 5 15.9 5zm-3.05 1.77a1 1 0 11-.001 2.001A1 1 0 0112.85 6.77z" fill="currentColor"/>
        <path d="M16.1 27c5.06 0 4.75-2.23 4.75-2.23v-2.34h-4.89v-.7h7.38S27 22.18 27 17.07c0-5.12-3.25-4.94-3.25-4.94H22v2.38s.13 3.25-3.19 3.25h-5.49s-3.08-.05-3.08 2.98v3.14S9.7 27 16.1 27zm3.05-1.77a1 1 0 11.001-2.001A1 1 0 0119.15 25.23z" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true">
        <ellipse cx="16" cy="9" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 9v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V9" fill="none" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 14v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5v-5" fill="none" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id: 'html-css',
    name: 'HTML & CSS',
    icon: (
      <svg viewBox="0 0 32 32" className="tech-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* < bracket */}
        <polyline points="10,9 4,16 10,23" />
        {/* > bracket */}
        <polyline points="22,9 28,16 22,23" />
        {/* / slash */}
        <line x1="18" y1="7" x2="14" y2="25" />
      </svg>
    ),
  },
];

export const TechWidget: React.FC = () => {
  return (
    <Widget id="tech" tag="TECNOLOGÍAS.EXE" className="widget-tech">
      <p className="section-desc">
        Un sistema de lenguajes y herramientas que se complementan para el desarrollo integral.
      </p>
      <div className="tech-system-grid">
        {TECH_ITEMS.map((item) => (
          <div key={item.id} className="tech-card" data-tech={item.id}>
            <span className="tech-icon-wrapper">{item.icon}</span>
            <span className="tech-name">{item.name}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
};

export default TechWidget;
