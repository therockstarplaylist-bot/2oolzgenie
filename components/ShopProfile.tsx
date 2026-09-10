"use client";

import {
  HOURLY,
  PACKS,
  TIERS,
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
          balance. After you pay, tap Return to 2oolz Genie — coins land in this
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
              {t.c} TC now · ${t.u} / {t.cad} · +{HOURLY[t.id]}/h
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

export function ProfilePage({
  S,
  hourly,
  goShop,
}: {
  S: State;
  hourly: number;
  goShop: () => void;
}) {
  return (
    <>
      <p className="seal">Profile</p>
      <h1>Lamp</h1>
      <p className="drip">
        Tier {S.tier} · +{hourly} TC / hour · {S.wishes} wishes
      </p>
      <button className="btn" type="button" onClick={goShop}>
        Open Shop
      </button>
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
