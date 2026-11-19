"use client";

import { FORGE_COST, FREE_TOOLS, MARKET_COST, TEASE, type State } from "./constants";

export function Carousel({ tick }: { tick: number }) {
  const i = Math.floor(tick / 30000) % TEASE.length;
  const left = 30 - Math.floor((tick / 1000) % 30);
  return (
    <div className="carousel">
      <p className="seal">Expert lamp · {left}s</p>
      <p
        style={{
          margin: "6px 0 0",
          color: "var(--fg)",
          fontFamily: "Instrument Serif, Georgia, serif",
          fontSize: "1.35rem",
        }}
      >
        {TEASE[i]}
      </p>
    </div>
  );
}

type Common = {
  S: State;
  msg: string;
  setMsg: (m: string) => void;
  hourly: number;
};

export function ForgePage({
  S,
  msg,
  lastDrip,
  need,
  setNeed,
  tick,
  onForge,
  hourly,
}: Common & {
  lastDrip: number;
  need: string;
  setNeed: (v: string) => void;
  tick: number;
  onForge: () => void;
}) {
  return (
    <>
      <p className="seal">UELG:FORGE_01 · UELG:EASE_01</p>
      <h1>Describe the tool you need...</h1>
      <p className="drip">
        +{hourly} TC / hour · {S.wishes} wishes
      </p>
      {lastDrip > 0 && (
        <p className="msg ok">
          The lamp paid +{lastDrip} TC while you were away.
        </p>
      )}
      <Carousel tick={tick} />
      <textarea
        value={need}
        onChange={(e) => setNeed(e.target.value)}
        placeholder="Describe the tool you need..."
      />
      <p className="msg">{msg}</p>
      <button className="btn" type="button" onClick={onForge}>
        Forge{FORGE_COST > 0 ? ` · ${FORGE_COST} TC` : ""}
        <span className="free-pill">Free for now</span>
      </button>
      <p className="note">Describe a note, joke, reminder, coin flip, sparkle, or a calm minute. Empty text is not a tool.</p>
    </>
  );
}

export function MarketPage({
  S,
  msg,
  tick,
  onMarketBuy,
}: {
  S: State;
  msg: string;
  tick: number;
  onMarketBuy: (name: string) => void;
}) {
  return (
    <>
      <p className="seal">The shelf</p>
      <h1>Market</h1>
      <p className="note">
        These are the real lamp tools. Adding one is free for now
        {MARKET_COST > 0 ? ` (${MARKET_COST} TC)` : ""}. Open it under Tools.
      </p>
      <Carousel tick={tick} />
      <div className="grid">
        {FREE_TOOLS.map((tool) => (
          <div className="row" key={tool.id}>
            <div>
              <b>{tool.n}</b>
              <div className="seal">{tool.blurb}</div>
            </div>
            <button className="btn ghost buy" type="button" onClick={() => onMarketBuy(tool.n)}>
              Add<span className="free-pill">Free for now</span>
            </button>
          </div>
        ))}
        {S.tools.map((t, i) => (
          <div className="row" key={t.n + t.t + i}>
            <b>{t.n}</b>
            <span className="seal">kept</span>
          </div>
        ))}
      </div>
      <p className="msg">{msg}</p>
    </>
  );
}
