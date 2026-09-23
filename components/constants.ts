export const PAGES = [
  "forge",
  "market",
  "casino",
  "arcade",
  "tools",
  "shop",
  "profile",
] as const;
export type Page = (typeof PAGES)[number];
export const KEY = "2oolz-v2";
export const START = 200;
export const FORGE = 12;
export const FIRST_REAL_FORGE_KEY = "tg_first_real_forge";
export const LOSS_CAP = 200;
export const ARCADE_CAP = 50;
export const DROP_COST = 25;
export const WISH_BET = 10;
export const MAX_H = 72;
export const PAYPAL = "theopenmindfold@gmail.com";
export const OWNER_EMAIL = "therockstarplaylist@gmail.com";
export const OWNER_GRANT = 500_000;
export const HOURLY: Record<string, number> = {
  free: 1,
  basic: 3,
  pro: 6,
  ultimate: 10,
  lifetime: 15,
};
export const TIERS = [
  { id: "free", l: "Free", c: 200, u: 0, cad: "start" },
  { id: "basic", l: "Basic", c: 300, u: 9, cad: "year" },
  { id: "pro", l: "Pro", c: 650, u: 29, cad: "year" },
  { id: "ultimate", l: "Ultimate", c: 1000, u: 79, cad: "year" },
  { id: "lifetime", l: "Lifetime", c: 2500, u: 149, cad: "once" },
] as const;
export const PACKS = [
  { id: "starter", l: "Starter pack", c: 120, u: 5 },
  { id: "bag", l: "Coin bag", c: 500, u: 15 },
  { id: "vault", l: "Vault", c: 1600, u: 40 },
] as const;
export const WHEEL = [0, 0, 0, 0.5, 0.5, 1, 1.4, 3];
export const SY = ["A", "L", "C", "S", "V", "*"];
export const SEED: [string, string, string][] = [
  ["Anchor Pulse", "hardware", "rare"],
  ["Seal Ledger", "analysis", "epic"],
  ["Lamp Index", "workflow", "uncommon"],
  ["Coil Tuner", "script", "common"],
  ["Void Map", "security", "legendary"],
];
export const TEASE = [
  "Pulse Lock",
  "Night Ledger",
  "Coil Whisper",
  "Seal Compass",
  "Lamp Index",
  "Vault Needle",
  "Wish Wire",
  "Anchor Map",
  "Quiet Field",
  "Nine Floors",
];
export const HANG = [
  "GENIE",
  "ANCHOR",
  "FORGE",
  "SEAL",
  "LAMP",
  "COIL",
  "VAULT",
  "WISH",
  "PULSE",
];
export type ToolRarity = "common" | "uncommon" | "rare";
export type FreeTool = {
  id: string;
  n: string;
  r: ToolRarity;
  rarity: ToolRarity;
  blurb: string;
  how: string[];
  body: string;
  /** Plain action line for Nearby ideas — never a product name. */
  hint: string;
  tags: string[];
};
export const FREE_TOOLS: FreeTool[] = [
  {
    id: "paste",
    n: "Paste Cleaner",
    r: "common",
    rarity: "common",
    blurb: "Strip utm_*/fbclid tracking params, collapse whitespace, copy clean.",
    how: ["Paste a URL or messy text", "Tap Clean", "Tap Copy"],
    body: "Client-side cleaner. Removes common trackers (utm_*, fbclid, gclid, and friends) and collapses noisy whitespace. Zero TC.",
    hint: "Strip tracking junk from a pasted link and copy the clean text.",
    tags: ["url", "track", "clean", "strip", "link", "utm", "paste"],
  },
  {
    id: "timer",
    n: "Focus Timer",
    r: "common",
    rarity: "common",
    blurb: "Minutes in, real countdown with start / pause / reset.",
    how: ["Set minutes", "Tap Start", "Pause or Reset anytime"],
    body: "A real in-browser focus countdown. Soft lamp copy, hard clock math. Zero TC.",
    hint: "Set a quiet countdown and pause it when you need a breath.",
    tags: ["focus", "clock", "countdown", "minute", "timer", "pomodoro"],
  },
  {
    id: "check",
    n: "Quick Checklist",
    r: "common",
    rarity: "common",
    blurb: "Add, toggle, delete — persists in localStorage.",
    how: ["Type an item and tap Add", "Tap to check off", "Delete what you do not need"],
    body: "Tiny checklist saved under tg-checklist on this device. Zero TC.",
    hint: "Keep a short checklist that stays on this device.",
    tags: ["list", "todo", "checklist", "task", "agenda"],
  },
  {
    id: "words",
    n: "Word / Char Counter",
    r: "common",
    rarity: "common",
    blurb: "Live counts for words, characters, and lines.",
    how: ["Paste or type text", "Watch the counts update"],
    body: "Instant word, character, and line tallies as you type. Zero TC.",
    hint: "Count words, characters, and lines as you type.",
    tags: ["count", "text", "writing", "words", "chars"],
  },
  {
    id: "json",
    n: "JSON Format & Validate",
    r: "uncommon",
    rarity: "uncommon",
    blurb: "Pretty-print or minify; clear parse errors.",
    how: ["Paste JSON", "Tap Pretty or Minify", "Fix errors from the message"],
    body: "Format and validate JSON in the lamp. Pretty or compact output. Zero TC.",
    hint: "Pretty-print or crush JSON and catch parse errors.",
    tags: ["json", "api", "pretty", "format", "parse", "payload"],
  },
  {
    id: "diff",
    n: "Text Diff",
    r: "uncommon",
    rarity: "uncommon",
    blurb: "Two panes, line-level added / removed highlight.",
    how: ["Paste left and right text", "Tap Diff", "Read added (+) and removed (−) lines"],
    body: "Simple line-level compare for drafts and configs. Zero TC.",
    hint: "Compare two drafts line by line and spot what changed.",
    tags: ["compare", "draft", "diff", "lines"],
  },
  {
    id: "units",
    n: "Unit Convert",
    r: "uncommon",
    rarity: "uncommon",
    blurb: "Length, mass, and temperature common pairs.",
    how: ["Pick a category and units", "Enter a value", "Read the converted result"],
    body: "Everyday unit conversions without leaving the shelf. Zero TC.",
    hint: "Convert length, mass, or temperature without leaving the lamp.",
    tags: ["convert", "measure", "units", "temp"],
  },
  {
    id: "case",
    n: "Case Convert",
    r: "uncommon",
    rarity: "uncommon",
    blurb: "lower / UPPER / Title / snake / kebab / camel.",
    how: ["Paste text", "Tap a case button", "Copy the result"],
    body: "Six case transforms for identifiers and titles. Zero TC.",
    hint: "Flip text between lower, UPPER, Title, snake, kebab, and camel.",
    tags: ["case", "snake", "camel", "kebab", "identifier"],
  },
  {
    id: "regex",
    n: "Regex Lab",
    r: "rare",
    rarity: "rare",
    blurb: "Pattern, flags, test string — matches and capture groups live.",
    how: ["Enter pattern and flags", "Paste a test string", "Inspect matches and groups"],
    body: "Live regex lab with safe try/catch for invalid patterns. Hard to DIY well. Zero TC.",
    hint: "Test a pattern live and see every match and capture group.",
    tags: ["regex", "pattern", "match", "test"],
  },
  {
    id: "jwt",
    n: "JWT Decoder",
    r: "rare",
    rarity: "rare",
    blurb: "Base64url-decode header + payload to pretty JSON (decode only).",
    how: ["Paste a JWT", "Read header and payload JSON", "Note: decode only, not verified"],
    body: "Decode JWT segments client-side. No signature verify — labeled decode only. Zero TC.",
    hint: "Peek inside a token's header and payload — decode only, not verified.",
    tags: ["token", "jwt", "auth", "security", "decode"],
  },
  {
    id: "csvjson",
    n: "CSV ↔ JSON",
    r: "rare",
    rarity: "rare",
    blurb: "Detect delimiter, convert either way, download or copy.",
    how: ["Paste CSV or JSON", "Tap Convert", "Copy or download the result"],
    body: "Bidirectional CSV/JSON with delimiter detection. A real utility desk. Zero TC.",
    hint: "Turn a spreadsheet paste into JSON — or the other way around.",
    tags: ["csv", "data", "table", "json", "spreadsheet"],
  },
  {
    id: "hash",
    n: "Checksum Desk",
    r: "rare",
    rarity: "rare",
    blurb: "SHA-256 / SHA-1 / SHA-512 via crypto.subtle — hex + copy.",
    how: ["Paste text", "Pick an algorithm", "Copy the hex digest"],
    body: "Browser SubtleCrypto digests for pasted text. Hex output ready to paste. Zero TC.",
    hint: "Fingerprint pasted text with SHA-256 / SHA-1 / SHA-512 and copy the hex.",
    tags: ["hash", "checksum", "sha", "fingerprint", "security"],
  },
  {
    id: "ics",
    n: "Meeting ICS Builder",
    r: "rare",
    rarity: "rare",
    blurb: "Title, start/end, location → downloadable .ics file.",
    how: ["Fill title, times, location", "Tap Download .ics", "Open in your calendar app"],
    body: "Build a floating/UTC-friendly ICS invite in one pass. Zero TC.",
    hint: "Build a meeting invite file your calendar app can open.",
    tags: ["calendar", "meeting", "invite", "schedule", "ics"],
  },
  {
    id: "cron",
    n: "Cron Explainer",
    r: "rare",
    rarity: "rare",
    blurb: "Parse 5-field cron into plain English + next fire times.",
    how: ["Paste a 5-field cron", "Read the English summary", "Check the next five estimates"],
    body: "Cron that actually explains itself — hard to DIY cleanly. Zero TC.",
    hint: "Translate a 5-field schedule into plain English and next fire times.",
    tags: ["cron", "schedule", "workflow", "timer"],
  },
];

