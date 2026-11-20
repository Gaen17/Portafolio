import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Runs a state update inside a View Transition when the browser supports it and motion is allowed.
export function withTransition(update: () => void, kind?: string) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  const root = document.documentElement;
  if (kind) root.dataset.vt = kind;
  const t = document.startViewTransition(() => flushSync(update));
  t.finished.finally(() => {
    if (root.dataset.vt === kind) delete root.dataset.vt;
  });
}

export function readPersisted<T extends string>(key: string, initial: T, allowed: readonly T[]): T {
  // A shareable link like ?theme=vice&mode=desktop wins over the saved choice.
  const fromUrl = new URLSearchParams(location.search).get(key.replace(/^ev-/, '')) as T | null;
  if (fromUrl && allowed.includes(fromUrl)) return fromUrl;
  const saved = localStorage.getItem(key) as T | null;
  return saved && allowed.includes(saved) ? saved : initial;
}

export function usePersisted<T extends string>(key: string, initial: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => readPersisted(key, initial, allowed));
  useEffect(() => localStorage.setItem(key, value), [key, value]);
  return [value, setValue] as const;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// True when the user is typing, so global shortcuts must not fire.
export const isEditing = (el: Element | null) =>
  !!el && (el.matches('input, textarea, select, [contenteditable="true"]') || !!el.closest('dialog[open]'));
