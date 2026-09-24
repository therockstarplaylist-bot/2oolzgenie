"use client";

import { useEffect } from "react";
import {
  FORGE,
  SEED,
  TEASE,
  type State,
} from "./constants";
import {
  FRIDAY_RULES,
  fridayWeekKey,
  getDailySpotlight,
  getFridayWishId,
  getWishMeta,
  isFridayLA,
  nextFridayLabel,
} from "./dailySpotlight";
import { DJINN_TOOLS, WISH_PACKS, WISH_TOOLS } from "./wishLookup";

const WHOA_IDS = ["stego", "spectro", "stegoverify", "waveform", "glitch", "palift", "jsongate", "jsonpatch"];

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
  const spot = getDailySpotlight();
  const meta = getWishMeta(spot.id);
  return (
    <>
      <p className="seal">UELG:FORGE_01 · UELG:EASE_01</p>
      <h1>Describe the tool you need...</h1>
      <p className="note">
        Forge matches your wish to a real mini-tool you can Open and Try in Tools.
        Market whoa: Stego Drop, Spectrogram Whisper, Waveform Stamp, Channel Glitch —
        offline runners, honest TC prices.
      </p>
      <p className="drip">
        +{hourly} TC / hour · {S.wishes} wishes
        {S.freeForge ? ` · ${S.freeForge} free forge` : ""}
      </p>
      {lastDrip > 0 && (
        <p className="msg ok">
          The lamp paid +{lastDrip} TC while you were away.
        </p>
      )}
      <div className="brag-strip">
        <span className="brag-chip">Stego · LSB PNG hide/extract</span>
        <span className="brag-chip">Spectro · audio → PNG whisper</span>
        <span className="brag-chip">
          Today · {meta?.n || spot.id}
          {meta ? ` · ${meta.cost} TC` : ""}
        </span>
      </div>
      <Carousel tick={tick} />
      <textarea
        value={need}
        onChange={(e) => setNeed(e.target.value)}
        placeholder="Describe the tool you need..."
      />
      <p className="msg">{msg}</p>
      <button className="btn" type="button" onClick={onForge}>
        Forge · {S.freeForge && S.freeForge > 0 ? "free" : FORGE + " TC"}
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
  onFridayClaim,
  spotlightId,
}: {
  S: State;
  msg: string;
  tick: number;
  onMarketBuy: (name: string) => void;
  onWishBuy?: (id: string) => void;
  onWishPackBuy?: (packId: string) => void;
  onFridayClaim?: () => void;
  spotlightId?: string | null;
}) {
  const ownedIds = new Set(
    S.tools.map((t) => t.freeId).filter(Boolean) as string[]
  );
  const ownedPacks = S.ownedPacks || [];
  const friday = isFridayLA();
  const fridayId = getFridayWishId();
  const fridayMeta = getWishMeta(fridayId);
  const daily = getDailySpotlight();
  const dailyMeta = getWishMeta(daily.id);
  const claimed = S.fridayClaimWeek === fridayWeekKey();
  const activeSpotlight = spotlightId || daily.id;

  useEffect(() => {
    if (!activeSpotlight) return;
    const el = document.querySelector(`[data-wish-id="${activeSpotlight}"]`);
    if (el && "scrollIntoView" in el) {
      (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSpotlight]);

  const whoa = WISH_TOOLS.filter((w) => WHOA_IDS.includes(w.id));
  const rest = WISH_TOOLS.filter((w) => !WHOA_IDS.includes(w.id));

  return (
    <>
      <p className="seal">UELG:MARKET_01</p>
      <h1>Market</h1>
      <p className="note">
        Genie&apos;s rarest wishes — real offline runners, priced honestly in TC.
        No jailbreak desks. No fake metrics.
      </p>

      <div className={"friday-banner" + (friday ? " friday-on" : "")}>
        <p className="seal">One Free Wish Friday · America/Los_Angeles</p>
        {friday ? (
          <>
            <p className="card-blurb">
              Today is Friday. Unlock <b>{fridayMeta?.n || fridayId}</b> once for 0 TC
              {fridayMeta ? ` (normally ${fridayMeta.cost} TC)` : ""}. One claim per Friday week.
            </p>
            <button
              className="btn"
              type="button"
              disabled={
                !onFridayClaim ||
                ownedIds.has(fridayId) ||
                claimed
              }
              onClick={() => onFridayClaim && onFridayClaim()}
            >
              {ownedIds.has(fridayId)
                ? "Already owned"
                : claimed
                  ? "Already claimed this Friday"
                  : "Claim free · " + (fridayMeta?.n || fridayId)}
            </button>
          </>
        ) : (
          <p className="card-blurb">
            Not Friday in PT. Next Free Wish Friday · <b>{nextFridayLabel()}</b>.
            Today&apos;s paid spotlight: <b>{dailyMeta?.n || daily.id}</b>
            {dailyMeta ? ` · ${dailyMeta.cost} TC` : ""}. {FRIDAY_RULES}
          </p>
        )}
      </div>

      <div className="brag-strip">
        <span className="brag-chip">Stego Drop · hide UTF-8 in PNG</span>
        <span className="brag-chip">Spectrogram Whisper · audio → PNG</span>
        <span className="brag-chip">Waveform Stamp · shareable</span>
        <span className="brag-chip">Channel Glitch · RGB whoa</span>
      </div>

      <p className="drip">
        Daily Lamp spotlight · {dailyMeta?.n || daily.id}
        {dailyMeta ? ` · ${dailyMeta.cost} TC` : ""} · rotates each PT day
      </p>

      <Carousel tick={tick} />

      <h2>Whoa rares</h2>
      <p className="card-blurb">
        Demoable desks worth bragging about — stego, spectro, glitch, schema, patch.
      </p>
      <div className="grid">
        {whoa.map((w) => {
          const owned = ownedIds.has(w.id);
          return (
            <div
              className={
                "row whoa-card" +
                (activeSpotlight === w.id ? " wish-spotlight" : "")
              }
              key={w.id}
              data-wish-id={w.id}
            >
              <div>
                <b>{w.n}</b>{" "}
                <span className="rarity-badge rarity-rare">rare</span>{" "}
                <span className="rarity-badge whoa-badge">whoa</span>
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

      <h2>Rare wishes</h2>
      <div className="grid">
        {rest.map((w) => {
          const owned = ownedIds.has(w.id);
          return (
            <div
              className={
                "row" + (activeSpotlight === w.id ? " wish-spotlight" : "")
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
                (activeSpotlight === w.id ? " wish-spotlight" : "")
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