/** Legacy freeIds from earlier shelves → current catalog ids. */
export const FREE_TOOL_ALIASES: Record<string, string> = {
  "paste-cleaner": "paste",
  "focus-timer": "timer",
  "quick-checklist": "check",
};

export function resolveFreeToolId(id: string) {
  return FREE_TOOL_ALIASES[id] || id;
}

export function getFreeTool(id: string | undefined) {
  if (!id) return undefined;
  return FREE_TOOLS.find((x) => x.id === resolveFreeToolId(id));
}

/** Pick which runnable free tool a first forge should land. */
export function pickFirstForgeTool(need: string) {
  const t = need.toLowerCase();
  const byId = (id: string) => FREE_TOOLS.find((x) => x.id === id)!;
  if (/clean|paste|url|track|utm|whitelist|strip/.test(t)) return byId("paste");
  if (/timer|focus|pomodoro|countdown|clock|minute/.test(t)) return byId("timer");
  if (/check|list|todo|task|item/.test(t)) return byId("check");
  if (/word|char|count/.test(t)) return byId("words");
  if (/json/.test(t)) return byId("json");
  if (/diff|compare/.test(t)) return byId("diff");
  if (/unit|convert|celsius|fahrenheit/.test(t)) return byId("units");
  if (/case|snake|kebab|camel/.test(t)) return byId("case");
  if (/regex|regexp/.test(t)) return byId("regex");
  if (/jwt|token/.test(t)) return byId("jwt");
  if (/csv/.test(t)) return byId("csvjson");
  if (/hash|sha|checksum/.test(t)) return byId("hash");
  if (/ics|calendar|meeting|invite/.test(t)) return byId("ics");
  if (/cron|schedule/.test(t)) return byId("cron");
  return byId("check");
}

