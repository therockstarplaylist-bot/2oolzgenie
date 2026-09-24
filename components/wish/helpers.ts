export function copyText(text: string) {
  try {
    void navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(filename: string, content: string | Blob, mime: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function roughTokens(s: string) {
  return Math.ceil(s.length / 4);
}

/** Split prose into claim-ish sentences. */
export function splitClaims(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

export function looksVerified(s: string) {
  return (
    /\[verified\]/i.test(s) ||
    /https?:\/\//i.test(s) ||
    /\bRFC\s?\d+/i.test(s) ||
    /\b[0-9a-f]{7,40}\b/.test(s) ||
    /\b(as of|according to|measured|cited)\b/i.test(s)
  );
}

export function deepJsonDiff(
  a: unknown,
  b: unknown,
  path = "$"
): { path: string; kind: "added" | "removed" | "changed"; a?: unknown; b?: unknown }[] {
  const out: { path: string; kind: "added" | "removed" | "changed"; a?: unknown; b?: unknown }[] = [];
  if (Object.is(a, b)) return out;
  const ta = Array.isArray(a) ? "array" : a === null ? "null" : typeof a;
  const tb = Array.isArray(b) ? "array" : b === null ? "null" : typeof b;
  if (ta !== tb || ta !== "object" && ta !== "array") {
    if (a === undefined) out.push({ path, kind: "added", b });
    else if (b === undefined) out.push({ path, kind: "removed", a });
    else out.push({ path, kind: "changed", a, b });
    return out;
  }
  if (ta === "array") {
    const aa = a as unknown[];
    const bb = b as unknown[];
    const n = Math.max(aa.length, bb.length);
    for (let i = 0; i < n; i++) {
      if (i >= aa.length) out.push({ path: `${path}[${i}]`, kind: "added", b: bb[i] });
      else if (i >= bb.length) out.push({ path: `${path}[${i}]`, kind: "removed", a: aa[i] });
      else out.push(...deepJsonDiff(aa[i], bb[i], `${path}[${i}]`));
    }
    return out;
  }
  const oa = a as Record<string, unknown>;
  const ob = b as Record<string, unknown>;
  const keys = new Set([...Object.keys(oa), ...Object.keys(ob)]);
  for (const k of keys) {
    const p = path === "$" ? k : `${path}.${k}`;
    if (!(k in oa)) out.push({ path: p, kind: "added", b: ob[k] });
    else if (!(k in ob)) out.push({ path: p, kind: "removed", a: oa[k] });
    else out.push(...deepJsonDiff(oa[k], ob[k], p));
  }
  return out;
}

export function simpleMarkdown(md: string): string {
  let h = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  h = h.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  h = h.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  h = h.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  h = h.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noreferrer">$1<\/a>');
  h = h.replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>");
  h = h.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  h = h.replace(/^(?!<[hul]|<pre|<li)(.+)$/gm, "<p>$1</p>");
  return h;
}

export async function deriveAesKey(pass: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export function b64(buf: ArrayBuffer | Uint8Array) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
}

export function fromB64(s: string) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}
