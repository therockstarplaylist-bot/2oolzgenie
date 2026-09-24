/** Daily Lamp spotlight + One Free Wish Friday — America/Los_Angeles. */

import { WISH_TOOLS, type WishTool } from "./wishLookup";

export const USER_TZ = "America/Los_Angeles";

/** Whoa / demoable rares featured in daily rotation + Friday unlock pool. */
export const SPOTLIGHT_POOL: { id: string; tip: string }[] = [
  { id: "stego", tip: "Hide UTF-8 in a PNG LSB — then extract it. Demo-grade only." },
  { id: "spectro", tip: "Audio → spectrogram canvas; optional whisper burned into the PNG." },
  { id: "stegoverify", tip: "Hide → extract → verify match in one stego roundtrip desk." },
  { id: "waveform", tip: "Paint a waveform PNG from audio and stamp a short line on it." },
  { id: "glitch", tip: "RGB channel-shift a photo into a shareable glitch PNG." },
  { id: "jsongate", tip: "Validate JSON against a small schema — fail with path errors." },
  { id: "jsonpatch", tip: "Diff two JSON blobs into an RFC6902-style patch you can copy." },
  { id: "palift", tip: "Lift a dominant color palette from any image on-device." },
  { id: "claimgate", tip: "Tag every factual claim [verified] or [unverified]." },
  { id: "memory", tip: "AES-GCM notes behind a passphrase — export ciphertext only." },
  { id: "jsondiff", tip: "Path-level added / removed / changed between two JSON pastes." },
  { id: "har", tip: "HAR entry → copyable curl and fetch()." },
];

export function laParts(d = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: USER_TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  const weekday = get("weekday"); // Sun Mon …
  const y = get("year");
  const m = get("month");
  const day = get("day");
  return { weekday, y, m, day, dateKey: `${y}-${m}-${day}` };
}

export function isFridayLA(d = new Date()) {
  return laParts(d).weekday === "Fri";
}

/** ISO-ish week key in LA for once-per-Friday claim (YYYY-Www). */
export function fridayWeekKey(d = new Date()) {
  const { dateKey } = laParts(d);
  // Use Thursday of the LA calendar week containing dateKey for stable week id
  const [y, m, day] = dateKey.split("-").map(Number);
  // Approximate: build UTC noon then find LA Friday week via day-of-year bucket
  const utc = Date.UTC(y, m - 1, day, 20, 0, 0); // ~noon PT-ish
  const tmp = new Date(utc);
  // Day of year in LA
  const start = Date.UTC(y, 0, 1, 20, 0, 0);
  const doy = Math.floor((utc - start) / 86400000) + 1;
  const week = Math.ceil(doy / 7);
  return `${y}-W${String(week).padStart(2, "0")}`;
}

export function nextFridayLabel(d = new Date()) {
  const parts = laParts(d);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dow = map[parts.weekday] ?? 0;
  const add = dow === 5 ? 0 : (5 - dow + 7) % 7;
  const base = new Date(d.getTime() + add * 86400000);
  const n = laParts(base);
  return `${n.weekday} ${n.m}/${n.day} (${USER_TZ})`;
}

function dayIndex(d = new Date()) {
  const { dateKey } = laParts(d);
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  return h;
}

export function getDailySpotlight(d = new Date()) {
  const pool = SPOTLIGHT_POOL;
  const idx = dayIndex(d) % pool.length;
  return pool[idx];
}

/** Friday free unlock target — today's spotlight if it's a rare ≥500, else first whoa. */
export function getFridayWishId(d = new Date()): string {
  const spot = getDailySpotlight(d);
  const meta = WISH_TOOLS.find((t) => t.id === spot.id);
  if (meta && meta.cost >= 500) return meta.id;
  return "stego";
}

export function getWishMeta(id: string): WishTool | undefined {
  return WISH_TOOLS.find((t) => t.id === id);
}

export const FRIDAY_RULES =
  "One Free Wish Friday: once per Friday (America/Los_Angeles), unlock today's featured Rare (≥500 TC) for 0 TC. One claim per Friday week. Not Friday? Banner shows the next Friday and today's paid spotlight instead.";