export type ProcessPack = {
  id: string;
  n: string;
  cost: number;
  /** Outcome-first process copy — not a shopping list of tool names. */
  process: string;
  toolIds: string[];
  /** Honest ala-carte reference (market seed ~24 TC each). */
  alaCarte: number;
};

export const PROCESS_PACKS: ProcessPack[] = [
  {
    id: "clean-desk",
    n: "Clean Desk",
    cost: 40,
    process: "Paste messy links → clean text → park tasks → timed focus block.",
    toolIds: ["paste", "check", "timer"],
    alaCarte: 72,
  },
  {
    id: "data-prep",
    n: "Data Prep",
    cost: 65,
    process: "Turn spreadsheet dumps into clean JSON, validate, fingerprint.",
    toolIds: ["csvjson", "json", "hash"],
    alaCarte: 72,
  },
  {
    id: "ship-guard",
    n: "Ship Guard",
    cost: 75,
    process: "Test patterns, decode tokens, checksum the payload before you ship.",
    toolIds: ["regex", "jwt", "hash"],
    alaCarte: 72,
  },
  {
    id: "meeting-runner",
    n: "Meeting Runner",
    cost: 50,
    process: "Build the invite file, checklist the agenda, run the pre-call timer.",
    toolIds: ["ics", "check", "timer"],
    alaCarte: 72,
  },
];

