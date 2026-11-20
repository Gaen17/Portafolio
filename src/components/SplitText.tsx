import type { CSSProperties } from 'react';

// Splits text into per-letter spans so each theme can animate its own entrance.
// Words stay unbreakable so lines wrap between words, never inside one.
// Screen readers read the hidden full string once; the letters are hidden from them.
export function SplitText({ text }: { text: string }) {
  const total = text.replace(/\s/g, '').length;
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="split" aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="split-word">
              {[...word].map((ch) => {
                const n = i++;
                // --i: reading order; --r: scrambled order for flicker-style entrances
                return (
                  <span key={n} className="split-ch" style={{ '--i': n, '--r': (n * 7) % total } as CSSProperties}>
                    {ch}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
