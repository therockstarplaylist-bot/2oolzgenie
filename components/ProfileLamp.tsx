"use client";
import { useState } from "react";
import { AuthControls, type SyncStatus } from "./AuthControls";
import { OWNER_EMAIL, type State } from "./constants";
import { INVITE_TC, copyTextSafe } from "./inviteCopy";

export function ProfilePage({
  S,
  hourly,
  goShop,
  claimLamp,
  syncStatus,
  inviteCode,
  inviteLink,
}: {
  S: State;
  hourly: number;
  goShop: () => void;
  claimLamp: (email: string) => void;
  syncStatus?: string;
  inviteCode?: string;
  inviteLink?: string;
}) {
  const [email, setEmail] = useState(S.email || "");
  const [inviteMsg, setInviteMsg] = useState("");
  return (
    <>
      <p className="seal">UELG:PROFILE_01</p>
      <h1>Lamp</h1>
      <p className="drip">
        Tier {S.tier} . +{hourly} TC / hour . {S.wishes} wishes
        {S.freeForge ? ` . ${S.freeForge} free forge` : ""}
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

      <h2>Invite friends</h2>
      <p className="note">
        Share your invite link. A friend who redeems it once on a fresh lamp gets
        +{INVITE_TC} TC and one free forge. You cannot redeem your own code. No
        stackable farm — one redeem per lamp.
      </p>
      {inviteCode && inviteLink && (
        <div className="invite-box">
          <p className="seal">Code · {inviteCode}</p>
          <p className="card-blurb" style={{ wordBreak: "break-all" }}>
            {inviteLink}
          </p>
          <div className="tool-actions">
            <button
              className="btn"
              type="button"
              onClick={() => {
                if (copyTextSafe(inviteLink)) setInviteMsg("Invite link copied.");
                else setInviteMsg("Copy failed — select the link manually.");
              }}
            >
              Copy invite link
            </button>
          </div>
          {inviteMsg && <p className="msg">{inviteMsg}</p>}
          {S.inviteClaimed && S.referredBy && (
            <p className="drip">Redeemed invite · {S.referredBy}</p>
          )}
        </div>
      )}

      <h2>Email / claim</h2>
      <p className="note">
        Sign in with Google to cloud-save your lamp. Owner grant: claim with{" "}
        {OWNER_EMAIL} for +500,000 TC once (also applies when that Google account
        signs in).
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