export function getProcessPack(id: string | undefined) {
  if (!id) return undefined;
  return PROCESS_PACKS.find((p) => p.id === id);
}

/** Curated + context-scored Nearby ideas (does-lines only, no tool names). */
export function pickNearbyHints(
  rarity: ToolRarity,
  contextText = "",
  limit = 3
): { id: string; hint: string }[] {
  const ctx = contextText.toLowerCase();
  const pool = FREE_TOOLS.filter((t) => t.rarity === rarity);
  const scored = pool.map((t) => {
    let score = 1;
    for (const tag of t.tags) {
      if (ctx.includes(tag)) score += 3;
    }
    if (/json|api|payload|script/.test(ctx) && t.tags.includes("json")) score += 2;
    if (/list|todo|check|agenda/.test(ctx) && t.tags.includes("list")) score += 2;
    if (
      /security|token|hash|auth/.test(ctx) &&
      (t.tags.includes("security") ||
        t.tags.includes("hash") ||
        t.tags.includes("token"))
    )
      score += 2;
    if (
      /schedule|meeting|calendar|cron/.test(ctx) &&
      (t.tags.includes("schedule") || t.tags.includes("meeting") || t.tags.includes("cron"))
    )
      score += 2;
    return { id: t.id, hint: t.hint, score };
  });
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.slice(0, limit).map(({ id, hint }) => ({ id, hint }));
}

export type Tool = { n: string; r: string; t: number; freeId?: string; forgeId?: string; brief?: string; packId?: string };

export function contextFromLibrary(tools: Tool[]): string {
  return tools
    .slice(0, 8)
    .map((t) => `${t.n} ${t.brief || ""} ${t.r}`)
    .join(" ");
}


