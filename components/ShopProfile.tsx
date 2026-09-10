"use client";
import { useState } from "react";
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
      {PACKS.map((p) => (
        <div className="row" key={p.id}>
          <div>
            <b>{p.l}</b>
            <div className="seal">{p.c} TC</div>
          </div>
          <button
            className="btn pay"
            type="button"
            onClick={() => goPaypal(p.id, p.l, p.u)}
          >
            Pay ${p.u}
          </button>
        </div>
      ))}
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

  function runFreeDemo(tool: (typeof FREE_TOOLS)[number]) {
    const typed = tryInput.trim();
    if (tool.id === "echo") {
      setTryOut(
        "The lamp echoes: \"" + (typed || "hello from the free shelf") + "\""
      );
      return;
    }
    if (tool.id === "flip" && typed) {
      setTryOut(
        "You called " +
          typed +
          ". " +
          tool.demo +
          " (Still a demo — no TC.)"
      );
      return;
    }
    if (tool.id === "hourglass" && typed) {
      setTryOut("Noted: \"" + typed + "\". " + tool.demo);
      return;
    }
    setTryOut(tool.demo);
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
              {tryOut && <p className="try-out">{tryOut}</p>}
            </>
          ) : (
            <p className="tool-body">{open.n}</p>
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
      <h1>Tools</h1>
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
              <li>Tap <b>Try it</b> to run the demo</li>
            </ol>
            <p className="card-blurb">
              These are demos — they show Open works. They do not spend TC and
              are not powerful paid tools.
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
