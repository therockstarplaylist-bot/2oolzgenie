export const PAGES = ["forge", "market", "casino", "arcade", "shop", "profile"] as const;
export type Page = (typeof PAGES)[number];

export const KEY = "2oolz-v2";
export const START = 50;
export const LOSS_CAP = 200;
export const ARCADE_CAP = 50;
export const DROP_COST = 25;
export const WISH_BET = 10;
export const MAX_H = 72;
export const PAYPAL = "lonnyyells@gmail.com";

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

export type Tool = { n: string; r: string; t: number };

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
  if (S.day !== today()) {
    S.loss = 0;
    S.earn = 0;
    S.day = today();
  }
  return S;
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
    item_name: "2oolz Genie · " + label,
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