export type State = {
  coins: number;
  tools: Tool[];
  loss: number;
  earn: number;
  day: string;
  page: Page;
  tier: string;
  wishes: number;
  passiveAt: number;
  email?: string;
  ownerGrant?: boolean;
  /** One-time +500k TC for OWNER_EMAIL */
  ownerMegaGrant?: boolean;
  /** Process pack ids already purchased (one-time). */
  ownedPacks?: string[];
};
export type DropBit = {
  id: number;
  bad: boolean;
  left: number;
  delay: number;
  removed?: boolean;
};
export function today() {
  return new Date().toISOString().slice(0, 10);
}
export function load(): State | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export function save(s: State) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function defaultState(): State {
  return {
    coins: START,
    tools: [],
    loss: 0,
    earn: 0,
    day: today(),
    page: "forge",
    tier: "free",
    wishes: 3,
    passiveAt: Date.now(),
    ownedPacks: [],
  };
}
export function normalize(raw: Partial<State> | null): State {
  const S = { ...defaultState(), ...(raw || {}) };
  if (S.wishes == null) S.wishes = 3;
  if (!S.passiveAt) S.passiveAt = Date.now();
  if (!S.tier) S.tier = "free";
  if (!PAGES.includes(S.page as Page)) S.page = "forge";
  if (typeof S.email === "string") S.email = S.email.trim().toLowerCase();
  else delete S.email;
  if (S.ownerGrant == null) S.ownerGrant = false;
  if (S.ownerMegaGrant == null) S.ownerMegaGrant = false;
  if (!Array.isArray(S.ownedPacks)) S.ownedPacks = [];
  if (S.day !== today()) {
    S.loss = 0;
    S.earn = 0;
    S.day = today();
  }
  return S;
}
export function applyOwnerGrant(S: State): { state: State; granted: boolean } {
  const email = (S.email || "").trim().toLowerCase();
  // Mega grant: +500k once for OWNER_EMAIL (separate from any old +1000 ownerGrant).
  if (email !== OWNER_EMAIL.toLowerCase() || S.ownerMegaGrant) {
    return { state: S, granted: false };
  }
  return {
    state: {
      ...S,
      coins: S.coins + OWNER_GRANT,
      ownerGrant: true,
      ownerMegaGrant: true,
    },
    granted: true,
  };
}
export function applyDrip(S: State): { state: State; gained: number } {
  const rate = HOURLY[S.tier] || 1;
  const h = Math.min(MAX_H, Math.floor((Date.now() - S.passiveAt) / 3600000));
  if (h < 1) return { state: S, gained: 0 };
  const c = h * rate;
  const next = {
    ...S,
    coins: S.coins + c,
    passiveAt: S.passiveAt + h * 3600000,
  };
  return { state: next, gained: c };
}
export function goPaypal(id: string, label: string, usd: number) {
  sessionStorage.setItem("2oolz-pending", id);
  const ret =
    location.origin + location.pathname + "?paid=" + encodeURIComponent(id);
  const f = document.createElement("form");
  f.method = "POST";
  f.action = "https://www.paypal.com/cgi-bin/webscr";
  const fields: Record<string, string> = {
    cmd: "_xclick",
    business: PAYPAL,
    item_name: "2oolz Genie . " + label,
    item_number: id,
    amount: Number(usd).toFixed(2),
    currency_code: "USD",
    no_shipping: "1",
    no_note: "1",
    rm: "1",
    return: ret,
    cancel_return: location.origin + location.pathname + "?page=shop",
    charset: "utf-8",
    lc: "US",
  };
  Object.keys(fields).forEach((k) => {
    const i = document.createElement("input");
    i.type = "hidden";
    i.name = k;
    i.value = fields[k];
    f.appendChild(i);
  });
  document.body.appendChild(f);
  f.submit();
}
export const HILO_MULT = [0, 1.5, 2.4, 3.6, 5.2, 7.5, 11, 14, 18, 22, 25];
export const HILO_CAP_MULT = 25;
export const HILO_BETS = [5, 10, 15] as const;
export const HILO_CONSOLATION = 3;
export const FACE52_COST = 100;
export const FACE52_START = 100;
export const FACE52_CLEAR_BONUS = 500;
export const FACE52_CASH_RATE = 0.8;
export type Card = { rank: number; suit: "S" | "H" | "D" | "C"; label: string };
const SUITS: Card["suit"][] = ["S", "H", "D", "C"];
const RANK_LABELS = [
  "",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
export function makeDeck(): Card[] {
  const d: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      d.push({ rank, suit, label: RANK_LABELS[rank] + suit });
    }
  }
  return d;
}
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function drawCard(): Card {
  const suit = SUITS[Math.floor(Math.random() * 4)];
  const rank = 1 + Math.floor(Math.random() * 13);
  return { rank, suit, label: RANK_LABELS[rank] + suit };
}
export function isRed(c: Card) {
  return c.suit === "H" || c.suit === "D";
}
export function face52Value(c: Card): number {
  if (c.rank === 1) return 11;
  if (c.rank >= 11) return 10;
  return c.rank;
}
export function hiloPot(bet: number, streak: number): number {
  if (streak <= 0) return 0;
  let mult: number;
  if (streak < HILO_MULT.length) mult = HILO_MULT[streak];
  else {
    mult = HILO_MULT[HILO_MULT.length - 1];
    for (let s = HILO_MULT.length; s <= streak; s++) {
      if (s % 5 === 0) mult *= 2;
      else mult *= 1.25;
    }
  }
  mult = Math.min(mult, HILO_CAP_MULT);
  return Math.floor(bet * mult);
}
export type CasinoGameId =
  | "wheel"
  | "slots"
  | "drop"
  | "hilo"
  | "face52"
  | "flip"
  | "dice"
  | "lucky"
  | "doors"
  | "roulette"
  | "ladder"
  | "memory"
  | "scratch";
