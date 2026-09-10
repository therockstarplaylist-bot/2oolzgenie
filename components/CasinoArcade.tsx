"use client";

export { CasinoPage } from "./CasinoLobby";

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
