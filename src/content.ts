// Single source for every view (direct page, desktop windows, launcher).

export const PROFILE = {
  name: 'Ernesto Veramendi',
  role: 'Desarrollador full-stack y diseñador de interfaces',
  bio: 'Diseño y construyo aplicaciones web y móviles, desde la API hasta el último píxel. Me importa que el software se sienta preciso, rápido y fácil de usar.',
  motto: 'Time waits for no one',
};

// Public profiles only: the email address is never rendered; the contact form sends it server-side.
export const LINKS = [
  { id: 'github', label: 'GitHub', handle: 'Gaen17', url: 'https://github.com/Gaen17' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'ernesto-veramendi', url: 'https://www.linkedin.com/in/ernesto-veramendi' },
];

export interface Project {
  id: string;
  title: string;
  kind: string;
  summary: string;
  detail: string;
  stack: string[];
  url: string;
  image?: string; // screenshot in /public/projects; shows a themed placeholder until provided
}

export const PROJECTS: Project[] = [
  {
    id: 'restaurante-pos',
    title: 'Restaurante POS',
    kind: 'App móvil + API',
    summary: 'Punto de venta para restaurantes: app Android conectada en tiempo real a una API REST.',
    detail: 'Sistema completo de punto de venta con arquitectura cliente-servidor: una app nativa en Android se comunica en tiempo real con una API REST en PHP sobre MySQL.',
    stack: ['Java', 'Android', 'PHP', 'MySQL'],
    url: 'https://github.com/Gaen17/Restaurante-POS',
  },
  {
    id: 'aventura-matematica',
    title: 'Aventura Matemática',
    kind: 'Web educativa',
    summary: 'Práctica de matemáticas interactiva para niños de tercer grado de primaria.',
    detail: 'Aplicación web interactiva de práctica matemática para tercer grado de primaria, con estilos en Tailwind CSS, JavaScript nativo y gráficos en Chart.js.',
    stack: ['JavaScript', 'Tailwind CSS', 'Chart.js'],
    url: 'https://github.com/Gaen17/aventura-matematica',
  },
  {
    id: 'next-to-do',
    title: 'Next To-Do',
    kind: 'Gestor de tareas',
    summary: 'Gestor de tareas en TypeScript con programación orientada a objetos y persistencia local.',
    detail: 'Estructurado en TypeScript bajo el paradigma de programación orientada a objetos, con persistencia local y validación de fechas.',
    stack: ['TypeScript', 'POO', 'LocalStorage'],
    url: 'https://github.com/Gaen17/next-to-do',
  },
  {
    id: 'bot-telegram',
    title: 'Bot Telegram OS',
    kind: 'Automatización',
    summary: 'Bot en Python para controlar el sistema operativo a distancia desde Telegram.',
    detail: 'Script en Python que automatiza tareas y controla el sistema operativo de forma remota mediante comandos integrados con la API de bots de Telegram.',
    stack: ['Python', 'Telegram Bot API'],
    url: 'https://github.com/Gaen17',
  },
  {
    id: 'explorador-iot',
    title: 'Explorador IoT',
    kind: 'Dashboard',
    summary: 'Dashboard de métricas de eficiencia energética y adopción global de IoT.',
    detail: 'Dashboard interactivo de visualización de métricas de eficiencia energética y adopción global de tecnologías IoT, hecho con Tailwind CSS y Chart.js.',
    stack: ['JavaScript', 'Tailwind CSS', 'Chart.js'],
    url: 'https://github.com/Gaen17/Explorador-de-Vanguardia-IoT-Soluciones-Globales',
  },
  {
    id: 'portafolio',
    title: 'Este portafolio',
    kind: 'Web interactiva',
    summary: 'Un escritorio tipo Linux en el navegador, con cuatro temas y vista directa.',
    detail: 'React 19 y TypeScript, ventanas en mosaico, atajos de teclado, View Transitions y un formulario de contacto protegido con Turnstile y una función serverless.',
    stack: ['React', 'TypeScript', 'Vite', 'Vercel'],
    url: 'https://github.com/Gaen17',
  },
];

export const STACK = ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Java', 'Kotlin', 'Python', 'PHP', 'SQL', 'HTML y CSS'];

export const THEMES = [
  { id: 'nothing', label: 'Nothing', hint: 'Matriz de puntos, negro y rojo' },
  { id: 'nightcity', label: 'Night City', hint: 'Neón amarillo y cian' },
  { id: 'vice', label: 'Vice', hint: 'Atardecer en la playa' },
  { id: 'monogatari', label: 'Monogatari', hint: 'Tarjetas de escena' },
] as const;
export type ThemeId = (typeof THEMES)[number]['id'];
export const THEME_IDS: ThemeId[] = THEMES.map((t) => t.id);

export const WORKSPACES = [
  { id: 1, label: 'Inicio' },
  { id: 2, label: 'Proyectos' },
  { id: 3, label: 'Contacto' },
] as const;
export type WorkspaceId = (typeof WORKSPACES)[number]['id'];
