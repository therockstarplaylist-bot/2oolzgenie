/** Honest invite loop — invitee gets modest TC + one free forge. No self-referral exploit. */

export const INVITE_TC = 40;
export const INVITE_CODE_KEY = "tg-invite-code";
export const INVITE_PARAM = "invite";

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function mintInviteCode(): string {
  let s = "TG";
  const buf = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 6; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 6; i++) s += ALPHA[buf[i] % ALPHA.length];
  return s;
}

export function ensureInviteCode(): string {
  try {
    const existing = localStorage.getItem(INVITE_CODE_KEY);
    if (existing && /^TG[A-Z0-9]{6}$/.test(existing)) return existing;
    const code = mintInviteCode();
    localStorage.setItem(INVITE_CODE_KEY, code);
    return code;
  } catch {
    return mintInviteCode();
  }
}

export function inviteUrl(code: string, origin?: string) {
  const base =
    origin ||
    (typeof location !== "undefined" ? location.origin : "https://www.2oolzgenie.com");
  return `${base}/?${INVITE_PARAM}=${encodeURIComponent(code)}`;
}

export function readInviteFromUrl(): string | null {
  if (typeof location === "undefined") return null;
  try {
    const u = new URL(location.href);
    const raw = (u.searchParams.get(INVITE_PARAM) || "").trim().toUpperCase();
    if (!/^TG[A-Z0-9]{6}$/.test(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

export function stripInviteFromUrl() {
  if (typeof history === "undefined" || typeof location === "undefined") return;
  try {
    const u = new URL(location.href);
    if (!u.searchParams.has(INVITE_PARAM)) return;
    u.searchParams.delete(INVITE_PARAM);
    history.replaceState({}, "", u.pathname + u.search + u.hash);
  } catch {}
}
