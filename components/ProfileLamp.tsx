"use client";
import { useState } from "react";
import { AuthControls, type SyncStatus } from "./AuthControls";
import { formatCount } from "@/lib/coins";
import { OWNER_EMAIL, type State } from "./constants";

export function ProfilePage({
  S,
  hourly,
  goShop,
  claimLamp,
  syncStatus,
}: {
  S: State;
  hourly: number;
  goShop: () => void;
  claimLamp: (email: string) => void;
  syncStatus?: string;
}) {
  const [email, setEmail] = useState(S.email || "");
  return (
    <>
      <p className="seal">UELG:PROFILE_01</p>
      <h1>Lamp</h1>
      <p className="drip">
        Tier {S.tier} . +{hourly} TC / hour . {S.wishes} wishes
      </p>
      <p className="note">
        Sync: {syncStatus || "guest"} . Guest play stays in this browser until
        you sign in with Google.
      </p>
      <div style={{ marginBottom: 12 }}>
        <AuthControls syncStatus={(syncStatus as SyncStatus) || "guest"} />
      </div>
      <button className="btn" type="button" onClick={goShop}>
        Open Shop
      </button>
      <h2>Email / claim</h2>
      <p className="note">
        Sign in with Google to cloud-save your lamp. The older claim still adds 1,000 TC once for {OWNER_EMAIL}. Signing in as that Google account also tops the lamp up to {formatCount(999_999_999)} TC once. Typing the address here does not grant that top-up.
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
