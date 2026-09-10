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
  const [tab, setTab] = useState<"library" | "free">("library");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openFree, setOpenFree] = useState<string | null>(null);
  const freeTool = FREE_TOOLS.find((t) => t.id === openFree) || null;
  const open =
    openIdx != null && openIdx >= 0 && openIdx < S.tools.length
      ? S.tools[openIdx]
      : null;
  if (open && openIdx != null) {
    const forged = new Date(open.t).toLocaleString();
    const demo =
      open.freeId &&
      FREE_TOOLS.find((f) => f.id === open.freeId)?.demo;
    return (
      <>
        <p className="seal">UELG:TOOLS_01</p>
        <h1>Tool</h1>
        <div className="tool-panel">
          <h2>{open.n}</h2>
          <p className="seal">
            {open.r} . forged {forged}
          </p>
          <p className="tool-body">{demo || open.n}</p>
          <div className="tool-actions">
            <button className="btn ghost" type="button" onClick={() => setOpenIdx(null)}>
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
        <p className="seal">UELG:TOOLS_01 . free shelf</p>
        <h1>{freeTool.n}</h1>
        <div className="tool-panel">
          <p className="seal">{freeTool.r}</p>
          <p className="tool-body">{freeTool.body}</p>
          <p className="tool-body" style={{ color: "var(--accent)" }}>
            {freeTool.demo}
          </p>
          <div className="tool-actions">
            <button className="btn ghost" type="button" onClick={() => setOpenFree(null)}>
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
          <p>Demo shelf - cute, low-value previews. Open free. Add optional.</p>
          <div className="grid">
            {FREE_TOOLS.map((t) => (
              <div className="row" key={t.id}>
                <div>
                  <b>{t.n}</b>
                  <div className="seal">{t.r} . preview</div>
                </div>
                <button
                  className="btn open-tool"
                  type="button"
                  onClick={() => setOpenFree(t.id)}
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
              <p>
                No kept tools yet. Try Free tools, or Forge / Market.
              </p>
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
                    onClick={() => setOpenIdx(i)}
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
        Coins live in this browser lamp until accounts exist. Claim with{" "}
        {OWNER_EMAIL} once for the owner grant.
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
