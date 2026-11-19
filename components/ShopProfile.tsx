"use client";
import { useEffect, useState } from "react";
import {
  FREE_TOOLS,
  HOURLY,
  OWNER_EMAIL,
  PACKS,
  TIERS,
  type Page,
  type State,
  goPaypal,
} from "./constants";
export function ShopPage({
  S,
  msg,
  setMsg,
  payNote,
}: {
  S: State;
  msg: string;
  setMsg: (m: string) => void;
  payNote: string;
}) {
  return (
    <>
      <p className="seal">UELG:TRADE_01</p>
      <h1>Shop</h1>
      <div className="paybox">
        <h2 style={{ color: "var(--coin)" }}>Pay with card</h2>
        <p>
          Gold buttons open PayPal. Pay with Visa, Mastercard, Amex, or a PayPal
          balance. After you pay, tap Return to 2oolz Genie - coins land in this
          lamp.
        </p>
      </div>
      {payNote && <p className="msg ok">{payNote}</p>}
      <h2>Coin packs</h2>
      <p className="note">These coins are for the lamp games only. They are not cash, and the casino cannot pay them out as money.</p>
      {PACKS.map((p) => {
        const best = p.id === "vault";
        return (
          <div className="pack" key={p.id}>
            {best ? <span className="badge">Best value</span> : null}
            <b>{p.l}</b>
            <p>{p.c} TC · ${p.u}</p>
            <button className="btn pay" type="button" onClick={() => goPaypal(p.id, p.l, p.u)}>
              Pay ${p.u}
            </button>
          </div>
        );
      })}
      <h2>Tiers</h2>
      {TIERS.filter((t) => t.id !== "free").map((t) => (
        <div className="row" key={t.id}>
          <div>
            <b>{t.l}</b>
            <div className="seal">
              {t.c} TC now . ${t.u} / {t.cad} . +{HOURLY[t.id]}/h
            </div>
          </div>
          <button
            className="btn ghost pay"
            type="button"
            onClick={() => {
              if (S.tier === t.id) {
                setMsg("Already on this lamp.");
                return;
              }
              goPaypal(t.id, t.l, t.u);
            }}
          >
            {S.tier === t.id ? "Active" : "Pay $" + t.u}
          </button>
        </div>
      ))}
      <p className="note">
        {msg ||
          "Real money. PayPal checkout. Coins credit when you come back."}
      </p>
    </>
  );
}
export function ToolsPage({
  S,
  msg,
  go,
  onDelete,
  addFreeTool,
}: {
  S: State;
  msg: string;
  go: (p: Page) => void;
  onDelete: (index: number) => void;
  addFreeTool: (freeId: string, name: string) => void;
}) {
  const [tab, setTab] = useState<"library" | "free">(
    S.tools.length ? "library" : "free"
  );
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openFree, setOpenFree] = useState<string | null>(null);
  const [tryInput, setTryInput] = useState("");
  const [tryOut, setTryOut] = useState<string | null>(null);
  const freeTool = FREE_TOOLS.find((t) => t.id === openFree) || null;
  const open =
    openIdx != null && openIdx >= 0 && openIdx < S.tools.length
      ? S.tools[openIdx]
      : null;

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (secondsLeft == null || secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((value) => (value == null ? value : value - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  function runFreeDemo(tool: (typeof FREE_TOOLS)[number]) {
    const typed = tryInput.trim();
    const roll = new Uint32Array(1);
    crypto.getRandomValues(roll);
    if (tool.id === "echo") {
      if (!typed) {
        setTryOut("Type a note first, then tap Echo.");
        return;
      }
      setTryOut("The lamp echoes: \"" + typed + "\"");
      return;
    }
    if (tool.id === "flip") {
      const side = roll[0] % 2 === 0 ? "heads" : "tails";
      const called = typed.toLowerCase();
      const calledSide = called.startsWith("h") ? "heads" : called.startsWith("t") ? "tails" : "";
      setTryOut(side === calledSide ? `It's ${side}. That matches your call.` : calledSide ? `It's ${side}. Your call was ${calledSide}.` : `It's ${side}.`);
      return;
    }
    if (tool.id === "joke") {
      const jokes = [
        "The lamp grants wishes. It also grants a receipt.",
        "Why did the coin cross the wheel? To see the other side.",
        "A genie walked into a forge and came out slightly rarer.",
        "The house edge is a door. This joke does not open it.",
      ];
      setTryOut(jokes[roll[0] % jokes.length]);
      return;
    }
    if (tool.id === "sticker") {
      setTryOut("Seal " + (roll[0] % 9000 + 1000) + " is stuck on the lamp. It does not change your coins.");
      return;
    }
    if (tool.id === "hourglass" || tool.id === "calm") {
      const minutes = Number(typed);
      const seconds = tool.id === "calm" ? 60 : Number.isFinite(minutes) && minutes > 0 && minutes <= 10 ? Math.round(minutes * 60) : 60;
      setSecondsLeft(seconds);
      setTryOut(tool.id === "calm" ? "One calm minute. Breathe. There is no sound." : "Timer started. Stay on this page to watch it.");
      return;
    }
    if (tool.id === "spark") {
      const glows = ["cyan", "magenta", "violet"];
      setTryOut("Glow set to " + glows[roll[0] % glows.length] + ". Cosmetic only.");
      return;
    }
    setTryOut(tool.demo || "Done.");
  }

  if (open && openIdx != null) {
    const forged = new Date(open.t).toLocaleString();
    const linked = open.freeId
      ? FREE_TOOLS.find((f) => f.id === open.freeId)
      : null;
    return (
      <>
        <p className="seal">UELG:TOOLS_01</p>
        <h1>Tool</h1>
        <div className="tool-panel">
          <h2>{open.n}</h2>
          <p className="seal">
            {open.r} · forged {forged}
          </p>
          {linked ? (
            <>
              <h2>What it does</h2>
              <p className="tool-body">{linked.body}</p>
              <h2>How to use</h2>
              <ol className="howto">
                {linked.how.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {linked.inputLabel && (
                <label className="try-label">
                  {linked.inputLabel}
                  <input
                    className="email-field"
                    value={tryInput}
                    onChange={(e) => setTryInput(e.target.value)}
                    placeholder={linked.inputPlaceholder || ""}
                  />
                </label>
              )}
              <button
                className="btn"
                type="button"
                onClick={() => runFreeDemo(linked)}
              >
                {linked.runLabel || "Try it"}
              </button>
              {secondsLeft != null ? <p className="try-out" data-testid="timer">{secondsLeft > 0 ? secondsLeft + " seconds left" : "Time's up."}</p> : null}
              {tryOut && <p className="try-out">{tryOut}</p>}
            </>
          ) : (
            <p className="tool-body">
              {open.n} is an older shelf name with no action. Delete it, or add a real tool from the free shelf.
            </p>
          )}
          <div className="tool-actions">
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setOpenIdx(null);
                setTryInput("");
                setTryOut(null);
              }}
            >
              Close
            </button>
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                onDelete(openIdx);
                setOpenIdx(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        {msg && <p className="msg">{msg}</p>}
      </>
    );
  }

  if (freeTool) {
    return (
      <>
        <p className="seal">UELG:TOOLS_01 · free shelf</p>
        <h1>{freeTool.n}</h1>
        <div className="tool-panel">
          <p className="seal">{freeTool.r} · demo</p>
          <h2>What it does</h2>
          <p className="tool-body">{freeTool.body}</p>
          <p className="card-blurb">{freeTool.blurb}</p>
          <h2>How to use</h2>
          <ol className="howto">
            {freeTool.how.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {freeTool.inputLabel && (
            <label className="try-label">
              {freeTool.inputLabel}
              <input
                className="email-field"
                value={tryInput}
                onChange={(e) => setTryInput(e.target.value)}
                placeholder={freeTool.inputPlaceholder || ""}
              />
            </label>
          )}
          <button
            className="btn"
            type="button"
            onClick={() => runFreeDemo(freeTool)}
          >
            {freeTool.runLabel || "Try it"}
          </button>
          {secondsLeft != null ? <p className="try-out">{secondsLeft > 0 ? secondsLeft + " seconds left" : "Time's up."}</p> : null}
          {tryOut && <p className="try-out">{tryOut}</p>}
          {!tryOut && (
            <p className="note">
              Tap <b>{freeTool.runLabel || "Try it"}</b> above — that runs the
              demo. No TC spent.
            </p>
          )}
          <div className="tool-actions">
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setOpenFree(null);
                setTryInput("");
                setTryOut(null);
              }}
            >
              Close
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => addFreeTool(freeTool.id, freeTool.n)}
            >
              Add to library
            </button>
          </div>
        </div>
        {msg && <p className="msg">{msg}</p>}
      </>
    );
  }

  return (
    <>
      <p className="seal">UELG:TOOLS_01</p>
      <h1>Tools <span className="free-pill">Free for now</span></h1>
      <div className="hilo-bets" style={{ marginBottom: 12 }}>
        <button
          className={"btn" + (tab === "library" ? "" : " ghost")}
          type="button"
          onClick={() => setTab("library")}
        >
          Library
        </button>
        <button
          className={"btn" + (tab === "free" ? "" : " ghost")}
          type="button"
          onClick={() => setTab("free")}
        >
          Free tools
        </button>
      </div>
      {tab === "free" && (
        <>
          <div className="howto-card">
            <h2>How Free tools work</h2>
            <ol className="howto">
              <li>Tap a tool below</li>
              <li>Read what it does</li>
              <li>Type something if it asks</li>
              <li>Tap the action button. It is free for now.</li>
            </ol>
            <p className="card-blurb">
              Each tool does the small job in its description. None of them spend TC.
            </p>
          </div>
          <div className="grid">
            {FREE_TOOLS.map((t) => (
              <div className="row" key={t.id}>
                <div>
                  <b>{t.n}</b>
                  <div className="card-blurb">{t.blurb}</div>
                </div>
                <button
                  className="btn open-tool"
                  type="button"
                  onClick={() => {
                    setOpenFree(t.id);
                    setTryInput("");
                    setTryOut(null);
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "library" && (
        <>
          {!S.tools.length ? (
            <>
              <p>Your library is empty. Start with a Free tool demo.</p>
              <div className="grid">
                <button className="btn" type="button" onClick={() => setTab("free")}>
                  Browse Free tools
                </button>
                <button className="btn ghost" type="button" onClick={() => go("forge")}>
                  Go Forge
                </button>
                <button className="btn ghost" type="button" onClick={() => go("market")}>
                  Go Market
                </button>
              </div>
            </>
          ) : (
            <div className="grid">
              {S.tools.map((t, i) => (
                <div className="row" key={t.n + t.t + i}>
                  <div>
                    <b>{t.n}</b>
                    <div className="seal">{t.r}</div>
                  </div>
                  <button
                    className="btn open-tool"
                    type="button"
                    onClick={() => {
                      setOpenIdx(i);
                      setTryInput("");
                      setTryOut(null);
                    }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {msg && <p className="msg">{msg}</p>}
    </>
  );
}

export function ProfilePage({
  S,
  hourly,
  goShop,
  claimLamp,
}: {
  S: State;
  hourly: number;
  goShop: () => void;
  claimLamp: (email: string) => void;
}) {
  const [email, setEmail] = useState(S.email || "");
  return (
    <>
      <p className="seal">Profile</p>
      <h1>Lamp</h1>
      <p className="drip">
        Tier {S.tier} . +{hourly} TC / hour . {S.wishes} wishes
      </p>
      <button className="btn" type="button" onClick={goShop}>
        Open Shop
      </button>
      <h2>Email</h2>
      <p className="note">
        Claim with{" "}
        {OWNER_EMAIL} for +1000 TC once.
      </p>
      <input
        className="email-field"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn ghost" type="button" onClick={() => claimLamp(email)}>
        Claim lamp
      </button>
      {S.email && (
        <p className="drip">
          Saved . {S.email}
          {S.ownerGrant ? " . owner grant claimed" : ""}
        </p>
      )}
      <h2>Library</h2>
      {S.tools.length ? (
        S.tools.map((t, i) => (
          <div className="row" key={t.n + t.t + i}>
            <b>{t.n}</b>
            <span className="seal">{t.r}</span>
          </div>
        ))
      ) : (
        <p>No seals yet. Forge first.</p>
      )}
    </>
  );
}
