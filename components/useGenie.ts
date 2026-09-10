"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ARCADE_CAP,
  DROP_COST,
  HANG,
  HOURLY,
  LOSS_CAP,
  PACKS,
  SY,
  TIERS,
  WHEEL,
  WISH_BET,
  applyDrip,
  defaultState,
  load,
  normalize,
  save,
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
  const tapLast = useRef(0);
  const dropRef = useRef<{
    got: number;
    strikes: number;
    ended: boolean;
    finish?: () => void;
  }>({ got: 0, strikes: 0, ended: false });
  const stateRef = useRef(S);

  const persist = useCallback((next: State) => {
    stateRef.current = next;
    setS(next);
    save(next);
  }, []);

  useEffect(() => {
    let state = normalize(load());
    const dripped = applyDrip(state);
    state = dripped.state;
    setLastDrip(dripped.gained);

    let note = "";
    const q = new URLSearchParams(location.search);
    if (q.get("page") === "shop") state = { ...state, page: "shop" };
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
          note = "Paid. +" + pack.c + " TC · " + pack.l + ".";
        } else if (tier && tier.id !== "free") {
          state = { ...state, coins: state.coins + tier.c, tier: tier.id };
          note =
            "Paid. " +
            tier.l +
            " lamp · +" +
            tier.c +
            " TC · +" +
            (HOURLY[tier.id] || 1) +
            "/h.";
        }
      }
      history.replaceState({}, "", location.pathname);
    }

    save(state);
    stateRef.current = state;
    setS(state);
    setPayNote(note);
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
  };

  const spend = (n: number): boolean => {
    const cur = stateRef.current;
    if (cur.coins < n) return false;
    persist({ ...cur, coins: cur.coins - n });
    return true;
  };

  const onForge = () => {
    const n = need.trim();
    if (!n) {
      setMsg("Type a tool first.");
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
    setMsg("Forged. Seal kept.");
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
    setMsg("Copied into your library.");
  };

  const play = (g: "wheel" | "slots" | "drop") => {
    const cur = stateRef.current;
    const wish = cur.wishes > 0;
    if (!wish && cur.loss >= LOSS_CAP) {
      setMsg("Daily loss cap.");
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
          (next.wishes ? " · " + next.wishes + " wishes left." : "")
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
        setMsg("Caught " + got + " · paid " + pay + " TC");
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
      setMsg("Wait the pulse.");
      return;
    }
    tapLast.current = now;
    const cur = stateRef.current;
    if (cur.earn >= ARCADE_CAP) {
      setMsg("Daily arcade cap.");
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
        } else {
          setMsg("Lit, but the daily arcade cap is full.");
        }
      } else {
        setMsg("Out. It was " + hangWord + ".");
      }
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
  };
}
