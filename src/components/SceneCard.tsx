import { useEffect } from 'react';

export interface Scene {
  title: string;
  subtitle: string;
  tone: number; // picks the color pair, so consecutive cuts alternate
}

const TONES = ['tone-red', 'tone-black', 'tone-white', 'tone-yellow'];

// Monogatari-style title card: a full-screen cut with text, dismissed by time, click or any key.
export function SceneCard({ scene, onDone }: { scene: Scene; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    const skip = () => onDone();
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', skip);
    };
  }, [scene, onDone]);

  return (
    <div className={`scene ${TONES[scene.tone % TONES.length]}`} onClick={onDone} aria-hidden="true">
      <p className="scene-title">{scene.title}</p>
      <p className="scene-sub">{scene.subtitle}</p>
    </div>
  );
}
