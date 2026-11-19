/**
 * Every lamp-coin (TC) and casino-chip price lives here.
 * PayPal dollar amounts stay on the packs and tiers in components/constants.ts.
 * Tools are free to forge, keep, and run while toolUseCost is 0.
 */

export const COINS = {
  start: 60,
  hourly: {
    free: 5,
    basic: 8,
    pro: 12,
    ultimate: 18,
    lifetime: 24,
  },
  maxBankedHours: 72,
  /** TC granted when a paid tier is bought. Dollar prices are unchanged. */
  tierGrant: {
    basic: 200,
    pro: 700,
    ultimate: 1800,
    lifetime: 4000,
  },
  forgeCost: 0,
  marketCost: 0,
  toolUseCost: 0,
  /** 1 TC buys this many chips. Cashing out pays 1 TC per this many chips, rounded down. */
  chipsPerCoin: 2,
  chipBets: [10, 20, 50, 100] as const,
  dailyBonusCoins: 40,
  dailyBonusChips: 20,
  ownerBalance: 999_999_999,
  /** Old public claim still adds this once. The 999,999,999 top-up is sign-in only. */
  legacyOwnerGrant: 1000,
} as const;

export type ChipBet = (typeof COINS.chipBets)[number];

export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Math.trunc(value).toLocaleString("en-US");
}

export function chipsFromCoins(coins: number): number {
  return Math.floor(coins) * COINS.chipsPerCoin;
}

export function coinsFromChips(chips: number): { coins: number; chipsSpent: number } {
  const coins = Math.floor(Math.floor(chips) / COINS.chipsPerCoin);
  return { coins, chipsSpent: coins * COINS.chipsPerCoin };
}
