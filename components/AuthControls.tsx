"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export type SyncStatus =
  | "guest"
  | "loading"
  | "syncing"
  | "synced"
  | "error"
  | "no-storage";

export function AuthControls({ syncStatus }: { syncStatus: SyncStatus }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="seal auth-sync">Auth…</span>;
  }

  if (!session?.user) {
    return (
      <button
        className="buy"
        type="button"
        onClick={() => signIn("google")}
        title="Sign in to sync your lamp across devices"
      >
        Sign in with Google
      </button>
    );
  }

  const label =
    syncStatus === "syncing"
      ? "Syncing…"
      : syncStatus === "synced"
        ? "Synced"
        : syncStatus === "error"
          ? "Sync error"
          : syncStatus === "no-storage"
            ? "Cloud off"
            : syncStatus === "loading"
              ? "Loading…"
              : "Signed in";

  return (
    <div className="auth-bar">
      {session.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="auth-avatar"
          src={session.user.image}
          alt=""
          width={28}
          height={28}
          referrerPolicy="no-referrer"
        />
      ) : null}
      <span className="seal auth-email" title={session.user.email || ""}>
        {session.user.email || session.user.name || "Account"}
      </span>
      <span className="seal auth-sync">{label}</span>
      <button className="buy" type="button" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
