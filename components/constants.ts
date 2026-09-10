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
export const START = 50;
export const LOSS_CAP = 200;
export const ARCADE_CAP = 50;
export const DROP_COST = 25;
export const WISH_BET = 10;
export const MAX_H = 72;
export const PAYPAL = "lonnyyells@gmail.com";
export const OWNER_EMAIL = "therockstarplaylist@gmail.com";
export const OWNER_GRANT = 1000;
export const HOURLY: Record<string, number> = {
  free: 1,
  basic: 3,
  pro: 6,
  ultimate: 10,
  lifetime: 15,
};
export const TIERS = [
  { id: "free", l: "Free", c: 50, u: 0, cad: "start" },
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
export const FREE_TOOLS: {
  id: string;
  n: string;
  r: string;
  blurb: string;
  how: string[];
  body: string;
  demo: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  runLabel?: string;
}[] = [
  {
    id: "echo",
    n: "Echo Note",
    r: "free",
    blurb: "Type anything — the lamp repeats it back.",
    how: [
      "Tap Open on Echo Note",
      "Type a short note in the box",
      "Tap Try it to hear the lamp echo",
    ],
    body: "A demo whisper tool. It does not save notes or spend TC. It only shows that Open + Try it works.",
    demo: "The lamp echoes: \"hello from the free shelf.\"",
    inputLabel: "Your note",
    inputPlaceholder: "Say hi to the lamp…",
    runLabel: "Try it",
  },
  {
    id: "flip",
    n: "Coin Flip Tip",
    r: "free",
    blurb: "Get a playful tip about flipping coins (no real bet).",
    how: [
      "Tap Open",
      "Optional: type heads or tails",
      "Tap Try it for a tip — it never pays TC",
    ],
    body: "Show-off tip generator. Not a casino game. No payouts.",
    demo: "Tip: call it in the air. The lamp still keeps the house edge elsewhere.",
    inputLabel: "Call (optional)",
    inputPlaceholder: "heads or tails",
    runLabel: "Try it",
  },
  {
    id: "joke",
    n: "Lamp Joke",
    r: "free",
    blurb: "One soft genie joke per Try it.",
    how: ["Tap Open", "Tap Try it", "Read the joke — that is the whole tool"],
    body: "A silly one-liner shelf. Pure demo. No TC.",
    demo: "Why did the genie open a casino? To make wishes… and take a cut.",
    runLabel: "Tell me a joke",
  },
  {
    id: "sticker",
    n: "Seal Sticker",
    r: "free",
    blurb: "Slap a fake UELG sticker on your lamp UI.",
    how: ["Tap Open", "Tap Try it", "See the sticker message (cosmetic only)"],
    body: "Digital sticker. Zero power. Just proves the Open panel runs.",
    demo: "* UELG sticker affixed. It does nothing. Looking good though.",
    runLabel: "Affix sticker",
  },
  {
    id: "hourglass",
    n: "Hourglass Reminder",
    r: "free",
    blurb: "Pretend to set a reminder that an hour passed.",
    how: [
      "Tap Open",
      "Optional: type what to remember",
      "Tap Try it — demo only, no real timer",
    ],
    body: "Looks like a reminder tool. Does not schedule anything. Demo shelf.",
    demo: "Reminder set… somewhere. Probably. Check back in an hour (or don't).",
    inputLabel: "Remember what?",
    inputPlaceholder: "drink water / stretch / forge",
    runLabel: "Try it",
  },
  {
    id: "spark",
    n: "Sparkle Dust",
    r: "free",
    blurb: "Cosmetic sparkle. Zero stats.",
    how: ["Tap Open", "Tap Try it", "Enjoy the sparkle text"],
    body: "Purely decorative. Shows that Try it can fire instantly.",
    demo: "* sparkle * (purely decorative)",
    runLabel: "Sparkle",
  },
  {
    id: "compass",
    n: "Soft Compass",
    r: "free",
    blurb: "Points vaguely toward the Forge.",
    how: ["Tap Open", "Tap Try it", "Read the silly bearing"],
    body: "Not navigation. A demo compass that always leans lampward.",
    demo: "Bearing: toward the forge. Confidence: soft.",
    runLabel: "Take a bearing",
  },
  {
    id: "lullaby",
    n: "Coil Lullaby",
    r: "free",
    blurb: "A tiny text hum. No audio file.",
    how: ["Tap Open", "Tap Try it", "Read the hum — audio not included"],
    body: "Pretend sound tool. Text only. Demo shelf.",
    demo: "mmm… coil… hum… (demo audio not included)",
    runLabel: "Hum",
  },
];

export type Tool = { n: string; r: string; t: number; freeId?: string };
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
  if (S.day !== today()) {
    S.loss = 0;
    S.earn = 0;
    S.day = today();
  }
  return S;
}
export function applyOwnerGrant(S: State): { state: State; granted: boolean } {
  const email = (S.email || "").trim().toLowerCase();
  if (email !== OWNER_EMAIL.toLowerCase() || S.ownerGrant) {
    return { state: S, granted: false };
  }
  return {
    state: {
      ...S,
      email,
      coins: S.coins + OWNER_GRANT,
      ownerGrant: true,
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
