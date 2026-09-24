"use client";

import {
  FORGE,
  SEED,
  TEASE,
  type State,
} from "./constants";
import { DJINN_TOOLS, WISH_PACKS, WISH_TOOLS } from "./wishCatalog";

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
      <p className="note">
        Forge matches your wish to a real mini-tool you can Open and Try in Tools.
      </p>
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
        Forge · {FORGE} TC
      </button>
    </>
  );
}

export function MarketPage({
  S,
  msg,
  tick,
  onMarketBuy,
  onWishBuy,
  onWishPackBuy,
  spotlightId,
}: {
  S: State;
  msg: string;
  tick: number;
  onMarketBuy: (name: string) => void;
  onWishBuy?: (id: string) => void;
  onWishPackBuy?: (packId: string) => void;
  spotlightId?: string | null;
}) {
  const ownedIds = new Set(
    S.tools.map((t) => t.freeId).filter(Boolean) as string[]
  );
  const ownedPacks = S.ownedPacks || [];

  return (
    <>
      <p className="seal">UELG:MARKET_01</p>
      <h1>Market</h1>
      <p className="note">
        Genie&apos;s rarest wishes — real offline runners, priced honestly in TC.
        No jailbreak desks.
      </p>
      <Carousel tick={tick} />

      <h2>Rare wishes</h2>
      <div className="grid">
        {WISH_TOOLS.map((w) => {
          const owned = ownedIds.has(w.id);
          return (
            <div
              className={
                "row" + (spotlightId === w.id ? " wish-spotlight" : "")
              }
              key={w.id}
              data-wish-id={w.id}
            >
              <div>
                <b>{w.n}</b>{" "}
                <span className="rarity-badge rarity-rare">rare</span>
                <div className="card-blurb">{w.blurb}</div>
                <div className="seal">{w.cost} TC</div>
              </div>
              <button
                className={"btn" + (owned ? " ghost" : "")}
                type="button"
                disabled={owned || !onWishBuy}
                onClick={() => onWishBuy && onWishBuy(w.id)}
              >
                {owned ? "Owned" : "Buy · " + w.cost + " TC"}
              </button>
            </div>
          );
        })}
      </div>

      <h2>Secret of the Djinn</h2>
      <p className="card-blurb">
        Unheard-of multi-tool shells — expensive because they do many desks in
        one.
      </p>
      <div className="grid">
        {DJINN_TOOLS.map((w) => {
          const owned = ownedIds.has(w.id);
          return (
            <div
              className={
                "row djinn-card" +
                (spotlightId === w.id ? " wish-spotlight" : "")
              }
              key={w.id}
              data-wish-id={w.id}
            >
              <div>
                <b>{w.n}</b>{" "}
                <span className="rarity-badge rarity-djinn">djinn</span>
                <div className="card-blurb">{w.blurb}</div>
                <div className="seal">{w.cost} TC · secret</div>
              </div>
              <button
                className={"btn" + (owned ? " ghost" : "")}
                type="button"
                disabled={owned || !onWishBuy}
                onClick={() => onWishBuy && onWishBuy(w.id)}
              >
                {owned ? "Owned" : "Unlock · " + w.cost + " TC"}
              </button>
            </div>
          );
        })}
      </div>

      <h2>Self-install packs</h2>
      <p className="card-blurb">
        Buy once. Open one tool at a time — each open installs that runner into
        your library.
      </p>
      <div className="grid">
        {WISH_PACKS.map((p) => {
          const owned = ownedPacks.includes(p.id);
          return (
            <div className="row pack-card" key={p.id}>
              <div>
                <b>{p.n}</b>
                <div className="card-blurb">{p.process}</div>
                <div className="seal">
                  {p.cost} TC · {p.toolIds.length} tools · install-on-open
                </div>
              </div>
              <button
                className={"btn" + (owned ? " ghost" : "")}
                type="button"
                disabled={owned || !onWishPackBuy}
                onClick={() => onWishPackBuy && onWishPackBuy(p.id)}
              >
                {owned ? "Owned — install in Tools" : "Buy pack · " + p.cost + " TC"}
              </button>
            </div>
          );
        })}
      </div>

      <h2>Shelf seeds</h2>
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
