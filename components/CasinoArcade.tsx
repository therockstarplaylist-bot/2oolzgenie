"use client";

import {
  type DropBit,
  type State,
} from "./constants";

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
}) {
  return (
    <>
      <p className="seal">UELG:CASINO_01 · house 20%</p>
      <h1>Casino</h1>
      {free && (
        <p className="wish">
          First Three Wishes. {S.wishes} free spin
          {S.wishes === 1 ? "" : "s"} left. The house takes no stake.
        </p>
      )}
      <div className="grid">
        <button className="btn" type="button" onClick={() => onPlay("wheel")}>
          {free ? "Wish · wheel" : "Wheel"}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => onPlay("slots")}
        >
          {free ? "Wish · slots" : "Slots"}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => onPlay("drop")}
        >
          Coin drop
        </button>
      </div>
      <div className="wheel" style={{ transform: `rotate(${wheelDeg}deg)` }} />
      <div className={`reels${showSlots ? "" : " hide"}`}>
        <div className="reel">{reels[0]}</div>
        <div className="reel">{reels[1]}</div>
        <div className="reel">{reels[2]}</div>
      </div>
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
      <p className="msg">
        {msg || (free ? "Tap Wish. Stake is 0." : "House takes 20%.")}
      </p>
    </>
  );
}

export function ArcadePage({
  msg,
  arcadeMode,
  hangWord,
  hangGuessed,
  hangMiss,
  hangShown,
  startHang,
  startTap,
  onTapHit,
  onHangGuess,
}: {
  msg: string;
  arcadeMode: "none" | "tap" | "hang";
  hangWord: string;
  hangGuessed: string[];
  hangMiss: number;
  hangShown: string;
  startHang: () => void;
  startTap: () => void;
  onTapHit: () => void;
  onHangGuess: (l: string) => void;
}) {
  return (
    <>
      <p className="seal">UELG:ARCADE_01</p>
      <h1>Arcade</h1>
      <div className="grid">
        <button className="btn" type="button" onClick={startHang}>
          Lamp Letters
        </button>
        <button className="btn ghost" type="button" onClick={startTap}>
          Tap the Anchor
        </button>
      </div>
      <div>
        {arcadeMode === "tap" && (
          <button
            className="btn"
            type="button"
            onClick={onTapHit}
            style={{ width: "100%", height: 120, fontSize: "2rem" }}
          >
            +
          </button>
        )}
        {arcadeMode === "hang" && hangWord && (
          <>
            <p className="seal">Misses {hangMiss} / 6</p>
            <p className="word">{hangShown}</p>
            <div className="letters">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={hangGuessed.includes(l)}
                  onClick={() => onHangGuess(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <p className="msg">{msg}</p>
    </>
  );
}
