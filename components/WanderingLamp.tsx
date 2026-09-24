"use client";
import { useEffect, useMemo, useState } from "react";
import { DJINN_TOOLS, WISH_TOOLS, type WishTool } from "./wishCatalog";

const DISMISS_KEY = "tg-wander-dismiss-until";
const DAILY_KEY = "tg-wander-daily-id";

/** Configurable spotlight pool — Rare / Djinn / whoa / Grok-leverage first. */
export const WANDER_SPOTLIGHT: { id: string; tip: string }[] = [
  { id: "stego", tip: "Hide a short UTF-8 note inside a PNG — demo-grade only." },
  { id: "spectro", tip: "Paint audio as a spectrogram; optionally burn a whisper into the PNG." },
  { id: "claimgate", tip: "Tag every factual claim [verified] or [unverified] and list what needs evidence." },
  { id: "spec", tip: "Turn a wish into Given/When/Then checks plus out-of-scope bullets." },
  { id: "resume", tip: "Build a bootable handoff card for the next Grok chat." },
  { id: "falsifier", tip: "Write five concrete ways a claim could be proven wrong." },
  { id: "omni", tip: "Secret desk: JSON diff, JWT peek, PEM, and Base64/hex in one shell." },
  { id: "mindforge", tip: "Secret forge: vault, distill, claims, gate, falsify, resume." },
  { id: "archive", tip: "Secret archive: PDF text, EXIF strip, and SQLite together." },
  { id: "memory", tip: "Encrypt notes with a passphrase; export only ciphertext." },
  { id: "packer", tip: "Crush a long paste into a system-prompt block and see drops." },
  { id: "wishissue", tip: "Pack a wish into a GitHub issue + PR description." },
];

function catalogTip(id: string): WishTool | undefined {
  return WISH_TOOLS.find((t) => t.id === id) || DJINN_TOOLS.find((t) => t.id === id);
}

export function WanderingLamp({
  onOpenWish,
  dailyFreeId,
}: {
  onOpenWish?: (id: string) => void;
  /** Optional One Free Wish Friday target */
  dailyFreeId?: string | null;
}) {
  const [hidden, setHidden] = useState(true);
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState({ x: 12, y: 72 });

  const pool = useMemo(() => {
    const daily = dailyFreeId || (typeof window !== "undefined" ? localStorage.getItem(DAILY_KEY) : null);
    const base = [...WANDER_SPOTLIGHT];
    if (daily && !base.some((b) => b.id === daily)) {
      const meta = catalogTip(daily);
      base.unshift({
        id: daily,
        tip: meta?.hint || "Daily free spotlight wish.",
      });
    } else if (daily) {
      const i = base.findIndex((b) => b.id === daily);
      if (i > 0) {
        const [d] = base.splice(i, 1);
        base.unshift(d);
      }
    }
    return base;
  }, [dailyFreeId]);

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
    const drift = () => {
      setIdx((i) => (i + 1) % pool.length);
      setPos({
        x: 8 + Math.floor(Math.random() * 70),
        y: 56 + Math.floor(Math.random() * 40),
      });
    };
    const t = window.setInterval(drift, 14000);
    return () => clearInterval(t);
  }, [hidden, pool.length]);

  if (hidden) return null;
  const spot = pool[idx] || pool[0];
  if (!spot) return null;
  const meta = catalogTip(spot.id);

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
          <button type="button" className="wandering-dismiss" onClick={dismiss} aria-label="Dismiss">
            ×
          </button>
        </div>
        <p className="wandering-tip">{spot.tip}</p>
        <button
          type="button"
          className="btn ghost wandering-open"
          onClick={() => onOpenWish && onOpenWish(spot.id)}
        >
          Scout · {meta?.n || spot.id}
          {meta ? ` · ${meta.cost} TC` : ""}
        </button>
      </div>
    </aside>
  );
}

/** Call from Market/Tools to soft-glow a card matching data-wish-id. */
export function useWanderHighlight(activeId: string | null) {
  useEffect(() => {
    document.querySelectorAll("[data-wish-id]").forEach((el) => {
      el.classList.toggle("wish-spotlight", el.getAttribute("data-wish-id") === activeId);
    });
  }, [activeId]);
}
