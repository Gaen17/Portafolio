import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted OFL fonts: no third-party requests. Japanese families load the latin subset only.
import '@fontsource/doto/700.css';
import '@fontsource/doto/900.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/chakra-petch/400.css';
import '@fontsource/chakra-petch/600.css';
import '@fontsource/chakra-petch/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/bricolage-grotesque/400.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/shippori-mincho/latin-500.css';
import '@fontsource/shippori-mincho/latin-800.css';
import '@fontsource/zen-kaku-gothic-new/latin-400.css';
import '@fontsource/zen-kaku-gothic-new/latin-700.css';
import './themes.css';
import './index.css';
import App from './App.tsx';
import { THEME_IDS } from './content';
import { readPersisted } from './lib';

// Before the first render, so nothing is ever styled with the default theme's tokens.
document.documentElement.dataset.theme = readPersisted('ev-theme', 'nothing', THEME_IDS);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
