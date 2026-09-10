"use client";
import {
  CASINO_GAMES,
  HILO_BETS,
  type Card,
  type CasinoGameId,
  type DropBit,
  type State,
  isRed,
} from "./constants";
type HiloApi = {
  active: boolean;
  bet: number;
  streak: number;
  pot: number;
  card: Card | null;
  start: (bet: number) => void;
  pick: (dir: "higher" | "lower") => void;
  cashOut: () => void;
};
type FaceApi = {
  active: boolean;
  points: number;
  flipped: boolean[];
  deck: Card[];
  start: () => void;
  flip: (i: number) => void;
  cashOut: () => void;
};
type ExtraApi = {
  open: CasinoGameId | null;
  setOpen: (id: CasinoGameId | null) => void;
  flip: (side: "H" | "T") => void;
  dice: (pick: "over" | "under" | "seven") => void;
  lucky: (n: number) => void;
  doors: (door: number) => void;
  roulette: (pick: "R" | "B" | "G") => void;
  ladderStep: () => void;
  ladderCash: () => void;
  ladder: { active: boolean; rung: number; pot: number };
  memoryFlip: (i: number) => void;
  memory: { active: boolean; tiles: string[]; revealed: number[]; matched: number[]; start: () => void };
  scratch: () => void;
  scratchTiles: number[] | null;
};
export function CasinoPage({
  S,
  msg,
  free,
  wheelDeg,
  showSlots,
  reels,
  showDrop,
  dropBits,
  onPlay,
  onDropClick,
  hilo,
  face52,
  extra,
}: {
  S: State;
  msg: string;
  free: boolean;
  wheelDeg: number;
  showSlots: boolean;
  reels: string[];
  showDrop: boolean;
  dropBits: DropBit[];
  onPlay: (g: "wheel" | "slots" | "drop") => void;
  onDropClick: (bit: DropBit) => void;
  hilo: HiloApi;
  face52: FaceApi;
  extra: ExtraApi;
}) {
  const open = extra.open;
  const openGame = (id: CasinoGameId) => {
    if (id === "wheel" || id === "slots" || id === "drop") {
      extra.setOpen(id);
      onPlay(id);
      return;
    }
    if (id === "memory") {
      extra.setOpen(id);
      extra.memory.start();
      return;
    }
    if (id === "face52") {
      extra.setOpen(id);
      if (!face52.active) face52.start();
      return;
    }
    if (id === "hilo") {
      extra.setOpen(id);
      return;
    }
    if (id === "scratch") {
      extra.setOpen(id);
      extra.scratch();
      return;
    }
    extra.setOpen(id);
  };
  return (
    <>
      <p className="seal">UELG:CASINO_01 . house ~20%</p>
      <h1>Casino</h1>
      {free && (
        <p className="wish">
          First Three Wishes. {S.wishes} free spin
          {S.wishes === 1 ? "" : "s"} left. The house takes no stake.
        </p>
      )}
      {!open && (
        <div className="casino-lobby">
          {CASINO_GAMES.map((g) => (
            <button
              key={g.id}
              type="button"
              className="casino-card"
              onClick={() => openGame(g.id)}
            >
              <span className="seal">{g.seal}</span>
              <b>{g.name}</b>
              <span className="stat-line">{g.stake}</span>
              <span className="card-blurb">{g.blurb}</span>
            </button>
          ))}
        </div>
      )}
      {open && (
        <button
          className="btn ghost"
          type="button"
          style={{ marginBottom: 12 }}
          onClick={() => extra.setOpen(null)}
        >
          Back
        </button>
      )}
      {open === "wheel" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_WHEEL</p>
          <div className="wheel" style={{ transform: `rotate(${wheelDeg}deg)` }} />
          <button className="btn" type="button" onClick={() => onPlay("wheel")}>
            {free ? "Wish . spin" : "Spin . 10 TC"}
          </button>
        </div>
      )}
      {open === "slots" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_SLOTS</p>
          <div className={`reels${showSlots ? "" : ""}`}>
            <div className="reel">{reels[0]}</div>
            <div className="reel">{reels[1]}</div>
            <div className="reel">{reels[2]}</div>
          </div>
          <button className="btn" type="button" onClick={() => onPlay("slots")}>
            {free ? "Wish . slots" : "Spin . 5 TC"}
          </button>
        </div>
      )}
      {open === "drop" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_DROP</p>
          <div className={`drop${showDrop ? "" : " hide"}`}>
            {dropBits
              .filter((b) => !b.removed)
              .map((b) => (
                <div
                  key={b.id}
                  className={`coinbit ${b.bad ? "b" : "g"}`}
                  style={{ left: b.left + "%", animationDelay: b.delay + "s" }}
                  onClick={() => onDropClick(b)}
                  role="button"
                >
                  {b.bad ? "-" : "+"}
                </div>
              ))}
          </div>
          <button className="btn" type="button" onClick={() => onPlay("drop")}>
            Drop . 25 TC
          </button>
        </div>
      )}
      {open === "hilo" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_HILO_01</p>
          <h2>High / Low climb</h2>
          {!hilo.active && (
            <div className="hilo-bets">
              {HILO_BETS.map((b) => (
                <button
                  key={b}
                  className="btn ghost"
                  type="button"
                  onClick={() => hilo.start(b)}
                >
                  Climb . {b} TC
                </button>
              ))}
            </div>
          )}
          {hilo.active && hilo.card && (
            <>
              <p className="stat-line">
                Stake {hilo.bet} . streak {hilo.streak} . pot {hilo.pot} TC
              </p>
              <div
                className={`hilo-card ${isRed(hilo.card) ? "red" : "black"}`}
                style={{ margin: "12px auto" }}
              >
                <span>{hilo.card.label.slice(0, -1)}</span>
                <span style={{ fontSize: "0.9rem" }}>{hilo.card.suit}</span>
              </div>
              <div className="hilo-actions">
                <button className="btn" type="button" onClick={() => hilo.pick("higher")}>
                  Higher
                </button>
                <button className="btn ghost" type="button" onClick={() => hilo.pick("lower")}>
                  Lower
                </button>
                {hilo.streak > 0 && (
                  <button className="btn" type="button" onClick={hilo.cashOut}>
                    Cash out . {hilo.pot} TC
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {open === "face52" && face52.active && (
        <div className="face52-panel">
          <p className="seal">UELG:CASINO_52_01</p>
          <h2>Face-down 52</h2>
          <p className="stat-line">
            Points {face52.points} . flipped{" "}
            {face52.flipped.filter(Boolean).length}/52 . cash 0.8x
          </p>
          <div className="face52-grid">
            {face52.deck.map((c, i) => {
              const on = face52.flipped[i];
              return (
                <button
                  key={i}
                  type="button"
                  className={
                    "face52-tile" +
                    (on ? (isRed(c) ? " flipped red" : " flipped black") : "")
                  }
                  disabled={on || face52.points <= 0}
                  onClick={() => face52.flip(i)}
                >
                  {on ? c.label : "?"}
                </button>
              );
            })}
          </div>
          <button
            className="btn"
            type="button"
            disabled={face52.points <= 0}
            onClick={face52.cashOut}
          >
            Cash out . {Math.floor(face52.points * 0.8)} TC
          </button>
        </div>
      )}
      {open === "flip" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_FLIP</p>
          <h2>Coin Flip . 10 TC . pays 1.9x</h2>
          <div className="hilo-actions">
            <button className="btn" type="button" onClick={() => extra.flip("H")}>
              Heads
            </button>
            <button className="btn ghost" type="button" onClick={() => extra.flip("T")}>
              Tails
            </button>
          </div>
        </div>
      )}
      {open === "dice" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_DICE</p>
          <h2>Dice Over/Under . 10 TC</h2>
          <p>2d6. Over/Under pays 1.8x. Seven pays 4x (fair would be ~6x).</p>
          <div className="hilo-actions">
            <button className="btn" type="button" onClick={() => extra.dice("under")}>
              Under 7
            </button>
            <button className="btn ghost" type="button" onClick={() => extra.dice("seven")}>
              Exactly 7
            </button>
            <button className="btn" type="button" onClick={() => extra.dice("over")}>
              Over 7
            </button>
          </div>
        </div>
      )}
      {open === "lucky" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_LUCKY</p>
          <h2>Lucky 1-10 . 5 TC . pays 8x</h2>
          <div className="letters" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button key={n} type="button" onClick={() => extra.lucky(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
      {open === "doors" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_DOORS</p>
          <h2>Three Doors . 10 TC . prize 2.2x</h2>
          <div className="hilo-actions">
            {[0, 1, 2].map((d) => (
              <button
                key={d}
                className="btn ghost"
                type="button"
                onClick={() => extra.doors(d)}
              >
                Door {d + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {open === "roulette" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_ROUL</p>
          <h2>Mini Roulette . 10 TC</h2>
          <p>0-12 wheel. Green 0 is house. R/B 1.9x . green 12x.</p>
          <div className="hilo-actions">
            <button className="btn" type="button" onClick={() => extra.roulette("R")}>
              Red
            </button>
            <button className="btn ghost" type="button" onClick={() => extra.roulette("B")}>
              Black
            </button>
            <button className="btn" type="button" onClick={() => extra.roulette("G")}>
              Green 0
            </button>
          </div>
        </div>
      )}
      {open === "ladder" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_LADDER</p>
          <h2>Prize Ladder . 8 TC start</h2>
          <p className="stat-line">
            {extra.ladder.active
              ? "Rung " + extra.ladder.rung + " . pot " + extra.ladder.pot + " TC"
              : "Tap Climb to start"}
          </p>
          <div className="hilo-actions">
            <button className="btn" type="button" onClick={extra.ladderStep}>
              {extra.ladder.active ? "Climb" : "Start . 8 TC"}
            </button>
            {extra.ladder.active && extra.ladder.rung > 0 && (
              <button className="btn ghost" type="button" onClick={extra.ladderCash}>
                Cash . {extra.ladder.pot} TC
              </button>
            )}
          </div>
        </div>
      )}
      {open === "memory" && extra.memory.active && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_MEM</p>
          <h2>Memory Match . 12 TC</h2>
          <p>Match pairs. Each match +3 TC (under fair).</p>
          <div className="face52-grid">
            {extra.memory.tiles.map((t, i) => {
              const show =
                extra.memory.revealed.includes(i) ||
                extra.memory.matched.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  className="face52-tile"
                  disabled={show}
                  onClick={() => extra.memoryFlip(i)}
                >
                  {show ? t : "?"}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {open === "scratch" && (
        <div className="hilo-panel">
          <p className="seal">UELG:CASINO_SCRATCH</p>
          <h2>Daily Scratch . 15 TC</h2>
          <button className="btn" type="button" onClick={extra.scratch}>
            Scratch again . 15 TC
          </button>
          {extra.scratchTiles && (
            <div className="hilo-actions" style={{ marginTop: 12 }}>
              {extra.scratchTiles.map((v, i) => (
                <div key={i} className="hilo-card" style={{ width: 64, height: 64 }}>
                  {v}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="msg">
        {msg || (free ? "Tap Wish. Stake is 0." : "House takes ~20%.")}
      </p>
    </>
  );
}
