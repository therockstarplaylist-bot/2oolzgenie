"use client";
import { useEffect, useState } from "react";
import {
  FREE_TOOLS,
  HOURLY,
  OWNER_EMAIL,
  PACKS,
  TIERS,
  getFreeTool,
  PROCESS_PACKS,
  pickNearbyHints,
  contextFromLibrary,
  type Page,
  type State,
  type ToolRarity,
  goPaypal,
} from "./constants";
import { getForgeBlueprint, runForge } from "./forgeBlueprints";
import { RealToolPanel } from "./RealToolPanel";
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
  buyProcessPack,
}: {
  S: State;
  msg: string;
  go: (p: Page) => void;
  onDelete: (index: number) => void;
  addFreeTool: (freeId: string, name: string) => void;
  buyProcessPack?: (packId: string) => void;
}) {
  const [tab, setTab] = useState<"library" | "free" | "packs">(
    S.tools.length ? "library" : "free"
  );
  const [shelf, setShelf] = useState<ToolRarity | "all">("all");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [openFree, setOpenFree] = useState<string | null>(null);
  const [tryInput, setTryInput] = useState("");
  const [tryOut, setTryOut] = useState<string | null>(null);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("tg_open_latest") === "1" && S.tools.length) {
        sessionStorage.removeItem("tg_open_latest");
        setTab("library");
        setOpenIdx(0);
      }
    } catch {}
  }, [S.tools.length]);
  const freeTool = getFreeTool(openFree || undefined) || null;
  const open =
    openIdx != null && openIdx >= 0 && openIdx < S.tools.length
      ? S.tools[openIdx]
      : null;
  const ctx = contextFromLibrary(S.tools);
  const ownedPacks = S.ownedPacks || [];

  const sections: { id: ToolRarity; title: string; pitch: string }[] = [
    {
      id: "common",
      title: "Common",
      pitch: "Everyday shelf tools — quick, useful, zero TC.",
    },
    {
      id: "uncommon",
      title: "Uncommon",
      pitch: "Medium utilities for drafts, data, and conversions.",
    },
    {
      id: "rare",
      title: "Rare · hard to DIY",
      pitch: "Real desks: regex, JWT, CSV, checksums, ICS, cron — not toys.",
    },
  ];

  function rarityBadge(r: string) {
    return <span className={"rarity-badge rarity-" + r}>{r}</span>;
  }

  function renderNearby(rarity: ToolRarity) {
    const hints = pickNearbyHints(rarity, ctx, 3);
    if (!hints.length) return null;
    return (
      <aside className="hint-window" aria-label="Nearby ideas">
        <div className="hint-window-title">Nearby ideas</div>
        <p className="card-blurb" style={{ marginTop: 0 }}>
          Soft suggestions from forge wishes and shelf neighbors — what you can
          get done, not what it is called.
        </p>
        <ul className="hint-list">
          {hints.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className="hint-link"
                onClick={() => {
                  setOpenFree(h.id);
                  setTryInput("");
                  setTryOut(null);
                }}
              >
                {h.hint}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  function renderShelfList(rarity: ToolRarity) {
    const list = FREE_TOOLS.filter((t) => t.rarity === rarity);
    return (
      <div className="grid" key={rarity}>
        {list.map((t) => (
          <div className="row" key={t.id}>
            <div>
              <b>{t.n}</b> {rarityBadge(t.rarity)}
              <div className="card-blurb">{t.blurb}</div>
              <div className="seal">0 TC</div>
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
    );
  }

  if (open && openIdx != null) {
    const forged = new Date(open.t).toLocaleString();
    const linked = open.freeId ? getFreeTool(open.freeId) : null;
    const forgedBp = open.forgeId ? getForgeBlueprint(open.forgeId) : null;
    return (
      <>
        <p className="seal">UELG:TOOLS_01</p>
        <h1>Tool</h1>
        <div className="tool-panel">
          <h2>{open.n}</h2>
          <p className="seal">
            {open.r} · forged {forged}
          </p>
          {forgedBp ? (
            <>
              <h2>What it does</h2>
              <p className="tool-body">{forgedBp.blurb}</p>
              {open.brief && (
                <p className="card-blurb">Wish: {open.brief}</p>
              )}
              <h2>How to use</h2>
              <ol className="howto">
                {forgedBp.how.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <label className="try-label">
                Input
                <textarea
                  value={tryInput}
                  onChange={(e) => setTryInput(e.target.value)}
                  placeholder={forgedBp.placeholder}
                  rows={5}
                />
              </label>
              <button
                className="btn"
                type="button"
                onClick={() =>
                  setTryOut(
                    runForge(open.forgeId!, tryInput, open.brief || open.n)
                  )
                }
              >
                {forgedBp.runLabel || "Try it"}
              </button>
              {tryOut && (
                <pre className="try-out" style={{ whiteSpace: "pre-wrap" }}>
                  {tryOut}
                </pre>
              )}
            </>
          ) : linked ? (
            <>
              <h2>What it does</h2>
              <p className="tool-body">{linked.body}</p>
              <h2>How to use</h2>
              <ol className="howto">
                {linked.how.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <RealToolPanel toolId={linked.id} />
            </>
          ) : (
            <p className="tool-body">
              {open.n} — this shelf item has no runner yet. Forge a new wish for a
              Try-it tool.
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
          <p className="seal">
            {rarityBadge(freeTool.rarity)} · 0 TC
          </p>
          <h2>What it does</h2>
          <p className="tool-body">{freeTool.body}</p>
          <p className="card-blurb">{freeTool.blurb}</p>
          <h2>How to use</h2>
          <ol className="howto">
            {freeTool.how.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <h2>Run</h2>
          <RealToolPanel toolId={freeTool.id} />
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
        <button
          className={"btn" + (tab === "packs" ? "" : " ghost")}
          type="button"
          onClick={() => setTab("packs")}
        >
          Process packs
        </button>
      </div>
      {tab === "packs" && (
        <>
          <div className="howto-card">
            <h2>Process packs</h2>
            <p className="card-blurb">
              Buy a whole workflow for fair TC — priced under à-la-carte Market
              seeds (~24 TC each), without a casino pitch. One purchase per pack.
            </p>
          </div>
          <div className="grid">
            {PROCESS_PACKS.map((p) => {
              const owned = ownedPacks.includes(p.id);
              const save = Math.max(0, p.alaCarte - p.cost);
              return (
                <div className="row pack-card" key={p.id}>
                  <div>
                    <b>{p.n}</b>
                    <div className="card-blurb">{p.process}</div>
                    <div className="seal">
                      {p.cost} TC · ~{p.toolIds.length} tools
                      {save > 0 ? ` · saves ~${save} TC vs one-by-one` : ""}
                    </div>
                  </div>
                  <button
                    className={"btn" + (owned ? " ghost" : "")}
                    type="button"
                    disabled={owned || !buyProcessPack}
                    onClick={() => buyProcessPack && buyProcessPack(p.id)}
                  >
                    {owned ? "Owned" : "Unlock " + p.cost + " TC"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
      {tab === "free" && (
        <>
          <div className="howto-card">
            <h2>Free shelf</h2>
            <ol className="howto">
              <li>Pick Common, Uncommon, or Rare</li>
              <li>Open a tool and run it here</li>
              <li>Add keepers to your library — still 0 TC</li>
            </ol>
            <p className="card-blurb">
              Quality tiers, not a paywall. Rare tools are hard to DIY — real
              utilities on the lamp.
            </p>
          </div>
          <div className="hilo-bets" style={{ marginBottom: 12 }}>
            <button
              className={"btn" + (shelf === "all" ? "" : " ghost")}
              type="button"
              onClick={() => setShelf("all")}
            >
              All
            </button>
            {sections.map((s) => (
              <button
                key={s.id}
                className={"btn" + (shelf === s.id ? "" : " ghost")}
                type="button"
                onClick={() => setShelf(s.id)}
              >
                {s.id === "rare" ? "Rare" : s.title}
              </button>
            ))}
          </div>
          {(shelf === "all" ? sections : sections.filter((s) => s.id === shelf)).map(
            (s) => (
              <div key={s.id} className="shelf-section">
                <h2>
                  {s.title} {rarityBadge(s.id)}
                </h2>
                <p className="card-blurb">{s.pitch}</p>
                {renderNearby(s.id)}
                {renderShelfList(s.id)}
              </div>
            )
          )}
        </>
      )}
      {tab === "library" && (
        <>
          {!S.tools.length ? (
            <>
              <p>Your library is empty. Start with a Free tool or a Process pack.</p>
              <div className="grid">
                <button className="btn" type="button" onClick={() => setTab("free")}>
                  Browse Free tools
                </button>
                <button className="btn ghost" type="button" onClick={() => setTab("packs")}>
                  Process packs
                </button>
                <button className="btn ghost" type="button" onClick={() => go("forge")}>
                  Go Forge
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
