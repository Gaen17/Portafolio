import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Widget } from './Widget';

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

function getColors() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    bg:       isDark ? '#0d0d0d' : '#f8f8f8',
    gridDot:  isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)',
    body:     isDark ? '#d4d4d8' : '#27272a',
    head:     '#ff3b3b',
    food:     '#ff3b3b',
    dead:     isDark ? 'rgba(13,13,13,0.82)' : 'rgba(248,248,248,0.82)',
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

export const GameWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state in refs (no re-render on each frame)
  const gameState  = useRef<GameState>('idle');
  const snake      = useRef<Pt[]>([{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]);
  const dir        = useRef<Dir>('R');
  const nextDir    = useRef<Dir>('R');
  const food       = useRef<Pt>(randFood(snake.current));
  const score      = useRef(0);
  const frameId    = useRef<number>(0);
  const lastStep   = useRef<number>(0);

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
    const c = getColors();
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
    frameId.current = requestAnimationFrame(loop);
  }, [draw, highScore]);

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
    frameId.current  = requestAnimationFrame(loop);
  }, [loop]);

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
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Mobile D-pad handler ─────────────────────────────────────────────────────
  const press = (nd: Dir) => {
    if (nd !== OPP[dir.current]) nextDir.current = nd;
  };

  return (
    <Widget tag="ARCADE.EXE" className="widget-game">
      {/* Score bar */}
      <div className="game-scorebar">
        <span className="game-score-label">SCORE</span>
        <span className="game-score-value">{String(uiScore).padStart(4, '0')}</span>
        <span className="game-score-sep">·</span>
        <span className="game-score-label">HI</span>
        <span className="game-score-value">{String(highScore).padStart(4, '0')}</span>
      </div>

      {/* Canvas */}
      <div className="game-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="game-canvas"
        />

        {/* Overlay — idle or dead */}
        {uiState !== 'playing' && (
          <div className="game-overlay">
            {uiState === 'dead' ? (
              <>
                <p className="game-overlay-tag">// PROCESS TERMINATED</p>
                <p className="game-overlay-title">GAME OVER</p>
                <p className="game-overlay-pts">{uiScore} PTS</p>
                <button className="game-start-btn" onClick={startGame}>
                  RETRY.SH
                </button>
              </>
            ) : (
              <>
                <p className="game-overlay-tag">// ARCADE MODULE READY</p>
                <p className="game-overlay-title">SNAKE.EXE</p>
                <p className="game-overlay-hint">↑↓←→ · WASD</p>
                <button className="game-start-btn" onClick={startGame}>
                  INICIAR.SH
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="game-dpad" aria-label="Controles direccionales">
        <div className="dpad-row">
          <button className="dpad-btn" onClick={() => press('U')} aria-label="Arriba">▲</button>
        </div>
        <div className="dpad-row dpad-row--mid">
          <button className="dpad-btn" onClick={() => press('L')} aria-label="Izquierda">◀</button>
          <span className="dpad-center" />
          <button className="dpad-btn" onClick={() => press('R')} aria-label="Derecha">▶</button>
        </div>
        <div className="dpad-row">
          <button className="dpad-btn" onClick={() => press('D')} aria-label="Abajo">▼</button>
        </div>
      </div>
    </Widget>
  );
};

export default GameWidget;
