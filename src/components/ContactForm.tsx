import { useEffect, useRef, useState, type FormEvent } from 'react';
import { LINKS } from '../content';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme?: string; callback: (t: string) => void; 'expired-callback': () => void }) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  if (!s) {
    s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }
  return new Promise((resolve, reject) => {
    s.addEventListener('load', () => resolve(), { once: true });
    s.addEventListener('error', () => reject(new Error('turnstile')), { once: true });
  });
}

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string };

export function ContactForm({ idPrefix }: { idPrefix: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [token, setToken] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !widgetRef.current) return;
    const el = widgetRef.current;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetId.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          theme: 'auto',
          callback: setToken,
          'expired-callback': () => setToken(''),
        });
      })
      .catch(() => setStatus({ kind: 'error', message: 'No cargó la verificación antispam. Desactiva el bloqueador para este sitio o escríbeme por LinkedIn.' }));
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, token }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? 'No se pudo enviar el mensaje. Inténtalo en unos minutos.');
      form.reset();
      setStatus({ kind: 'sent' });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Sin conexión. Revisa tu red e inténtalo otra vez.' });
    } finally {
      setToken('');
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="contact-sent" role="status">
        <p className="contact-sent-title">Mensaje enviado</p>
        <p>Gracias. Te respondo a tu correo lo antes posible.</p>
        <button type="button" className="btn" onClick={() => setStatus({ kind: 'idle' })}>Escribir otro mensaje</button>
      </div>
    );
  }

  const busy = status.kind === 'sending';
  return (
    <div className="contact">
      <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
        <label htmlFor={`${idPrefix}-name`}>Nombre</label>
        <input id={`${idPrefix}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} disabled={busy} />
        <label htmlFor={`${idPrefix}-email`}>Correo</label>
        <input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" required maxLength={254} disabled={busy} />
        <label htmlFor={`${idPrefix}-message`}>Mensaje</label>
        <textarea id={`${idPrefix}-message`} name="message" rows={5} required minLength={10} maxLength={5000} disabled={busy} />
        {/* Honeypot: hidden from people and assistive tech, bots fill it */}
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div ref={widgetRef} className="turnstile" />
        {status.kind === 'error' && <p className="form-error" role="alert">{status.message}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy || (!!SITE_KEY && !token)}>
          {busy ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </form>
      <ul className="contact-links">
        {LINKS.map((l) => (
          <li key={l.id}>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              <span className="contact-link-label">{l.label}</span>
              <span className="contact-link-handle">{l.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
