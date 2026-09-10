"use client";

import {
  SEED,
  TEASE,
  type State,
} from "./constants";

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
        Forge · 28 TC
      </button>
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
      <p className="seal">UELG:MARKET_01</p>
      <h1>Market</h1>
      <Carousel tick={tick} />
      <div className="grid">
        {SEED.map((x) => (
          <div className="row" key={x[0]}>
            <div>
              <b>{x[0]}</b>
              <div className="seal">
                {x[1]} · {x[2]}
              </div>
            </div>
            <button
              className="btn ghost buy"
              type="button"
              onClick={() => onMarketBuy(x[0])}
            >
              Buy · 24 TC
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
