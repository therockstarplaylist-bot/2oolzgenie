"use client";

import { useEffect, useRef, useState } from "react";

const SCORE_KEY = "2oolz-arcade-v1";
type Scores = Record<string, number>;

const ARCADE = [
  { id: "snake", name: "Neon Snake", blurb: "Steer into the glowing bits. Don't bite yourself." },
  { id: "stack", name: "Block Stacker", blurb: "Tap to drop the moving block. Line it up." },
  { id: "break", name: "Lamp Breaker", blurb: "Bounce the ball. Clear the bricks." },
  { id: "memory", name: "Memory Flip", blurb: "Flip two tiles. Find the matching shapes." },
  { id: "letters", name: "Lamp Letters", blurb: "Guess the lamp word, one letter at a time." },
  { id: "reflex", name: "Tap Reflex", blurb: "Wait for the glow, then tap. Too soon misses." },
  { id: "grid", name: "Glow 2048", blurb: "Slide tiles. Matching numbers merge." },
] as const;

type GameId = (typeof ARCADE)[number]["id"];

function loadScores(): Scores {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY) || "{}") as Scores;
  } catch {
    return {};
  }
}

function beep(on: boolean) {
  if (!on) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 440;
  gain.gain.value = 0.03;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

export function ArcadeDeck() {
  const [game, setGame] = useState<GameId | null>(null);
  const [sound, setSound] = useState(false);
  const [scores, setScores] = useState<Scores>({});
  useEffect(() => setScores(loadScores()), []);
  function saveScore(id: string, score: number) {
    setScores((prev) => {
      const next = { ...prev, [id]: Math.max(prev[id] || 0, score) };
      localStorage.setItem(SCORE_KEY, JSON.stringify(next));
      return next;
    });
    beep(sound);
  }
  return (
    <div className="lamp-block" data-testid="arcade">
      <h1>Arcade</h1>
      <p className="lede">Free to play. Sound is off until you turn it on. High scores stay in this browser.</p>
      <label className="sound-toggle">
        <input data-testid="sound-toggle" type="checkbox" checked={sound} onChange={(event) => setSound(event.target.checked)} />
        Sound {sound ? "on" : "off"}
      </label>
      {!game ? (
        <ul className="game-grid-lamp">
          {ARCADE.map((item) => (
            <li key={item.id}>
              <button type="button" className="game-tile" data-testid={`arcade-${item.id}`} onClick={() => setGame(item.id)}>
                <strong>{item.name}</strong>
                <span>{item.blurb}</span>
                <small>Best {scores[item.id] || 0}</small>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div data-testid="arcade-stage">
          <button type="button" className="nbtn ghost" onClick={() => setGame(null)}>
            All games
          </button>
          {game === "snake" && <Snake onScore={(score) => saveScore("snake", score)} />}
          {game === "stack" && <Stacker onScore={(score) => saveScore("stack", score)} />}
          {game === "break" && <Breaker onScore={(score) => saveScore("break", score)} />}
          {game === "memory" && <Memory onScore={(score) => saveScore("memory", score)} />}
          {game === "letters" && <Letters onScore={(score) => saveScore("letters", score)} />}
          {game === "reflex" && <Reflex onScore={(score) => saveScore("reflex", score)} />}
          {game === "grid" && <Glow2048 onScore={(score) => saveScore("grid", score)} />}
        </div>
      )}
    </div>
  );
}

function Snake({ onScore }: { onScore: (score: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dir = useRef({ x: 1, y: 0 });
  const scoreRef = useRef(onScore);
  scoreRef.current = onScore;
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 16;
    let snake = [{ x: 4, y: 8 }];
    let food = { x: 12, y: 8 };
    let alive = true;
    let acc = 0;
    let last = performance.now();
    let points = 0;
    const frame = (now: number) => {
      if (!alive) return;
      acc += now - last;
      last = now;
      if (acc > 150) {
        acc = 0;
        const head = { x: snake[0].x + dir.current.x, y: snake[0].y + dir.current.y };
        const hit = head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 22 || snake.some((part) => part.x === head.x && part.y === head.y);
        if (hit) {
          alive = false;
          setOver(true);
          scoreRef.current(points);
          return;
        }
        snake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
          points += 1;
          setScore(points);
          food = { x: (food.x * 7 + 3) % 20, y: (food.y * 5 + 1) % 22 };
        } else snake.pop();
      }
      ctx.fillStyle = "#070914";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ff4ad2";
      ctx.fillRect(food.x * size, food.y * size, size - 2, size - 2);
      ctx.fillStyle = "#3ee7ff";
      for (const part of snake) ctx.fillRect(part.x * size, part.y * size, size - 2, size - 2);
      requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(id);
    };
  }, []);
  function turn(x: number, y: number) {
    if (dir.current.x === -x && dir.current.y === -y) return;
    dir.current = { x, y };
  }
  return (
    <div>
      <p data-testid="snake-score">Score {score}{over ? " · done" : ""}</p>
      <canvas ref={ref} width={320} height={352} className="play-canvas" data-testid="snake-canvas" />
      <div className="pad">
        <button type="button" data-testid="snake-up" onClick={() => turn(0, -1)}>Up</button>
        <button type="button" data-testid="snake-left" onClick={() => turn(-1, 0)}>Left</button>
        <button type="button" data-testid="snake-down" onClick={() => turn(0, 1)}>Down</button>
        <button type="button" data-testid="snake-right" onClick={() => turn(1, 0)}>Right</button>
      </div>
    </div>
  );
}

function Stacker({ onScore }: { onScore: (score: number) => void }) {
  const [rows, setRows] = useState<{ x: number; w: number }[]>([{ x: 2, w: 6 }]);
  const [mover, setMover] = useState(0);
  const [dir, setDir] = useState(1);
  const [over, setOver] = useState(false);
  const width = 10;
  useEffect(() => {
    if (over) return;
    const id = window.setInterval(() => {
      setMover((value) => {
        const row = rows[rows.length - 1];
        const next = value + dir;
        if (next < 0 || next + row.w > width) {
          setDir((way) => -way);
          return value;
        }
        return next;
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [dir, over, rows]);
  function drop() {
    if (over) return;
    const prev = rows[rows.length - 1];
    const left = Math.max(prev.x, mover);
    const right = Math.min(prev.x + prev.w, mover + prev.w);
    const w = right - left;
    if (w <= 0) {
      setOver(true);
      onScore(rows.length - 1);
      return;
    }
    const next = { x: left, w };
    const built = [...rows, next];
    setRows(built);
    setMover(0);
    if (built.length > 8) onScore(built.length);
  }
  return (
    <div>
      <p data-testid="stack-score">Height {rows.length}{over ? " · missed" : ""}</p>
      <button type="button" className="stack-board" data-testid="stack-drop" onClick={drop}>
        {Array.from({ length: width }, (_, index) => (
          <i key={index} className={index >= mover && index < mover + rows[rows.length - 1].w ? "on" : ""} />
        ))}
      </button>
      <p>Tap the bar to drop it.</p>
    </div>
  );
}

function Breaker({ onScore }: { onScore: (score: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bricks = Array.from({ length: 24 }, (_, index) => ({ x: (index % 6) * 52 + 8, y: Math.floor(index / 6) * 22 + 20, alive: true }));
    let x = 160;
    let y = 280;
    let vx = 2.2;
    let vy = -2.6;
    let paddle = 120;
    let points = 0;
    let alive = true;
    const move = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      paddle = ((clientX - rect.left) / rect.width) * 320 - 32;
    };
    const onPointer = (event: PointerEvent) => move(event.clientX);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", onPointer);
    const frame = () => {
      if (!alive) return;
      x += vx;
      y += vy;
      if (x < 8 || x > 312) vx *= -1;
      if (y < 8) vy *= -1;
      if (y > 330) {
        alive = false;
        onScore(points);
        return;
      }
      if (y > 300 && x > paddle && x < paddle + 64) vy = -Math.abs(vy);
      for (const brick of bricks) {
        if (!brick.alive) continue;
        if (x > brick.x && x < brick.x + 48 && y > brick.y && y < brick.y + 16) {
          brick.alive = false;
          vy *= -1;
          points += 1;
          setScore(points);
        }
      }
      if (bricks.every((brick) => !brick.alive)) {
        alive = false;
        onScore(points + 5);
      }
      ctx.fillStyle = "#070914";
      ctx.fillRect(0, 0, 320, 360);
      ctx.fillStyle = "#ff4ad2";
      for (const brick of bricks) if (brick.alive) ctx.fillRect(brick.x, brick.y, 48, 14);
      ctx.fillStyle = "#3ee7ff";
      ctx.fillRect(paddle, 312, 64, 10);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(id);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointer);
    };
  }, [onScore]);
  return (
    <div>
      <p data-testid="break-score">Bricks {score}</p>
      <canvas ref={ref} width={320} height={360} className="play-canvas" data-testid="break-canvas" />
      <p>Drag on the board to move the paddle.</p>
    </div>
  );
}

const SHAPES = ["△", "○", "□", "◇", "☆", "✚", "☾", "⌂"];

function Memory({ onScore }: { onScore: (score: number) => void }) {
  const [deck, setDeck] = useState(() => shuffle([...SHAPES, ...SHAPES].map((shape, index) => ({ id: index, shape, up: false, gone: false }))));
  const [picks, setPicks] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  function flip(index: number) {
    if (deck[index].gone || deck[index].up || picks.length === 2) return;
    const next = deck.slice();
    next[index] = { ...next[index], up: true };
    const chosen = [...picks, index];
    setDeck(next);
    setPicks(chosen);
    if (chosen.length === 2) {
      const [a, b] = chosen;
      window.setTimeout(() => {
        setDeck((current) => {
          const copy = current.slice();
          if (copy[a].shape === copy[b].shape) {
            copy[a] = { ...copy[a], gone: true };
            copy[b] = { ...copy[b], gone: true };
            setMatches((count) => {
              const total = count + 1;
              if (total === 8) onScore(8);
              return total;
            });
          } else {
            copy[a] = { ...copy[a], up: false };
            copy[b] = { ...copy[b], up: false };
          }
          return copy;
        });
        setPicks([]);
      }, 500);
    }
  }
  return (
    <div className="memory" data-testid="memory">
      <p>Matches {matches}</p>
      {deck.map((card, index) => (
        <button key={card.id} type="button" data-testid={`mem-${index}`} className="mem" onClick={() => flip(index)}>
          {card.up || card.gone ? card.shape : "·"}
        </button>
      ))}
    </div>
  );
}

const WORDS = ["LAMP", "FORGE", "NEON", "GENIE", "WISH", "COIN"];

function Letters({ onScore }: { onScore: (score: number) => void }) {
  const [word] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const misses = guessed.filter((letter) => !word.includes(letter)).length;
  const won = word.split("").every((letter) => guessed.includes(letter));
  const lost = misses >= 6;
  return (
    <div data-testid="letters">
      <p className="big-result">{word.split("").map((letter) => (guessed.includes(letter) ? letter : "_")).join(" ")}</p>
      <p>Misses {misses} / 6 {lost ? "· out of guesses" : ""}</p>
      <div className="letters">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <button
            key={letter}
            type="button"
            disabled={guessed.includes(letter) || lost || won}
            data-testid={`letter-${letter}`}
            onClick={() => {
              const next = [...guessed, letter];
              setGuessed(next);
              if (word.split("").every((item) => next.includes(item))) onScore(Math.max(1, 6 - misses - (word.includes(letter) ? 0 : 1)));
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

function Reflex({ onScore }: { onScore: (score: number) => void }) {
  const [phase, setPhase] = useState<"wait" | "go" | "early" | "done">("wait");
  const start = useRef(0);
  useEffect(() => {
    const delay = 700 + Math.floor(Math.random() * 1200);
    const id = window.setTimeout(() => {
      start.current = performance.now();
      setPhase("go");
    }, delay);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <button
      type="button"
      className={`reflex ${phase}`}
      data-testid="reflex"
      onClick={() => {
        if (phase === "wait") {
          setPhase("early");
          onScore(0);
        } else if (phase === "go") {
          const ms = Math.round(performance.now() - start.current);
          setPhase("done");
          onScore(Math.max(0, 1000 - ms));
        }
      }}
    >
      {phase === "wait" ? "Wait for the glow" : phase === "go" ? "Tap" : phase === "early" ? "Too soon" : "Got it"}
    </button>
  );
}

function Glow2048({ onScore }: { onScore: (score: number) => void }) {
  const [grid, setGrid] = useState<number[][]>(() => spawn(spawn(empty())));
  const [score, setScore] = useState(0);
  function slide(dir: "left" | "right" | "up" | "down") {
    const moved = applyMove(grid, dir);
    if (!moved.changed) return;
    const withTile = spawn(moved.grid);
    setGrid(withTile);
    setScore(moved.score);
    onScore(moved.score);
  }
  return (
    <div data-testid="g2048">
      <p>Score {score}</p>
      <div className="g2048">
        {grid.flat().map((value, index) => (
          <span key={index}>{value || ""}</span>
        ))}
      </div>
      <div className="pad">
        <button type="button" data-testid="g-up" onClick={() => slide("up")}>Up</button>
        <button type="button" data-testid="g-left" onClick={() => slide("left")}>Left</button>
        <button type="button" data-testid="g-down" onClick={() => slide("down")}>Down</button>
        <button type="button" data-testid="g-right" onClick={() => slide("right")}>Right</button>
      </div>
    </div>
  );
}

function empty() {
  return [0, 0, 0, 0].map(() => [0, 0, 0, 0]);
}
function spawn(grid: number[][]) {
  const spots: [number, number][] = [];
  grid.forEach((row, y) => row.forEach((value, x) => { if (!value) spots.push([y, x]); }));
  if (!spots.length) return grid;
  const [y, x] = spots[Math.floor(Math.random() * spots.length)];
  const next = grid.map((row) => row.slice());
  next[y][x] = 2;
  return next;
}
function applyMove(grid: number[][], dir: "left" | "right" | "up" | "down") {
  let score = 0;
  const rotate = dir === "left" ? 0 : dir === "up" ? 3 : dir === "right" ? 2 : 1;
  let board = grid.map((row) => row.slice());
  for (let turn = 0; turn < rotate; turn++) board = board[0].map((_, index) => board.map((row) => row[index]).reverse());
  const next = board.map((row) => {
    const tiles = row.filter(Boolean);
    const merged: number[] = [];
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === tiles[i + 1]) {
        merged.push(tiles[i] * 2);
        score += tiles[i] * 2;
        i += 1;
      } else merged.push(tiles[i]);
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  });
  for (let turn = 0; turn < (4 - rotate) % 4; turn++) {
    /* rotate back below */
  }
  let back = next;
  const backTurns = (4 - rotate) % 4;
  for (let turn = 0; turn < backTurns; turn++) back = back[0].map((_, index) => back.map((row) => row[index]).reverse());
  const changed = back.some((row, y) => row.some((value, x) => value !== grid[y][x]));
  return { grid: back, changed, score };
}

function shuffle<T>(list: T[]) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
