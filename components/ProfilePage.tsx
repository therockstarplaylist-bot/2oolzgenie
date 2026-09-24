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
import { WishAwareToolPanel as RealToolPanel } from "./WishAwareToolPanel";
import { getWishTool } from "./wishCatalog";

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
