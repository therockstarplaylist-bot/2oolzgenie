"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import type { SyncStatus } from "./AuthControls";
import {
  applyDrip,
  applyOwnerGrant,
  load,
  normalize,
  save,
  type State,
} from "./constants";
import { mergeLampStates } from "@/lib/merge-lamp";

/**
 * Cloud sync without rewriting useGenie:
 * on Google sign-in, merge localStorage 2oolz-v2 with lamp:{email},
 * write back, PUT cloud, then soft-reload once so useGenie picks it up.
 * While signed in, periodically PUT the current local lamp.
 */
export function useCloudLampStandalone(): SyncStatus {
  const { data: session, status: authStatus } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("guest");
  const bootstrapped = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signedInEmail = session?.user?.email?.trim().toLowerCase() || "";

  useEffect(() => {
    if (authStatus === "loading") {
      setSyncStatus((s) => (s === "guest" ? "loading" : s));
      return;
    }
    if (!signedInEmail) {
      bootstrapped.current = false;
      setSyncStatus("guest");
      return;
    }

    let cancelled = false;
    (async () => {
      setSyncStatus("syncing");
      try {
        const res = await fetch("/api/lamp");
        if (cancelled) return;
        if (res.status === 503) {
          setSyncStatus("no-storage");
          const local = normalize(load());
          let next: State = { ...local, email: signedInEmail };
          const granted = applyOwnerGrant(next);
          next = granted.state;
          save(next);
          return;
        }
        if (!res.ok) {
          setSyncStatus("error");
          return;
        }
        const data = (await res.json()) as { lamp?: State | null };
        const local = normalize({ ...(load() || {}), email: signedInEmail });
        let merged = mergeLampStates(local, data.lamp ?? null);
        const granted = applyOwnerGrant(merged);
        merged = granted.state;
        const dripped = applyDrip(merged);
        merged = dripped.state;
        save(merged);

        const put = await fetch("/api/lamp", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lamp: merged, merge: false }),
        });
        if (cancelled) return;
        if (put.status === 503) {
          setSyncStatus("no-storage");
          return;
        }
        if (!put.ok) {
          setSyncStatus("error");
          return;
        }
        setSyncStatus("synced");
        bootstrapped.current = true;

        const flag = "2oolz-cloud-merged";
        const already = sessionStorage.getItem(flag);
        if (already !== signedInEmail) {
          sessionStorage.setItem(flag, signedInEmail);
          // Reload so useGenie re-reads merged localStorage once
          location.reload();
        }
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authStatus, signedInEmail]);

  useEffect(() => {
    if (!signedInEmail) return;
    if (syncStatus !== "synced") return;

    const push = () => {
      const lamp = normalize({ ...(load() || {}), email: signedInEmail });
      void fetch("/api/lamp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lamp, merge: false }),
      }).then((res) => {
        if (res.status === 503) setSyncStatus("no-storage");
        else if (!res.ok) setSyncStatus("error");
        else setSyncStatus("synced");
      });
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") push();
    };
    document.addEventListener("visibilitychange", onVis);
    const id = setInterval(push, 15000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(id);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [signedInEmail, syncStatus]);

  return syncStatus;
}
