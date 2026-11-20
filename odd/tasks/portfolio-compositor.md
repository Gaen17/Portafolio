# Portfolio compositor redesign
Objective: compositor-style portfolio with 4 themes, direct view for recruiters, secure contact. Branch `feat/compositor-redesign`.
Delivery: ask-on-risk. Test runner: none in repo -> `npm run lint` + `npm run build` + node self-check for `api/contact.ts` validation + browser screenshots.

## Specs
- S1 "Que sea interactivo asi de loco entiendes?" — desktop: Hyprland-like tiling, workspaces 1 Inicio / 2 Proyectos / 3 Contacto, spring animations; mobile: Niri-like horizontal scroll-snap strip. Keybinds: Alt+1/2/3, arrows + h/j/k/l, Enter, Esc, Ctrl+K launcher. Everything also clickable.
- S2 Themes, verbatim: "Que sea dinamico pero que tenga 4 temas: NothingOS, Cyberpunk 2077 (el juego), GTA 6 (El nuevo interfaz que usan es clean y bonito ademas de playero) y Monogatari Series (el anime lleva un concepto de pantallas en cambios de escena o muestra texto, se juega mucho con los colores y además puede mostrar cosas al cambiar o necesitar mas info)". Inspired-by only (no logos/art/proprietary fonts). OFL fonts self-hosted.
- S3 Modes, verbatim: "un reclutador no puede perder el tiempo con eso de las keybinds asi que puedes dar la opcion de un modo "reclutador" o "experiencia" o algo asi claro que no con esas palabras". First visit = "Vista directa"; toggle to "Escritorio" always visible; saved in localStorage.
- S4 Contact: "permitir la conexion con mi correo cumpliendo con ciberseguridad muy bien puesta" + "Busca una solucion practica y gratuita". Vercel Function `api/contact.ts` + Turnstile + Resend; honeypot; server validation; email never shown in page or bundle; CSP without unsafe-inline/unsafe-eval in script-src.
- S5 "no mostrar informacion sensible", "mantener una estetica llamativa y profesional", "utilizar lenguajes actuales". Quality floor: keyboard focus visible, prefers-reduced-motion, AA contrast, 360px.

## Tasks
| ID | Specs | Route | Status | Commit |
|---|---|---|---|---|
| T1 secure contact | S4 S5 | inline | done, uncommitted | 5/5 node tests; independent verifier pending |
| T2 theme tokens + fonts | S2 S5 | inline | done, uncommitted | screenshots 4 themes |
| T2b direct view + mode toggle | S3 | inline | done, uncommitted | screenshots |
| T3 desktop compositor | S1 | inline | done, uncommitted | screenshots; keyboard not driven in browser |
| T4 mobile strip | S1 | inline | done, uncommitted | 390px screenshots |
| T5 launcher, expand, scene cards | S1 S2 | inline | done, uncommitted | not exercised in a browser |
| T6 copy + screenshot slots | S5 | inline | done, uncommitted | images pending from user |

Route evidence: no Writer trigger (units depend on shared theme/shell; sequential inline).

## Log
- L1 (2026-11-19) user request: "Antes de los enlaces rotos (que aun no tengo proyectos publicados, bueno algunos si en github) necesito mejorar el portafolio ya que cierto que hay cosas que se han quedado "mal". con la implementacion de la skill de frontend design de chrome me gustaria que evalues una opcion viable tomando el papel de maestro en frontend, con las restricciones de no mostrar informacion sensible, mantener una estetica llamativa y profesional, preguntarme sobre como me gustaria que se viera, utilizar o sugerir fuentes para que la pagina no se vea monotona asi como otro tipo de "mejoras visuales" ya sea de manera interactiva o visual, permitir la conexion con mi correo cumpliendo con ciberseguridad muy bien puesta, utilizar lenguajes actuales que se usan en este año y que no se usen antiguos."
- L2 Decisions: hybrid layout (Hyprland desktop / Niri mobile); 4 themes; contact = Vercel Function + Turnstile + Resend; default view = Vista directa. Plan: ~/.claude/plans/parsed-riding-rain.md
- L3 Baseline: `npm ci` + `npm run build` OK on main (213.99 kB JS).
- L4 Implemented T1-T6. lint clean (also fixed 2 pre-existing Snake hook errors), build OK, `npm test` 5/5. Bundle grep: no email or secrets. Deviation: no `motion` dependency; native View Transitions + CSS `linear()` spring cover it. Fonts no longer inlined (`assetsInlineLimit: 0`) so CSP has no `data:` fonts.
- L5 Commit attempt denied by the permission classifier; changes left uncommitted on `feat/compositor-redesign` for the user.
