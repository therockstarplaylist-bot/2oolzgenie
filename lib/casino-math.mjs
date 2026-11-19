/** Chip casino math. Payouts include the stake (a 2x win returns 2 chips per chip bet). */

export function randBelow(n) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % n;
}

export function pickWeighted(weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = randBelow(total);
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll < 0) return i;
  }
  return weights.length - 1;
}

export const SLOT_TABLE = [
  { mult: 12, weight: 10, label: "777" },
  { mult: 6, weight: 30, label: "stars" },
  { mult: 3, weight: 80, label: "gems" },
  { mult: 2, weight: 140, label: "coins" },
  { mult: 1, weight: 115, label: "bars" },
  { mult: 0, weight: 625, label: "miss" },
];

export function spinSlots() {
  const i = pickWeighted(SLOT_TABLE.map((row) => row.weight));
  return SLOT_TABLE[i];
}

/** Twelve equal wedges. Average multiplier is 11.2 / 12 = 93.3% before integer rounding. */
export const WHEEL_WEDGES = [0, 0, 0, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 2, 2.2];

export function spinWheel() {
  const index = randBelow(WHEEL_WEDGES.length);
  return { index, mult: WHEEL_WEDGES[index] };
}

export const PLINKO_MULT = [7, 2.4, 1.1, 0.8, 0.5, 0.8, 1.1, 2.4, 7];

export function dropPlinko() {
  let bin = 0;
  const path = [];
  for (let row = 0; row < 8; row++) {
    const right = randBelow(2) === 1;
    path.push(right);
    if (right) bin += 1;
  }
  return { bin, mult: PLINKO_MULT[bin], path };
}

export function flipCoin(pick) {
  const side = randBelow(2) === 0 ? "heads" : "tails";
  const win = side === pick;
  return { side, win, mult: win ? 1.9 : 0 };
}

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function drawHiLoCards() {
  const a = randBelow(13);
  let b = randBelow(13);
  return {
    first: RANKS[a],
    second: RANKS[b],
    firstRank: a,
    secondRank: b,
  };
}

export function hiLoResult(firstRank, secondRank, pick) {
  if (firstRank === secondRank) return { outcome: "tie", mult: 0 };
  const higher = secondRank > firstRank;
  const win = (pick === "higher" && higher) || (pick === "lower" && !higher);
  return { outcome: win ? "win" : "lose", mult: win ? 2 : 0 };
}

export function scratchCard() {
  const symbols = ["lamp", "star", "gem", "coin", "moon"];
  const tiles = [0, 1, 2].map(() => symbols[randBelow(symbols.length)]);
  const counts = {};
  for (const tile of tiles) counts[tile] = (counts[tile] || 0) + 1;
  const best = Math.max(...Object.values(counts));
  const mult = best === 3 ? 8 : best === 2 ? 1.3 : 0;
  return { tiles, mult };
}

export function europeanPocket() {
  return randBelow(37);
}

export function rouletteColor(n) {
  if (n === 0) return "green";
  const reds = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  return reds.has(n) ? "red" : "black";
}

/** Red/black profit is 0.9x (total return 1.9). Straight pays 34 to 1 (total 35). */
export function roulettePayout(pocket, betKind, number) {
  if (betKind === "red" || betKind === "black") {
    return rouletteColor(pocket) === betKind ? 1.9 : 0;
  }
  if (betKind === "straight") return pocket === number ? 34.5 : 0;
  return 0;
}

const MINES = 5;
const CELLS = 25;

export function mineChance(safeSoFar) {
  const safeLeft = CELLS - MINES - safeSoFar;
  const cellsLeft = CELLS - safeSoFar;
  return safeLeft / cellsLeft;
}

/** Cash-out multiplier after `safe` gems. Any stop has about 94% return. */
export function mineCashMult(safe) {
  if (safe <= 0) return 1;
  let survive = 1;
  for (let i = 0; i < safe; i++) survive *= mineChance(i);
  return Math.round((0.94 / survive) * 100) / 100;
}

export function payoutChips(bet, mult) {
  return Math.round(bet * mult);
}

function freshDeck() {
  const deck = [];
  for (let i = 0; i < 52; i++) deck.push(i % 13);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randBelow(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function cardValue(rank) {
  if (rank === 0) return 11;
  if (rank >= 10) return 10;
  return rank + 1;
}

export function handTotal(cards) {
  let total = 0;
  let aces = 0;
  for (const rank of cards) {
    total += cardValue(rank);
    if (rank === 0) aces += 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

/**
 * Simplified blackjack used by the table and the RTP sim.
 * Hit below 17, stand on 17. Dealer stands on 17. Ties push.
 * A two-card 21 pays 6 to 5 (total 2.2x) instead of 3 to 2, which
 * pulls a careful player into the mid-90s.
 */
export function playBlackjackStand17() {
  const deck = freshDeck();
  let di = 0;
  const take = () => deck[di++];
  const player = [take(), take()];
  const dealer = [take(), take()];
  while (handTotal(player) < 17) player.push(take());
  if (handTotal(player) > 21) return { mult: 0, player, dealer };
  while (handTotal(dealer) < 17) dealer.push(take());
  const pt = handTotal(player);
  const dt = handTotal(dealer);
  const playerBj = player.length === 2 && pt === 21;
  const dealerBj = dealer.length === 2 && dt === 21;
  if (playerBj && dealerBj) return { mult: 1, player, dealer };
  if (playerBj) return { mult: 2.2, player, dealer };
  if (dealerBj || dt > 21) return { mult: dt > 21 ? 2 : 0, player, dealer };
  if (pt > dt) return { mult: 2, player, dealer };
  if (pt < dt) return { mult: 0, player, dealer };
  return { mult: 1, player, dealer };
}

export function expectedLabel(mult) {
  return `${Math.round(mult * 1000) / 10}% back`;
}

function takeFrom(state) {
  const rank = state.deck[state.di];
  state.di += 1;
  return rank;
}

export function beginBlackjack() {
  const deck = freshDeck();
  const state = { deck, di: 0, player: [], dealer: [], done: false, mult: 0 };
  state.player = [takeFrom(state), takeFrom(state)];
  state.dealer = [takeFrom(state), takeFrom(state)];
  if (handTotal(state.player) === 21) return finishBlackjack(state);
  return state;
}

export function hitBlackjack(state) {
  if (state.done) return state;
  state.player = [...state.player, takeFrom(state)];
  if (handTotal(state.player) > 21) return finishBlackjack(state);
  return { ...state };
}

export function standBlackjack(state) {
  if (state.done) return state;
  while (handTotal(state.dealer) < 17) state.dealer = [...state.dealer, takeFrom(state)];
  return finishBlackjack(state);
}

function finishBlackjack(state) {
  const player = state.player;
  const dealer = state.dealer;
  const pt = handTotal(player);
  const dt = handTotal(dealer);
  let mult = 0;
  if (pt > 21) mult = 0;
  else if (player.length === 2 && pt === 21 && dealer.length === 2 && dt === 21) mult = 1;
  else if (player.length === 2 && pt === 21) mult = 2.2;
  else if (dealer.length === 2 && dt === 21) mult = 0;
  else if (dt > 21 || pt > dt) mult = 2;
  else if (pt < dt) mult = 0;
  else mult = 1;
  return { ...state, done: true, mult };
}

export const RANK_NAMES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
