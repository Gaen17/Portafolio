# Portafolio — Ernesto Veramendi

Personal portfolio with two ways to browse it:

- **Vista directa** (default): one readable page with projects, stack and contact.
- **Escritorio**: a tiling-window desktop (Hyprland-like on wide screens, a Niri-like swipeable strip on phones).

Four themes: Nothing, Night City, Vice and Monogatari. Shareable links: `?theme=vice&mode=desktop`.

## Keyboard (desktop mode)

| Keys | Action |
|---|---|
| `Alt+1` `Alt+2` `Alt+3` | Switch workspace |
| Arrows or `h j k l` | Move focus between windows |
| `Enter` / `Esc` | Open / close the focused project |
| `Ctrl+K` | Launcher (works in both modes) |

Everything is also clickable. `prefers-reduced-motion` turns animations off.

## Stack

React 19, TypeScript 6, Vite 8, native View Transitions, self-hosted OFL fonts (Fontsource), one Vercel Function for the contact form.

## Scripts

```bash
npm run dev      # local dev server (the contact form needs `vercel dev` to reach /api)
npm run build
npm run lint
npm test         # contact function tests (node:test)
```

## Contact form setup

The form posts to `api/contact.ts`, which checks a honeypot, validates input, verifies Cloudflare Turnstile server-side and sends the message with Resend. The destination address never reaches the browser.

1. Create a free [Resend](https://resend.com) account and an API key. Without a verified domain, Resend only delivers to your own account email, which is all this form needs.
2. Create a free [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) widget for your Vercel domain and `localhost`.
3. In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value | Exposed to browser |
|---|---|---|
| `RESEND_API_KEY` | Resend API key | no |
| `CONTACT_TO_EMAIL` | the inbox that receives messages | no |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key | no |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key (public by design) | yes |

Redeploy after adding them. Security headers (CSP, HSTS, frame denial) live in `vercel.json`.

## Project screenshots

Put images in `public/projects/` and set `image: '/projects/<file>.webp'` on the project in `src/content.ts`. Until then a themed placeholder is shown.
