/** Throttle shop / pack upsells so they never spam. */
const KEY = "tg_buy_prompt_log";
const WINDOW_MS = 5 * 60 * 1000;
const MAX_IN_WINDOW = 2;
/** Minimum gap between two shows (~2.5 min) so "twice per 5 min" is the ceiling. */
const MIN_GAP_MS = 150 * 1000;

function readLog(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((n): n is number => typeof n === "number");
  } catch {
    return [];
  }
}

function writeLog(times: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(times));
  } catch {}
}

/** True if a buy/upsell modal or forced Shop nudge may show now. */
export function canShowBuyPrompt(now = Date.now()): boolean {
  const cutoff = now - WINDOW_MS;
  const recent = readLog().filter((t) => t >= cutoff);
  if (recent.length >= MAX_IN_WINDOW) return false;
  const last = recent[recent.length - 1];
  if (last != null && now - last < MIN_GAP_MS) return false;
  return true;
}

/** Call only when you actually show the prompt. */
export function recordBuyPromptShow(now = Date.now()): void {
  const cutoff = now - WINDOW_MS;
  const next = readLog().filter((t) => t >= cutoff);
  next.push(now);
  writeLog(next);
}

/**
 * Try to show a buy prompt. Returns true if allowed (and records the show).
 * Use for modals / auto-navigate to Shop — not for quiet inline "Need N TC" text.
 */
export function tryShowBuyPrompt(now = Date.now()): boolean {
  if (!canShowBuyPrompt(now)) return false;
  recordBuyPromptShow(now);
  return true;
}
