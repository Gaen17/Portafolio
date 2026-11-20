import React, { useRef, useEffect, useState, useCallback } from 'react';

// Grid dimensions — portrait orientation like a tamagotchi screen
const COLS = 11;
const ROWS = 14;
const CELL = 14; // px per cell → canvas: 154 × 196

type Dir = 'U' | 'D' | 'L' | 'R';
type GameState = 'idle' | 'playing' | 'dead';
interface Pt { x: number; y: number; }

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };

function randFood(snake: Pt[]): Pt {
  let pt: Pt;
  do {
    pt = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pt.x && s.y === pt.y));
  return pt;
}

// Reads the active theme's tokens so the game repaints in every theme.
function getColors(el: HTMLElement) {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    bg: v('--surface-2'),
    gridDot: v('--border'),
    body: v('--text'),
    head: v('--accent'),
    food: v('--accent'),
  };
}

// Draw a rounded square — the "pixel" unit of the dot-matrix
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, s: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + s - r, y);
  ctx.arcTo(x + s, y, x + s, y + r, r);
  ctx.lineTo(x + s, y + s - r);
  ctx.arcTo(x + s, y + s, x + s - r, y + s, r);
  ctx.lineTo(x + r, y + s);
  ctx.arcTo(x, y + s, x, y + s - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

const STEP_MS = 145; // ms between snake steps

export const Snake: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state in refs (no re-render on each frame)
  const gameState  = useRef<GameState>('idle');
  const snake      = useRef<Pt[]>([{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]);
  const dir        = useRef<Dir>('R');
  const nextDir    = useRef<Dir>('R');
  const food       = useRef<Pt>({ x: 8, y: 3 }); // fixed first food; randomized on start
  const score      = useRef(0);
  const frameId    = useRef<number>(0);
  const lastStep   = useRef<number>(0);
  const loopRef    = useRef<(ts: number) => void>(() => {});

  // React state only for UI rendering
  const [uiState, setUiState]       = useState<GameState>('idle');
  const [uiScore, setUiScore]       = useState(0);
  const [highScore, setHighScore]   = useState(() =>
    parseInt(localStorage.getItem('snake-hi') ?? '0', 10)
  );

  // ── Render frame ────────────────────────────────────────────────────────────
  const draw = useCallback((ts: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const c = getColors(canvas);
    const W = COLS * CELL;
    const H = ROWS * CELL;

    // Background
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);

    // Dot-matrix grid overlay
    ctx.fillStyle = c.gridDot;
    for (let gx = 0; gx < COLS; gx++) {
      for (let gy = 0; gy < ROWS; gy++) {
        ctx.beginPath();
        ctx.arc(gx * CELL + CELL / 2, gy * CELL + CELL / 2, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Food — pulsing circle
    const blink = Math.sin(ts / 280) * 0.35 + 0.65;
    ctx.save();
    ctx.globalAlpha = blink;
    ctx.fillStyle = c.food;
    ctx.beginPath();
    ctx.arc(
      food.current.x * CELL + CELL / 2,
      food.current.y * CELL + CELL / 2,
      CELL / 2 - 1.5,
      0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // Snake body
    snake.current.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? c.head : c.body;
      const pad = isHead ? 1 : 2;
      drawRoundRect(
        ctx,
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        isHead ? 3 : 2
      );
      ctx.fill();
    });
  }, []);

  // ── Game loop ────────────────────────────────────────────────────────────────
  const loop = useCallback((ts: number) => {
    if (gameState.current !== 'playing') return;

    if (ts - lastStep.current >= STEP_MS) {
      lastStep.current = ts;
      dir.current = nextDir.current;

      const { x, y } = snake.current[0];
      const nx = x + (dir.current === 'R' ? 1 : dir.current === 'L' ? -1 : 0);
      const ny = y + (dir.current === 'D' ? 1 : dir.current === 'U' ? -1 : 0);

      // Wall collision — snake dies if it exits the grid
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        gameState.current = 'dead';
        setUiState('dead');
        if (score.current > highScore) {
          setHighScore(score.current);
          localStorage.setItem('snake-hi', String(score.current));
        }
        draw(ts);
        return;
      }

      // Self-collision
      if (snake.current.some((s) => s.x === nx && s.y === ny)) {
        gameState.current = 'dead';
        setUiState('dead');
        // Update high score
        if (score.current > highScore) {
          setHighScore(score.current);
          localStorage.setItem('snake-hi', String(score.current));
        }
        draw(ts);
        return;
      }

      const ate = nx === food.current.x && ny === food.current.y;
      snake.current = [{ x: nx, y: ny }, ...snake.current];
      if (!ate) {
        snake.current.pop();
      } else {
        food.current = randFood(snake.current);
        score.current += 10;
        setUiScore(score.current);
      }
    }

    draw(ts);
    frameId.current = requestAnimationFrame(loopRef.current);
  }, [draw, highScore]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // ── Start / reset ────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(frameId.current);
    snake.current    = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
    dir.current      = 'R';
    nextDir.current  = 'R';
    food.current     = randFood(snake.current);
    score.current    = 0;
    setUiScore(0);
    gameState.current = 'playing';
    setUiState('playing');
    lastStep.current = performance.now();
    frameId.current  = requestAnimationFrame(loopRef.current);
  }, []);

  // Initial draw + cleanup
  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(frameId.current);
  }, [draw]);

  // ── Keyboard controls ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameState.current !== 'playing') return;
      const map: Record<string, Dir> = {
        ArrowUp: 'U', w: 'U', W: 'U',
        ArrowDown: 'D', s: 'D', S: 'D',
        ArrowLeft: 'L', a: 'L', A: 'L',
        ArrowRight: 'R', d: 'R', D: 'R',
      };
      const nd = map[e.key];
      if (!nd) return;
      if (nd !== OPP[dir.current]) nextDir.current = nd;
      // Prevent page scroll while playing
      e.preventDefault();
    };
    // Capture phase + preventDefault so desktop focus keys stand down while playing.
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, []);

  // ── Mobile D-pad handler ─────────────────────────────────────────────────────
  const press = (nd: Dir) => {
    if (nd !== OPP[dir.current]) nextDir.current = nd;
  };

  return (
    <div className="game">
      <p className="game-score" aria-live="polite">
        Puntos <strong>{uiScore}</strong> <span aria-hidden="true">/</span> Récord <strong>{highScore}</strong>
      </p>
      <div className="game-canvas-wrapper">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="game-canvas" aria-label="Tablero de Snake" role="img" />
        {uiState !== 'playing' && (
          <div className="game-overlay">
            <p className="game-overlay-title">{uiState === 'dead' ? `Fin: ${uiScore} puntos` : 'Snake'}</p>
            <p className="game-overlay-hint">Flechas o WASD</p>
            <button type="button" className="btn btn-primary" onClick={startGame}>
              {uiState === 'dead' ? 'Jugar otra vez' : 'Jugar'}
            </button>
          </div>
        )}
      </div>
      <div className="game-dpad" role="group" aria-label="Controles direccionales">
        <button type="button" className="dpad-btn dpad-u" onClick={() => press('U')} aria-label="Arriba">▲</button>
        <button type="button" className="dpad-btn dpad-l" onClick={() => press('L')} aria-label="Izquierda">◀</button>
        <button type="button" className="dpad-btn dpad-r" onClick={() => press('R')} aria-label="Derecha">▶</button>
        <button type="button" className="dpad-btn dpad-d" onClick={() => press('D')} aria-label="Abajo">▼</button>
      </div>
    </div>
  );
};

export default Snake;
