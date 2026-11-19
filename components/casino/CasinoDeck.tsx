"use client";

import { useState } from "react";
import { COINS, coinsFromChips, formatCount } from "@/lib/coins";
import {
  PLINKO_MULT,
  RANK_NAMES,
  SLOT_TABLE,
  WHEEL_WEDGES,
  beginBlackjack,
  dropPlinko,
  drawHiLoCards,
  europeanPocket,
  flipCoin,
  handTotal,
  hiLoResult,
  hitBlackjack,
  mineCashMult,
  payoutChips,
  rouletteColor,
  roulettePayout,
  scratchCard,
  spinSlots,
  spinWheel,
  standBlackjack,
} from "@/lib/casino-math.mjs";
import { today, type State } from "../constants";

type Patch = (recipe: (current: State) => Partial<State>) => void;
type GameId =
  | "slots"
  | "wheel"
  | "blackjack"
  | "plinko"
  | "flip"
  | "hilo"
  | "scratch"
  | "mines"
  | "roulette";

const GAMES: { id: GameId; name: string; blurb: string; odds: string }[] = [
  { id: "slots", name: "Slots", blurb: "Three reels, one payline.", odds: "About 93% back. 777 pays 12x, stars 6x, gems 3x, coins 2x, bars return the bet." },
  { id: "wheel", name: "Wish Wheel", blurb: "Twelve equal slices.", odds: "Each slice is equally likely. Average pay is about 93%." },
  { id: "blackjack", name: "Blackjack", blurb: "Hit or stand against the dealer.", odds: "Dealer stands on 17. Ties push. A two-card 21 pays 6 to 5. Hitting until 17 returns about 93%." },
  { id: "plinko", name: "Plinko", blurb: "A ball drops through eight rows.", odds: "Edge bins pay more and hit less often. About 93% back." },
  { id: "flip", name: "Coin Flip", blurb: "Heads or tails.", odds: "A win pays 1.9x. That is 95% back." },
  { id: "hilo", name: "Hi-Lo", blurb: "Will the next card be higher?", odds: "Even money. Ties lose. About 92% back if you always pick higher." },
  { id: "scratch", name: "Scratch card", blurb: "Three symbols.", odds: "Three of a kind pays 8x. A pair pays 1.3x. About 94% back." },
  { id: "mines", name: "Mines", blurb: "Pick gems. Avoid 5 mines.", odds: "Cash out any time. The multiplier is set so stopping after any number of gems returns about 94%." },
  { id: "roulette", name: "Roulette", blurb: "European wheel, single zero.", odds: "Red or black pays 1.9x (about 92%). One number pays 34.5x (about 93%)." },
];

