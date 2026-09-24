"use client";
import { useEffect, useMemo, useState } from "react";
import {
  FRIDAY_RULES,
  getDailySpotlight,
  getFridayWishId,
  isFridayLA,
  laParts,
  nextFridayLabel,
  SPOTLIGHT_POOL,
} from "./dailySpotlight";
import { DJINN_TOOLS, WISH_TOOLS, type WishTool } from "./wishCatalog";

const DISMISS_KEY = "tg-wander-dismiss-until";
const DAILY_KEY = "tg-wander-daily-id";

export { SPOTLIGHT_POOL as WANDER_SPOTLIGHT };

function catalogTip(id: string): WishTool | undefined {
  return WISH_TOOLS.find((t) => t.id === id) || DJINN_TOOLS.find((t) => t.id === id);
}

export function WanderingLamp({
  onOpenWish,
  dailyFreeId,
  fridayActive,
}: {
  onOpenWish?: (id: string) => void;
  dailyFreeId?: string | null;
  fridayActive?: boolean;
}) {
  const [hidden, setHidden] = useState(true);
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState({ x: 12, y: 72 });

  const daily = useMemo(() => {
    const spot = getDailySpotlight();
    const id = dailyFreeId || spot.id;
    try {
      localStorage.setItem(DAILY_KEY, id);
    } catch {}
    return id;
  }, [dailyFreeId]);

  const pool = useMemo(() => {
    const base = [...SPOTLIGHT_POOL];
    const i = base.findIndex((b) => b.id === daily);
    if (i > 0) {
      const [d] = base.splice(i, 1);
      base.unshift(d);
    } else if (i < 0) {
      const meta = catalogTip(daily);
      base.unshift({
        id: daily,
        tip: meta?.hint || "Daily spotlight wish.",
      });
    }
    return base;
  }, [daily]);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (until > Date.now()) {
        setHidden(true);
        return;
      }
    } catch {}
    setHidden(false);
  }, []);

  useEffect(() => {
    if (hidden) return;
    setIdx(0);
    const drift = () => {
      setIdx((i) => (i + 1) % pool.length);
      setPos({
        x: 8 + Math.floor(Math.random() * 70),
        y: 56 + Math.floor(Math.random() * 40),
      });
    };
    const t = window.setInterval(drift, 16000);
    return () => clearInterval(t);
  }, [hidden, pool.length]);

  if (hidden) return null;
  const spot = pool[idx] || pool[0];
  if (!spot) return null;
  const meta = catalogTip(spot.id);
  const isDaily = spot.id === daily;
  const friday = fridayActive ?? isFridayLA();
  const { dateKey } = laParts();

  function dismiss() {
    const until = Date.now() + 24 * 3600 * 1000;
    try {
      localStorage.setItem(DISMISS_KEY, String(until));
    } catch {}
    setHidden(true);
  }

  return (
    <aside
      className="wandering-lamp"
      style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
      aria-label="Wandering Lamp scout"
    >
      <div className="wandering-lamp-glow" />
      <div className="wandering-lamp-body">
        <div className="wandering-lamp-title">
          <span aria-hidden>🪔</span> Wandering Lamp
          {isDaily && <span className="lamp-daily-badge">Daily</span>}
          {friday && isDaily && <span className="lamp-friday-badge">Friday</span>}
          <button type="button" className="wandering-dismiss" onClick={dismiss} aria-label="Dismiss">
            ×
          </button>
        </div>
        <p className="wandering-tip">{spot.tip}</p>
        <p className="wandering-meta">
          {isDaily ? `Spotlight · ${dateKey} PT` : "Scout tip"}
          {friday && isDaily
            ? " · Free Wish Friday unlock on Market"
            : !friday && isDaily
              ? ` · Next Free Wish Friday · ${nextFridayLabel()}`
              : ""}
        </p>
        <button
          type="button"
          className="btn ghost wandering-open"
          onClick={() => onOpenWish && onOpenWish(spot.id)}
        >
          Scout · {meta?.n || spot.id}
          {meta ? ` · ${meta.cost} TC` : ""}
        </button>
        {friday && isDaily && (
          <p className="wandering-meta" title={FRIDAY_RULES}>
            Claim free unlock on Market (once this Friday).
          </p>
        )}
      </div>
    </aside>
  );
}

export function useWanderHighlight(activeId: string | null) {
  useEffect(() => {
    document.querySelectorAll("[data-wish-id]").forEach((el) => {
      el.classList.toggle("wish-spotlight", el.getAttribute("data-wish-id") === activeId);
    });
  }, [activeId]);
}

export function getPinnedDailyId() {
  return getDailySpotlight().id;
}

export function getPinnedFridayId() {
  return getFridayWishId();
}
