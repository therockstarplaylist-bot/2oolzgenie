"use client";

import { useMemo, useState } from "react";
import {
  SKILL_CATALOG,
  type SkillDef,
  type SkillShelf,
  runSkill,
  shelfLabel,
} from "./skillCatalog";
import type { State } from "./constants";

const SHELVES: SkillShelf[] = [
  "meta",
  "memory",
  "reasoning",
  "evolution",
  "world",
  "product",
];

export function SkillGeniePanel({
  S,
  msg,
  unlockSkill,
}: {
  S: State;
  msg: string;
  unlockSkill: (skillId: string) => void;
}) {
  const [shelf, setShelf] = useState<SkillShelf | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tryInput, setTryInput] = useState("");
  const [tryOut, setTryOut] = useState<string | null>(null);

  const unlocked = useMemo(() => {
    const ids = new Set<string>();
    for (const t of S.tools) {
      if (t.skillId) ids.add(t.skillId);
    }
    return ids;
  }, [S.tools]);

  const list = useMemo(() => {
    return SKILL_CATALOG.filter((s) => shelf === "all" || s.shelf === shelf);
  }, [shelf]);

  const open: SkillDef | null =
    (openId && SKILL_CATALOG.find((s) => s.id === openId)) || null;
  const isUnlocked = open ? unlocked.has(open.id) : false;

  if (open) {
    return (
      <>
        <p className="seal">UELG:SKILL_GENIE_01 · {shelfLabel(open.shelf)}</p>
        <h1>
          {open.n}. {open.name}
        </h1>
        <div className="tool-panel">
          <p className="seal">
            {isUnlocked ? "unlocked" : "locked"} · cost {open.wishCost} skill
            wish
          </p>
          <h2>What it does</h2>
          <p className="tool-body">{open.blurb}</p>
          <p className="card-blurb">
            Product tool — process amplifier. Not AGI. Local heuristics only.
          </p>
          <h2>How to use</h2>
          <ol className="howto">
            {open.how.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {!isUnlocked ? (
            <>
              <p className="note">
                Locked. You have <b>{S.skillWishes}</b> skill wish
                {S.skillWishes === 1 ? "" : "es"}. Buy packs in Shop, then
                unlock.
              </p>
              <div className="tool-actions">
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setOpenId(null);
                    setTryInput("");
                    setTryOut(null);
                  }}
                >
                  Close
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => unlockSkill(open.id)}
                >
                  Unlock · 1 wish
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="try-label">
                Input
                <textarea
                  className="email-field"
                  style={{ minHeight: "7rem" }}
                  value={tryInput}
                  onChange={(e) => setTryInput(e.target.value)}
                  placeholder={open.placeholder}
                />
              </label>
              <button
                className="btn"
                type="button"
                onClick={() => setTryOut(runSkill(open.id, tryInput))}
              >
                Try it
              </button>
              {tryOut && <p className="try-out">{tryOut}</p>}
              <div className="tool-actions">
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setOpenId(null);
                    setTryInput("");
                    setTryOut(null);
                  }}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
        {msg && <p className="msg">{msg}</p>}
      </>
    );
  }

  return (
    <>
      <div className="howto-card">
        <h2>Skill Genie</h2>
        <p className="card-blurb">
          50 product tools. 1 skill wish unlocks 1 tool. Free Tools stay demos
          — this shelf is the wish forge.
        </p>
        <p className="drip">
          Skill wishes · {S.skillWishes} · unlocked {unlocked.size}/
          {SKILL_CATALOG.length}
        </p>
        <ol className="howto">
          <li>Buy a Skill Genie pack in Shop (PayPal)</li>
          <li>Open a locked tool · tap Unlock (1 wish)</li>
          <li>Try it with your own input</li>
        </ol>
      </div>
      <div className="hilo-bets skill-shelf-tabs" style={{ marginBottom: 12 }}>
        <button
          className={"btn" + (shelf === "all" ? "" : " ghost")}
          type="button"
          onClick={() => setShelf("all")}
        >
          All
        </button>
        {SHELVES.map((s) => (
          <button
            key={s}
            className={"btn" + (shelf === s ? "" : " ghost")}
            type="button"
            onClick={() => setShelf(s)}
          >
            {shelfLabel(s)}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((s) => {
          const on = unlocked.has(s.id);
          return (
            <div className={"row" + (on ? "" : " skill-locked")} key={s.id}>
              <div>
                <b>
                  {on ? "" : "🔒 "}
                  {s.n}. {s.name}
                </b>
                <div className="card-blurb">{s.blurb}</div>
                <div className="seal">
                  {shelfLabel(s.shelf)} · {on ? "unlocked" : "1 wish"}
                </div>
              </div>
              <button
                className="btn open-tool"
                type="button"
                onClick={() => {
                  setOpenId(s.id);
                  setTryInput("");
                  setTryOut(null);
                }}
              >
                Open
              </button>
            </div>
          );
        })}
      </div>
      {msg && <p className="msg">{msg}</p>}
    </>
  );
}