export function CasinoDeck({
  S,
  patch,
  setMsg,
  msg,
}: {
  S: State;
  patch: Patch;
  setMsg: (message: string) => void;
  msg: string;
}) {
  const [bet, setBet] = useState<number>(10);
  const [open, setOpen] = useState<GameId | null>(null);
  const [info, setInfo] = useState<GameId | null>(null);
  const [pending, setPending] = useState<null | { kind: "buy" | "cash"; coins: number; chips: number }>(null);
  const [log, setLog] = useState("Pick a game. Bets are in chips.");

  function stake(): number | null {
    if (S.chips < bet) {
      setLog("Not enough chips. Buy some at the cage.");
      return null;
    }
    patch((current) => ({ chips: current.chips - bet }));
    return bet;
  }

  function pay(stakeBet: number, mult: number, note: string) {
    const won = payoutChips(stakeBet, mult);
    patch((current) => ({ chips: current.chips + won }));
    setLog(`${note} ${won ? `+${formatCount(won)} chips` : "No payout."}`);
  }

  function claimDaily() {
    const day = today();
    if (S.lastDaily === day) {
      setLog("Today's bonus is already claimed.");
      return;
    }
    patch((current) => ({
      coins: current.coins + COINS.dailyBonusCoins,
      chips: current.chips + COINS.dailyBonusChips,
      lastDaily: day,
    }));
    setLog(`Daily bonus: +${COINS.dailyBonusCoins} TC and +${COINS.dailyBonusChips} chips.`);
    setMsg("Daily bonus claimed.");
  }

  return (
    <div className="lamp-block" data-testid="casino">
      <h1>Casino</h1>
      <p className="lede">
        Play with chips. {COINS.chipsPerCoin} chips cost 1 lamp coin, and cashing out returns 1 coin per{" "}
        {COINS.chipsPerCoin} chips, rounded down. Coins and chips cannot be cashed out for real money or prizes.
      </p>
      <p className="balance" data-testid="balance-coins">
        {formatCount(S.coins)} TC
        <span data-testid="balance-chips"> · {formatCount(S.chips)} chips</span>
      </p>
      <section className="cage" data-testid="chip-cage">
        <h2>Chip cage</h2>
        <p>Buy chips with lamp coins, or cash chips back into coins. Nothing here becomes real money.</p>
        <div className="bet-row">
          {COINS.chipBets.map((amount) => (
            <button key={amount} type="button" className={bet === amount ? "nbtn on" : "nbtn ghost"} onClick={() => setBet(amount)}>
              Bet {amount}
            </button>
          ))}
        </div>
        <div className="bet-row">
          <button
            type="button"
            className="nbtn"
            data-testid="buy-chips"
            onClick={() =>
              setPending({
                kind: "buy",
                coins: Math.max(1, Math.ceil(bet / COINS.chipsPerCoin)),
                chips: Math.max(1, Math.ceil(bet / COINS.chipsPerCoin)) * COINS.chipsPerCoin,
              })
            }
          >
            Buy chips
          </button>
          <button
            type="button"
            className="nbtn ghost"
            data-testid="cash-chips"
            onClick={() => {
              const quote = coinsFromChips(S.chips);
              setPending({ kind: "cash", coins: quote.coins, chips: quote.chipsSpent });
            }}
          >
            Cash chips out
          </button>
          <button type="button" className="nbtn ghost" data-testid="daily-bonus" onClick={claimDaily}>
            Daily bonus
          </button>
        </div>
        {pending ? (
          <div className="confirm" data-testid="chip-confirm">
            {pending.kind === "buy" ? (
              <p>
                Spend {formatCount(pending.coins)} TC to receive {formatCount(pending.chips)} chips. That is{" "}
                {COINS.chipsPerCoin} chips per coin.
              </p>
            ) : (
              <p>
                Turn {formatCount(pending.chips)} chips into {formatCount(pending.coins)} TC. Leftover chips stay.{" "}
                {COINS.chipsPerCoin} chips make 1 coin, rounded down.
              </p>
            )}
            <button
              type="button"
              className="nbtn"
              data-testid="confirm-chips"
              onClick={() => {
                if (pending.kind === "buy") {
                  patch((current) => {
                    if (current.coins < pending.coins) return {};
                    return { coins: current.coins - pending.coins, chips: current.chips + pending.chips };
                  });
                  setLog(`Bought ${formatCount(pending.chips)} chips.`);
                } else if (pending.coins <= 0) {
                  setLog("You need at least 2 chips to cash out 1 coin.");
                } else {
                  patch((current) => ({
                    chips: current.chips - pending.chips,
                    coins: current.coins + pending.coins,
                  }));
                  setLog(`Cashed ${formatCount(pending.chips)} chips into ${formatCount(pending.coins)} TC.`);
                }
                setPending(null);
              }}
            >
              Confirm
            </button>
            <button type="button" className="nbtn ghost" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        ) : null}
      </section>
      {!open ? (
        <ul className="game-grid-lamp">
          {GAMES.map((game) => (
            <li key={game.id}>
              <button type="button" className="game-tile" data-testid={`game-${game.id}`} onClick={() => setOpen(game.id)}>
                <strong>{game.name}</strong>
                <span>{game.blurb}</span>
              </button>
              <button type="button" className="info" data-testid={`info-${game.id}`} onClick={() => setInfo(info === game.id ? null : game.id)}>
                Odds
              </button>
              {info === game.id ? <p className="odds">{game.odds}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="table" data-testid="table">
          <button type="button" className="nbtn ghost" onClick={() => setOpen(null)}>
            Back to lobby
          </button>
          <h2>{GAMES.find((game) => game.id === open)?.name}</h2>
          <Table
            id={open}
            bet={bet}
            chips={S.chips}
            stake={stake}
            pay={pay}
          />
        </div>
      )}
      <p className="result" data-testid="casino-log">{log}</p>
      {msg ? <p className="result">{msg}</p> : null}
      <p className="fine-print">
        18+ / play for fun. This is a social casino. Coins and chips stay on the lamp. They are not money and they cannot be exchanged for cash or prizes.
      </p>
      <p className="sr-only">
        Slot weights {SLOT_TABLE.length}. Wheel slices {WHEEL_WEDGES.length}. Plinko bins {PLINKO_MULT.length}.
      </p>
    </div>
  );
}

function Table({
  id,
  bet,
  chips,
  stake,
  pay,
}: {
  id: GameId;
  bet: number;
  chips: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  if (id === "slots") return <Slots bet={bet} chips={chips} stake={stake} pay={pay} />;
  if (id === "wheel") return <Wheel bet={bet} stake={stake} pay={pay} />;
  if (id === "blackjack") return <Blackjack bet={bet} stake={stake} pay={pay} />;
  if (id === "plinko") return <Plinko bet={bet} stake={stake} pay={pay} />;
  if (id === "flip") return <Flip bet={bet} stake={stake} pay={pay} />;
  if (id === "hilo") return <HiLo bet={bet} stake={stake} pay={pay} />;
  if (id === "scratch") return <Scratch bet={bet} stake={stake} pay={pay} />;
  if (id === "mines") return <Mines bet={bet} stake={stake} pay={pay} />;
  return <Roulette bet={bet} stake={stake} pay={pay} />;
}

function Slots({
  bet,
  stake,
  pay,
}: {
  bet: number;
  chips: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [reels, setReels] = useState(["—", "—", "—"]);
  const [spinning, setSpinning] = useState(false);
  return (
    <div>
      <div className={`reels-neon${spinning ? " spin" : ""}`} data-testid="reels">
        {reels.map((reel, index) => (
          <span key={index}>{reel}</span>
        ))}
      </div>
      <button
        type="button"
        className="nbtn"
        data-testid="spin"
        onClick={() => {
          const paid = stake();
          if (paid == null) return;
          setSpinning(true);
          const result = spinSlots();
          const face = result.mult >= 12 ? "7" : result.mult >= 6 ? "★" : result.mult >= 3 ? "◆" : result.mult >= 2 ? "●" : result.mult >= 1 ? "▮" : "·";
          window.setTimeout(() => {
            setReels(result.mult === 0 ? ["★", "◆", "●"] : [face, face, face]);
            setSpinning(false);
            pay(paid, result.mult, result.label);
          }, 450);
        }}
      >
        Spin · {bet} chips
      </button>
    </div>
  );
}

function Wheel({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [deg, setDeg] = useState(0);
  return (
    <div>
      <div className="wheel-neon" style={{ transform: `rotate(${deg}deg)` }} data-testid="wheel" />
      <button
        type="button"
        className="nbtn"
        data-testid="spin-wheel"
        onClick={() => {
          const paid = stake();
          if (paid == null) return;
          const spin = spinWheel();
          setDeg((value) => value + 1080 + spin.index * 30);
          window.setTimeout(() => pay(paid, spin.mult, `Slice ${spin.mult}x.`), 700);
        }}
      >
        Spin · {bet} chips
      </button>
    </div>
  );
}

function Blackjack({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [hand, setHand] = useState<ReturnType<typeof beginBlackjack> | null>(null);
  const [lockedBet, setLockedBet] = useState(0);
  const show = (cards: number[], hideHole = false) =>
    cards.map((rank, index) => (hideHole && index === 1 ? "?" : RANK_NAMES[rank])).join(" ");
  return (
    <div data-testid="blackjack">
      {hand ? (
        <>
          <p>You: {show(hand.player)} ({handTotal(hand.player)})</p>
          <p>Dealer: {show(hand.dealer, !hand.done)} {hand.done ? `(${handTotal(hand.dealer)})` : ""}</p>
        </>
      ) : (
        <p>Deal a hand. Hit until you want to stand.</p>
      )}
      <div className="bet-row">
        <button
          type="button"
          className="nbtn"
          data-testid="deal"
          onClick={() => {
            const paid = stake();
            if (paid == null) return;
            setLockedBet(paid);
            const started = beginBlackjack();
            setHand(started);
            if (started.done) pay(paid, started.mult, "Dealt.");
          }}
        >
          Deal · {bet}
        </button>
        <button
          type="button"
          className="nbtn ghost"
          data-testid="hit"
          disabled={!hand || hand.done}
          onClick={() => {
            if (!hand || hand.done) return;
            const next = hitBlackjack(hand);
            setHand(next);
            if (next.done) pay(lockedBet, next.mult, "Bust.");
          }}
        >
          Hit
        </button>
        <button
          type="button"
          className="nbtn ghost"
          data-testid="stand"
          disabled={!hand || hand.done}
          onClick={() => {
            if (!hand) return;
            const done = standBlackjack(hand);
            setHand(done);
            pay(lockedBet, done.mult, "Hand over.");
          }}
        >
          Stand
        </button>
      </div>
    </div>
  );
}

function Plinko({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [bin, setBin] = useState<number | null>(null);
  return (
    <div>
      <div className="bins" data-testid="plinko">
        {PLINKO_MULT.map((mult, index) => (
          <span key={index} className={bin === index ? "on" : ""}>
            {mult}x
          </span>
        ))}
      </div>
      <button
        type="button"
        className="nbtn"
        data-testid="drop"
        onClick={() => {
          const paid = stake();
          if (paid == null) return;
          const drop = dropPlinko();
          setBin(drop.bin);
          pay(paid, drop.mult, `Landed on ${drop.mult}x.`);
        }}
      >
        Drop · {bet}
      </button>
    </div>
  );
}

function Flip({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [side, setSide] = useState("—");
  return (
    <div data-testid="flip">
      <p className="big-result">{side}</p>
      <div className="bet-row">
        {(["heads", "tails"] as const).map((pick) => (
          <button
            key={pick}
            type="button"
            className="nbtn"
            data-testid={`flip-${pick}`}
            onClick={() => {
              const paid = stake();
              if (paid == null) return;
              const result = flipCoin(pick);
              setSide(result.side);
              pay(paid, result.mult, result.side);
            }}
          >
            {pick}
          </button>
        ))}
      </div>
    </div>
  );
}

function HiLo({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [cards, setCards] = useState("Tap higher or lower");
  return (
    <div>
      <p data-testid="hilo-cards">{cards}</p>
      <div className="bet-row">
        {(["higher", "lower"] as const).map((pick) => (
          <button
            key={pick}
            type="button"
            className="nbtn"
            data-testid={`hilo-${pick}`}
            onClick={() => {
              const paid = stake();
              if (paid == null) return;
              const drawn = drawHiLoCards();
              const result = hiLoResult(drawn.firstRank, drawn.secondRank, pick);
              setCards(`${drawn.first} then ${drawn.second}`);
              pay(paid, result.mult, result.outcome);
            }}
          >
            {pick}
          </button>
        ))}
      </div>
    </div>
  );
}

function Scratch({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [tiles, setTiles] = useState<string[]>(["?", "?", "?"]);
  return (
    <div>
      <div className="reels-neon" data-testid="scratch">
        {tiles.map((tile, index) => (
          <span key={index}>{tile}</span>
        ))}
      </div>
      <button
        type="button"
        className="nbtn"
        data-testid="scratch-go"
        onClick={() => {
          const paid = stake();
          if (paid == null) return;
          const card = scratchCard();
          setTiles(card.tiles);
          pay(paid, card.mult, "Scratched.");
        }}
      >
        Scratch · {bet}
      </button>
    </div>
  );
}

function Mines({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [board, setBoard] = useState<boolean[] | null>(null);
  const [openCells, setOpenCells] = useState<boolean[]>(Array(25).fill(false));
  const [safe, setSafe] = useState(0);
  const [locked, setLocked] = useState(0);
  const [dead, setDead] = useState(false);
  return (
    <div>
      <p>Next cash-out {mineCashMult(safe + (board ? 1 : 0))}x after the next gem. Now {mineCashMult(safe)}x.</p>
      <div className="mines" data-testid="mines">
        {Array.from({ length: 25 }, (_, index) => (
          <button
            key={index}
            type="button"
            className="mine"
            data-testid={`mine-${index}`}
            disabled={!board || dead || openCells[index]}
            onClick={() => {
              if (!board) return;
              const nextOpen = openCells.slice();
              nextOpen[index] = true;
              setOpenCells(nextOpen);
              if (board[index]) {
                setDead(true);
                pay(locked, 0, "Mine.");
                return;
              }
              const gems = safe + 1;
              setSafe(gems);
            }}
          >
            {openCells[index] ? (board?.[index] ? "x" : "•") : ""}
          </button>
        ))}
      </div>
      <div className="bet-row">
        <button
          type="button"
          className="nbtn"
          data-testid="mines-start"
          onClick={() => {
            const paid = stake();
            if (paid == null) return;
            const mines = new Set<number>();
            const roll = new Uint32Array(1);
            while (mines.size < 5) {
              crypto.getRandomValues(roll);
              mines.add(roll[0] % 25);
            }
            setBoard(Array.from({ length: 25 }, (_, index) => mines.has(index)));
            setOpenCells(Array(25).fill(false));
            setSafe(0);
            setLocked(paid);
            setDead(false);
          }}
        >
          Start · {bet}
        </button>
        <button
          type="button"
          className="nbtn ghost"
          data-testid="mines-cash"
          disabled={!board || dead || safe < 1}
          onClick={() => {
            pay(locked, mineCashMult(safe), `Cashed ${safe} gems.`);
            setBoard(null);
            setDead(true);
          }}
        >
          Cash out
        </button>
      </div>
    </div>
  );
}

function Roulette({
  bet,
  stake,
  pay,
}: {
  bet: number;
  stake: () => number | null;
  pay: (bet: number, mult: number, note: string) => void;
}) {
  const [pocket, setPocket] = useState<number | null>(null);
  const [number, setNumber] = useState(7);
  function spin(kind: "red" | "black" | "straight") {
    const paid = stake();
    if (paid == null) return;
    const landed = europeanPocket();
    setPocket(landed);
    const mult = roulettePayout(landed, kind, number);
    pay(paid, mult, `${landed} ${rouletteColor(landed)}`);
  }
  return (
    <div data-testid="roulette">
      <p className="big-result">{pocket == null ? "—" : `${pocket} ${rouletteColor(pocket)}`}</p>
      <div className="bet-row">
        <button type="button" className="nbtn" data-testid="bet-red" onClick={() => spin("red")}>
          Red
        </button>
        <button type="button" className="nbtn" data-testid="bet-black" onClick={() => spin("black")}>
          Black
        </button>
      </div>
      <label className="try-label">
        Number 0–36
        <input
          className="email-field"
          data-testid="roulette-number"
          inputMode="numeric"
          value={number}
          onChange={(event) => setNumber(Math.max(0, Math.min(36, Number(event.target.value) || 0)))}
        />
      </label>
      <button type="button" className="nbtn ghost" data-testid="bet-straight" onClick={() => spin("straight")}>
        Bet {number}
      </button>
    </div>
  );
}
