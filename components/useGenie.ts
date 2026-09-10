"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ARCADE_CAP,
  DROP_COST,
  FACE52_CASH_RATE,
  FACE52_CLEAR_BONUS,
  FACE52_COST,
  FACE52_START,
  HANG,
  HILO_CONSOLATION,
  HOURLY,
  LOSS_CAP,
  OWNER_EMAIL,
  OWNER_GRANT,
  PACKS,
  SY,
  TIERS,
  WHEEL,
  WISH_BET,
  applyDrip,
  applyOwnerGrant,
  defaultState,
  drawCard,
  face52Value,
  hiloPot,
  isRed,
  load,
  makeDeck,
  normalize,
  save,
  shuffle,
  type Card,
  type CasinoGameId,
  type DropBit,
  type Page,
  type State,
} from "./constants";
export function useGenie() {
  const [ready, setReady] = useState(false);
  const [S, setS] = useState<State>(defaultState);
  const [msg, setMsg] = useState("");
  const [payNote, setPayNote] = useState("");
  const [lastDrip, setLastDrip] = useState(0);
  const [need, setNeed] = useState("");
  const [tick, setTick] = useState(() => Date.now());
  const [wheelDeg, setWheelDeg] = useState(0);
  const [showSlots, setShowSlots] = useState(false);
  const [reels, setReels] = useState(["?", "?", "?"]);
  const [showDrop, setShowDrop] = useState(false);
  const [dropBits, setDropBits] = useState<DropBit[]>([]);
  const [arcadeMode, setArcadeMode] = useState<"none" | "tap" | "hang">("none");
  const [hangWord, setHangWord] = useState("");
  const [hangGuessed, setHangGuessed] = useState<string[]>([]);
  const [hangDone, setHangDone] = useState(false);
  const [hiloActive, setHiloActive] = useState(false);
  const [hiloBet, setHiloBet] = useState(10);
  const [hiloStreak, setHiloStreak] = useState(0);
  const [hiloCard, setHiloCard] = useState<Card | null>(null);
  const [faceActive, setFaceActive] = useState(false);
  const [facePoints, setFacePoints] = useState(0);
  const [faceDeck, setFaceDeck] = useState<Card[]>([]);
  const [faceFlipped, setFaceFlipped] = useState<boolean[]>([]);
  const [casinoOpen, setCasinoOpen] = useState<CasinoGameId | null>(null);
  const [ladderActive, setLadderActive] = useState(false);
  const [ladderRung, setLadderRung] = useState(0);
  const [ladderPot, setLadderPot] = useState(0);
  const [memActive, setMemActive] = useState(false);
  const [memTiles, setMemTiles] = useState<string[]>([]);
  const [memRevealed, setMemRevealed] = useState<number[]>([]);
  const [memMatched, setMemMatched] = useState<number[]>([]);
  const [scratchTiles, setScratchTiles] = useState<number[] | null>(null);
  const tapLast = useRef(0);
  const dropRef = useRef<{
    got: number;
    strikes: number;
    ended: boolean;
    finish?: () => void;
  }>({ got: 0, strikes: 0, ended: false });
  const stateRef = useRef(S);
  const hiloRef = useRef({ streak: 0, bet: 10, card: null as Card | null });
  const faceRef = useRef({ points: 0, flipped: [] as boolean[], deck: [] as Card[] });
  const ladderRef = useRef({ active: false, rung: 0, pot: 0 });
  const memRef = useRef({ tiles: [] as string[], revealed: [] as number[], matched: [] as number[], lock: false });
  const persist = useCallback((next: State) => {
    stateRef.current = next;
    setS(next);
    save(next);
  }, []);
  const canBet = (stake: number) => {
    const cur = stateRef.current;
    if (cur.loss >= LOSS_CAP) {
      setMsg("Loss cap.");
      return false;
    }
    if (cur.coins < stake) {
      setMsg("Need " + stake + " TC.");
      return false;
    }
    return true;
  };
  const settle = (stake: number, payout: number, note: string) => {
    const cur = stateRef.current;
    const nextCoins = cur.coins - stake + payout;
    const netLoss = Math.max(0, stake - payout);
    persist({ ...cur, coins: nextCoins, loss: cur.loss + netLoss });
    setMsg(note);
  };
  useEffect(() => {
    let state = normalize(load());
    const dripped = applyDrip(state);
    state = dripped.state;
    setLastDrip(dripped.gained);
    let note = "";
    const q = new URLSearchParams(location.search);
    if (q.get("page") === "shop") state = { ...state, page: "shop" };
    if (q.get("page") === "tools") state = { ...state, page: "tools" };
    if (q.get("page") === "profile") state = { ...state, page: "profile" };
    if (q.get("page") === "casino") state = { ...state, page: "casino" };
    const emailQ = (q.get("email") || q.get("claim") || "").trim();
    const grantQ = q.get("grant");
    if (emailQ) state = { ...state, email: emailQ.toLowerCase() };
    if (grantQ === String(OWNER_GRANT) && emailQ) {
      state = { ...state, email: emailQ.toLowerCase() };
    }
    const paid = q.get("paid");
    if (paid) {
      state = { ...state, page: "shop" };
      const pending = sessionStorage.getItem("2oolz-pending");
      if (pending === paid) {
        sessionStorage.removeItem("2oolz-pending");
        const pack = PACKS.find((p) => p.id === paid);
        const tier = TIERS.find((t) => t.id === paid);
        if (pack) {
          state = { ...state, coins: state.coins + pack.c };
          note = "Paid. +" + pack.c + " TC . " + pack.l + ".";
        } else if (tier && tier.id !== "free") {
          state = { ...state, coins: state.coins + tier.c, tier: tier.id };
          note =
            "Paid. " +
            tier.l +
            " lamp . +" +
            tier.c +
            " TC . +" +
            (HOURLY[tier.id] || 1) +
            "/h.";
        }
      }
    }
    const granted = applyOwnerGrant(state);
    state = granted.state;
    if (granted.granted) note = note || "Owner lamp: +1000 TC.";
    if (paid || emailQ || grantQ || q.get("page")) {
      history.replaceState({}, "", location.pathname);
    }
    save(state);
    stateRef.current = state;
    setS(state);
    setPayNote(note);
    if (granted.granted) setMsg(note);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setTick(Date.now());
      const dripped = applyDrip(stateRef.current);
      if (dripped.gained) persist(dripped.state);
    }, 60000);
    const carouselId = setInterval(() => setTick(Date.now()), 1000);
    return () => {
      clearInterval(id);
      clearInterval(carouselId);
    };
  }, [ready, persist]);
  const go = (p: Page) => {
    persist({ ...stateRef.current, page: p });
    setMsg("");
    setArcadeMode("none");
    setShowSlots(false);
    setShowDrop(false);
    setCasinoOpen(null);
  };
  const spend = (n: number): boolean => {
    const cur = stateRef.current;
    if (cur.coins < n) return false;
    persist({ ...cur, coins: cur.coins - n });
    return true;
  };
  const claimLamp = (rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();
    if (!email) {
      setMsg("Need email.");
      return;
    }
    let next: State = { ...stateRef.current, email };
    const granted = applyOwnerGrant(next);
    next = granted.state;
    persist(next);
    if (granted.granted) {
      const note = "Owner lamp: +1000 TC.";
      setPayNote(note);
      setMsg(note);
    } else if (email === OWNER_EMAIL.toLowerCase()) {
      setMsg("Already claimed.");
    } else {
      setMsg("Email saved.");
    }
  };
  const deleteTool = (index: number) => {
    const cur = stateRef.current;
    if (index < 0 || index >= cur.tools.length) return;
    persist({ ...cur, tools: cur.tools.filter((_, i) => i !== index) });
    setMsg("Tool removed.");
  };
  const addFreeTool = (freeId: string, name: string) => {
    const cur = stateRef.current;
    if (cur.tools.some((t) => t.freeId === freeId)) {
      setMsg("Already in your library.");
      return;
    }
    persist({
      ...cur,
      tools: [{ n: name, r: "free", t: Date.now(), freeId }, ...cur.tools],
    });
    setMsg("Added to library.");
  };
  const onForge = () => {
    const n = need.trim();
    if (!n) {
      setMsg("Type a tool.");
      return;
    }
    if (!spend(28)) {
      setMsg("Need 28 TC.");
      return;
    }
    const cur = stateRef.current;
    persist({
      ...cur,
      tools: [{ n, r: "rare", t: Date.now() }, ...cur.tools],
    });
    setMsg("Forged.");
  };
  const onMarketBuy = (name: string) => {
    if (!spend(24)) {
      setMsg("Need 24 TC.");
      return;
    }
    const cur = stateRef.current;
    persist({
      ...cur,
      tools: [{ n: name, r: "shelf", t: Date.now() }, ...cur.tools],
    });
    setMsg("Kept.");
  };
  const play = (g: "wheel" | "slots" | "drop") => {
    const cur = stateRef.current;
    const wish = cur.wishes > 0;
    if (!wish && cur.loss >= LOSS_CAP) {
      setMsg("Loss cap.");
      return;
    }
    if (g === "wheel") {
      if (!wish && !spend(10)) {
        setMsg("Need 10 TC.");
        return;
      }
      let next = { ...stateRef.current };
      if (wish) next = { ...next, wishes: next.wishes - 1 };
      const i = Math.floor(Math.random() * WHEEL.length);
      setWheelDeg((d) => d + 1080 + i * 45);
      const win = WISH_BET * WHEEL[i];
      if (!wish && win === 0) next = { ...next, loss: next.loss + 10 };
      next = { ...next, coins: next.coins + win };
      persist(next);
      setMsg(
        (wish ? "Wish. " : "") +
          (win ? "+" + win + " TC" : "No payout.") +
          (next.wishes ? " . " + next.wishes + " wishes left." : "")
      );
      return;
    }
    if (g === "slots") {
      setShowSlots(true);
      if (!wish && !spend(5)) {
        setMsg("Need 5 TC.");
        return;
      }
      let next = { ...stateRef.current };
      if (wish) next = { ...next, wishes: next.wishes - 1 };
      const a = SY[Math.floor(Math.random() * 6)];
      const b = SY[Math.floor(Math.random() * 6)];
      const c = SY[Math.floor(Math.random() * 6)];
      setReels([a, b, c]);
      let win = 0;
      if (a === b && b === c) win = a === "*" ? 40 : 20;
      else if (a === b || b === c || a === c) win = 3;
      if (!wish && win === 0) next = { ...next, loss: next.loss + 5 };
      next = { ...next, coins: next.coins + win };
      persist(next);
      setMsg((wish ? "Wish. " : "") + (win ? "+" + win + " TC" : "No line."));
      return;
    }
    if (g === "drop") {
      setShowDrop(true);
      if (!spend(DROP_COST)) {
        setMsg("Need 25 TC.");
        return;
      }
      dropRef.current = { got: 0, strikes: 0, ended: false };
      const bits: DropBit[] = [];
      for (let i = 0; i < 18; i++) {
        bits.push({
          id: i,
          bad: Math.random() < 0.18,
          left: 8 + Math.random() * 80,
          delay: Math.random() * 1.4,
        });
      }
      setDropBits(bits);
      const finish = () => {
        if (dropRef.current.ended) return;
        dropRef.current.ended = true;
        const got = dropRef.current.got;
        const pay = Math.min(40, Math.floor(got * 0.5));
        const cur2 = stateRef.current;
        const lossAdd = pay < DROP_COST ? DROP_COST - pay : 0;
        persist({
          ...cur2,
          coins: cur2.coins + pay,
          loss: cur2.loss + lossAdd,
        });
        setMsg("Caught " + got + " . paid " + pay + " TC");
      };
      dropRef.current.finish = finish;
      setTimeout(() => {
        if (!dropRef.current.ended) finish();
      }, 2800);
    }
  };
  const onDropClick = (bit: DropBit) => {
    if (dropRef.current.ended || bit.removed) return;
    if (bit.bad) {
      dropRef.current.strikes += 1;
      if (dropRef.current.strikes >= 2) dropRef.current.finish?.();
    } else {
      dropRef.current.got += 1;
      setDropBits((prev) =>
        prev.map((b) => (b.id === bit.id ? { ...b, removed: true } : b))
      );
    }
  };
  const hiloStart = (bet: number) => {
    if (!canBet(bet)) return;
    if (hiloActive) {
      setMsg("Finish climb first.");
      return;
    }
    if (!spend(bet)) return;
    const card = drawCard();
    hiloRef.current = { streak: 0, bet, card };
    setHiloBet(bet);
    setHiloStreak(0);
    setHiloCard(card);
    setHiloActive(true);
    setMsg("Climb started . " + bet + " TC.");
  };
  const hiloPick = (dir: "higher" | "lower") => {
    if (!hiloActive || !hiloRef.current.card) return;
    const prev = hiloRef.current.card;
    let next = drawCard();
    let guard = 0;
    while (next.label === prev.label && guard++ < 8) next = drawCard();
    const tie = next.rank === prev.rank;
    const win =
      !tie &&
      ((dir === "higher" && next.rank > prev.rank) ||
        (dir === "lower" && next.rank < prev.rank));
    setHiloCard(next);
    hiloRef.current.card = next;
    if (win) {
      const streak = hiloRef.current.streak + 1;
      hiloRef.current.streak = streak;
      setHiloStreak(streak);
      setMsg("Hit! Streak " + streak + " . pot " + hiloPot(hiloRef.current.bet, streak) + " TC.");
    } else {
      const streak = hiloRef.current.streak;
      const bet = hiloRef.current.bet;
      setHiloActive(false);
      hiloRef.current = { streak: 0, bet: 10, card: null };
      setHiloCard(null);
      setHiloStreak(0);
      if (streak >= 3) {
        const cur = stateRef.current;
        persist({
          ...cur,
          coins: cur.coins + HILO_CONSOLATION,
          loss: cur.loss + Math.max(0, bet - HILO_CONSOLATION),
        });
        setMsg((tie ? "Tie - house. " : "Wipe. ") + "Consolation +" + HILO_CONSOLATION + " TC.");
      } else {
        const cur = stateRef.current;
        persist({ ...cur, loss: cur.loss + bet });
        setMsg((tie ? "Tie - house. " : "Wrong way. ") + "Lost " + bet + " TC.");
      }
    }
  };
  const hiloCashOut = () => {
    if (!hiloActive || hiloRef.current.streak <= 0) {
      setMsg("Win once first.");
      return;
    }
    const pot = hiloPot(hiloRef.current.bet, hiloRef.current.streak);
    const bet = hiloRef.current.bet;
    const cur = stateRef.current;
    persist({
      ...cur,
      coins: cur.coins + pot,
      loss: cur.loss + Math.max(0, bet - pot),
    });
    setMsg("Cashed out +" + pot + " TC.");
    setHiloActive(false);
    hiloRef.current = { streak: 0, bet: 10, card: null };
    setHiloCard(null);
    setHiloStreak(0);
  };
  const faceStart = () => {
    if (!canBet(FACE52_COST)) return;
    if (faceActive) {
      setMsg("Finish deck first.");
      return;
    }
    if (!spend(FACE52_COST)) return;
    const deck = shuffle(makeDeck());
    const flipped = deck.map(() => false);
    faceRef.current = { points: FACE52_START, flipped, deck };
    setFaceDeck(deck);
    setFaceFlipped(flipped);
    setFacePoints(FACE52_START);
    setFaceActive(true);
    setMsg("Deck dealt. Black +, red -. A=11 . J/Q/K=10. Cash 0.8x.");
  };
  const faceFlip = (i: number) => {
    if (!faceActive || faceRef.current.flipped[i] || faceRef.current.points <= 0) return;
    const card = faceRef.current.deck[i];
    const val = face52Value(card);
    const points = faceRef.current.points + (isRed(card) ? -val : val);
    const flipped = faceRef.current.flipped.map((f, idx) => (idx === i ? true : f));
    faceRef.current = { ...faceRef.current, points, flipped };
    setFacePoints(points);
    setFaceFlipped(flipped);
    const remaining = flipped.filter((f) => !f).length;
    if (points <= 0) {
      const cur = stateRef.current;
      persist({ ...cur, loss: cur.loss + FACE52_COST });
      setFaceActive(false);
      setMsg("Bust. Entry forfeited.");
      faceRef.current = { points: 0, flipped: [], deck: [] };
      return;
    }
    if (remaining === 0) {
      const cash = Math.floor(points * FACE52_CASH_RATE) + FACE52_CLEAR_BONUS;
      const cur = stateRef.current;
      persist({ ...cur, coins: cur.coins + cash });
      setFaceActive(false);
      setMsg("Cleared! +" + cash + " TC.");
      faceRef.current = { points: 0, flipped: [], deck: [] };
      return;
    }
    setMsg((isRed(card) ? "Red -" : "Black +") + val + " . " + points + " pts.");
  };
  const faceCashOut = () => {
    if (!faceActive || faceRef.current.points <= 0) return;
    const cash = Math.floor(faceRef.current.points * FACE52_CASH_RATE);
    const cur = stateRef.current;
    persist({
      ...cur,
      coins: cur.coins + cash,
      loss: cur.loss + Math.max(0, FACE52_COST - cash),
    });
    setMsg("Cashed out +" + cash + " TC (0.8x).");
    setFaceActive(false);
    faceRef.current = { points: 0, flipped: [], deck: [] };
    setFacePoints(0);
  };
  const flip = (side: "H" | "T") => {
    if (!canBet(10)) return;
    const result: "H" | "T" = Math.random() < 0.5 ? "H" : "T";
    const win = side === result;
    const pay = win ? Math.floor(10 * 1.9) : 0;
    settle(10, pay, win ? "Flip hit . +" + pay + " TC (" + result + ")" : "Flip miss . " + result);
  };
  const dice = (pick: "over" | "under" | "seven") => {
    if (!canBet(10)) return;
    const a = 1 + Math.floor(Math.random() * 6);
    const b = 1 + Math.floor(Math.random() * 6);
    const sum = a + b;
    let pay = 0;
    if (pick === "seven" && sum === 7) pay = 40;
    else if (pick === "over" && sum > 7) pay = 18;
    else if (pick === "under" && sum < 7) pay = 18;
    settle(10, pay, "Dice " + a + "+" + b + "=" + sum + (pay ? " . +" + pay + " TC" : " . no hit"));
  };
  const lucky = (n: number) => {
    if (!canBet(5)) return;
    const roll = 1 + Math.floor(Math.random() * 10);
    const pay = n === roll ? 40 : 0;
    settle(5, pay, pay ? "Lucky " + roll + "! +" + pay + " TC" : "Rolled " + roll + ". Miss.");
  };
  const doors = (door: number) => {
    if (!canBet(10)) return;
    const prize = Math.floor(Math.random() * 3);
    const pay = door === prize ? 22 : 0;
    settle(10, pay, pay ? "Door " + (door + 1) + " pays +" + pay + " TC" : "Empty door. Prize was " + (prize + 1));
  };
  const roulette = (pick: "R" | "B" | "G") => {
    if (!canBet(10)) return;
    const n = Math.floor(Math.random() * 13);
    const color: "R" | "B" | "G" = n === 0 ? "G" : n <= 6 ? "R" : "B";
    let pay = 0;
    if (pick === "G" && color === "G") pay = 120;
    else if (pick !== "G" && pick === color) pay = 19;
    settle(10, pay, "Ball " + n + " " + color + (pay ? " . +" + pay + " TC" : " . miss"));
  };
  const ladderStep = () => {
    if (!ladderRef.current.active) {
      if (!canBet(8)) return;
      if (!spend(8)) return;
      ladderRef.current = { active: true, rung: 0, pot: 0 };
      setLadderActive(true);
      setLadderRung(0);
      setLadderPot(0);
      setMsg("Ladder started. Climb or cash later.");
      return;
    }
    const pots = [10, 16, 24, 34, 45];
    if (Math.random() < 0.55) {
      const cur = stateRef.current;
      persist({ ...cur, loss: cur.loss + 8 });
      setMsg("Fell off rung " + (ladderRef.current.rung + 1) + ".");
      ladderRef.current = { active: false, rung: 0, pot: 0 };
      setLadderActive(false);
      setLadderRung(0);
      setLadderPot(0);
      return;
    }
    const rung = ladderRef.current.rung + 1;
    const pot = pots[Math.min(rung - 1, pots.length - 1)];
    ladderRef.current = { active: true, rung, pot };
    setLadderRung(rung);
    setLadderPot(pot);
    setMsg("Rung " + rung + " . pot " + pot + " TC.");
  };
  const ladderCash = () => {
    if (!ladderRef.current.active || ladderRef.current.rung <= 0) return;
    const pot = ladderRef.current.pot;
    const cur = stateRef.current;
    persist({
      ...cur,
      coins: cur.coins + pot,
      loss: cur.loss + Math.max(0, 8 - pot),
    });
    setMsg("Ladder cash +" + pot + " TC.");
    ladderRef.current = { active: false, rung: 0, pot: 0 };
    setLadderActive(false);
    setLadderRung(0);
    setLadderPot(0);
  };
  const memoryStart = () => {
    if (memActive) return;
    if (!canBet(12)) return;
    if (!spend(12)) return;
    const syms = ["A", "A", "L", "L", "C", "C", "S", "S"];
    const tiles = shuffle(syms);
    memRef.current = { tiles, revealed: [], matched: [], lock: false };
    setMemTiles(tiles);
    setMemRevealed([]);
    setMemMatched([]);
    setMemActive(true);
    setMsg("Memory dealt. Match for +3 TC each (underpay).");
  };
  const memoryFlip = (i: number) => {
    if (!memActive || memRef.current.lock) return;
    if (memRef.current.matched.includes(i) || memRef.current.revealed.includes(i)) return;
    const revealed = [...memRef.current.revealed, i];
    memRef.current.revealed = revealed;
    setMemRevealed(revealed);
    if (revealed.length < 2) return;
    memRef.current.lock = true;
    const [a, b] = revealed;
    if (memRef.current.tiles[a] === memRef.current.tiles[b]) {
      const matched = [...memRef.current.matched, a, b];
      memRef.current.matched = matched;
      memRef.current.revealed = [];
      setMemMatched(matched);
      setMemRevealed([]);
      memRef.current.lock = false;
      const cur = stateRef.current;
      persist({ ...cur, coins: cur.coins + 3 });
      setMsg("Match! +3 TC.");
      if (matched.length >= memRef.current.tiles.length) {
        setMsg("Board clear. Max +12 TC vs 12 stake - soft EV.");
        setMemActive(false);
      }
    } else {
      setTimeout(() => {
        memRef.current.revealed = [];
        setMemRevealed([]);
        memRef.current.lock = false;
        setMsg("No match.");
      }, 500);
    }
  };
  const scratch = () => {
    if (!canBet(15)) return;
    const pool = [0, 0, 0, 5, 5, 10, 25];
    const tiles = [0, 1, 2].map(() => pool[Math.floor(Math.random() * pool.length)]);
    const pay = tiles.reduce((a, b) => a + b, 0);
    setScratchTiles(tiles);
    settle(15, pay, "Scratch " + tiles.join(" . ") + " = +" + pay + " TC");
  };
  const startHang = () => {
    setArcadeMode("hang");
    setHangWord(HANG[Math.floor(Math.random() * HANG.length)]);
    setHangGuessed([]);
    setHangDone(false);
    setMsg("");
  };
  const startTap = () => {
    setArcadeMode("tap");
    tapLast.current = 0;
    setMsg("");
  };
  const onTapHit = () => {
    const now = Date.now();
    if (now - tapLast.current < 280) {
      setMsg("Wait.");
      return;
    }
    tapLast.current = now;
    const cur = stateRef.current;
    if (cur.earn >= ARCADE_CAP) {
      setMsg("Arcade cap.");
      return;
    }
    persist({ ...cur, earn: cur.earn + 1, coins: cur.coins + 1 });
    setMsg("+1 TC");
  };
  const onHangGuess = (l: string) => {
    if (hangDone || hangGuessed.includes(l)) return;
    const guessed = [...hangGuessed, l];
    setHangGuessed(guessed);
    const miss = guessed.filter((x) => hangWord.indexOf(x) < 0).length;
    const ok = hangWord.split("").every((x) => guessed.indexOf(x) >= 0);
    if (ok || miss >= 6) {
      setHangDone(true);
      if (ok) {
        const cur = stateRef.current;
        if (cur.earn + 8 <= ARCADE_CAP) {
          persist({ ...cur, earn: cur.earn + 8, coins: cur.coins + 8 });
          setMsg("Lit. +8 TC. The word was " + hangWord + ".");
        } else setMsg("Lit, but the daily arcade cap is full.");
      } else setMsg("Out. It was " + hangWord + ".");
    }
  };
  const hourly = HOURLY[S.tier] || 1;
  const free = S.wishes > 0;
  const hangMiss = hangGuessed.filter((l) => hangWord.indexOf(l) < 0).length;
  const hangShown = hangWord
    .split("")
    .map((l) => (hangGuessed.indexOf(l) >= 0 ? l : "_"))
    .join(" ");
  return {
    ready,
    S,
    msg,
    setMsg,
    payNote,
    lastDrip,
    need,
    setNeed,
    tick,
    wheelDeg,
    showSlots,
    reels,
    showDrop,
    dropBits,
    arcadeMode,
    hangWord,
    hangGuessed,
    hourly,
    free,
    hangMiss,
    hangShown,
    go,
    onForge,
    onMarketBuy,
    play,
    onDropClick,
    startHang,
    startTap,
    onTapHit,
    onHangGuess,
    claimLamp,
    deleteTool,
    addFreeTool,
    hilo: {
      active: hiloActive,
      bet: hiloBet,
      streak: hiloStreak,
      pot: hiloPot(hiloBet, hiloStreak),
      card: hiloCard,
      start: hiloStart,
      pick: hiloPick,
      cashOut: hiloCashOut,
    },
    face52: {
      active: faceActive,
      points: facePoints,
      flipped: faceFlipped,
      deck: faceDeck,
      start: faceStart,
      flip: faceFlip,
      cashOut: faceCashOut,
    },
    extra: {
      open: casinoOpen,
      setOpen: setCasinoOpen,
      flip,
      dice,
      lucky,
      doors,
      roulette,
      ladderStep,
      ladderCash,
      ladder: { active: ladderActive, rung: ladderRung, pot: ladderPot },
      memoryFlip,
      memory: {
        active: memActive,
        tiles: memTiles,
        revealed: memRevealed,
        matched: memMatched,
        start: memoryStart,
      },
      scratch,
      scratchTiles,
    },
  };
}