export const CASINO_GAMES: {
  id: CasinoGameId;
  name: string;
  stake: string;
  blurb: string;
  seal: string;
}[] = [
  {
    id: "wheel",
    name: "Wish Wheel",
    stake: "10 TC",
    blurb: "Spin the lamp wheel.",
    seal: "UELG:CASINO_WHEEL",
  },
  {
    id: "slots",
    name: "Seal Slots",
    stake: "5 TC",
    blurb: "Three reels. Soft lines.",
    seal: "UELG:CASINO_SLOTS",
  },
  {
    id: "drop",
    name: "Coin Drop",
    stake: "25 TC",
    blurb: "Catch gold, dodge red.",
    seal: "UELG:CASINO_DROP",
  },
  {
    id: "hilo",
    name: "High / Low",
    stake: "5-15 TC",
    blurb: "Climb. Ties lose. Cash out.",
    seal: "UELG:CASINO_HILO_01",
  },
  {
    id: "face52",
    name: "Face-down 52",
    stake: "100 TC",
    blurb: "Flip the deck. Cash 0.8x.",
    seal: "UELG:CASINO_52_01",
  },
  {
    id: "flip",
    name: "Coin Flip",
    stake: "10 TC",
    blurb: "Pays 1.9x. Almost fair.",
    seal: "UELG:CASINO_FLIP",
  },
  {
    id: "dice",
    name: "Dice Over/Under",
    stake: "10 TC",
    blurb: "2d6 over/under 7. Underpays.",
    seal: "UELG:CASINO_DICE",
  },
  {
    id: "lucky",
    name: "Lucky 1-10",
    stake: "5 TC",
    blurb: "Pick a number. Pays 8x.",
    seal: "UELG:CASINO_LUCKY",
  },
  {
    id: "doors",
    name: "Three Doors",
    stake: "10 TC",
    blurb: "Pick a door. Prize 2.2x.",
    seal: "UELG:CASINO_DOORS",
  },
  {
    id: "roulette",
    name: "Mini Roulette",
    stake: "10 TC",
    blurb: "R/B 1.9x . green 12x . 0 house.",
    seal: "UELG:CASINO_ROUL",
  },
  {
    id: "ladder",
    name: "Prize Ladder",
    stake: "8 TC",
    blurb: "Climb rungs. Soft EV.",
    seal: "UELG:CASINO_LADDER",
  },
  {
    id: "memory",
    name: "Memory Match",
    stake: "12 TC",
    blurb: "Match pairs. Underpay.",
    seal: "UELG:CASINO_MEM",
  },
  {
    id: "scratch",
    name: "Daily Scratch",
    stake: "15 TC",
    blurb: "Three tiles. EV under cost.",
    seal: "UELG:CASINO_SCRATCH",
  },
];
