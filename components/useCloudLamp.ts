"use client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SyncStatus } from "./AuthControls";
import {
  applyDrip,
  applyOwnerGrant,
  normalize,
  save,
  type State,
} from "./constants";
import { mergeLampStates } from "@/lib/merge-lamp";

export function useCloudLamp(opts: {
  ready: boolean;
  stateRef: React.MutableRefObject<State>;
  setS: (s: State) => void;
  setPayNote: (n: string) => void;
  setMsg: (m: string) => void;
  setLastDrip: (n: number) => void;
}) {
  const { ready, stateRef, setS, setPayNote, setMsg, setLastDrip } = opts;
  const { data: session, status: authStatus } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("guest");
  const cloudSyncedRef = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signedInEmail = session?.user?.email?.trim().toLowerCase() || "";

  const pushCloud = useCallback(
    async (next: State, merge = false) => {
      if (!signedInEmail) return;
      try {
        setSyncStatus((s) => (s === "no-storage" ? s : "syncing"));
        const res = await fetch("/api/lamp", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lamp: next, merge }),
        });
        if (res.status === 503) {
          setSyncStatus("no-storage");
          return;
        }
        if (!res.ok) {
          setSyncStatus("error");
          return;
        }
        const data = (await res.json()) as { lamp?: State };
        if (data.lamp) {
          const normalized = normalize({ ...data.lamp, email: signedInEmail });
          stateRef.current = normalized;
          setS(normalized);
          save(normalized);
        }
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      }
    },
    [signedInEmail, setS, stateRef]
  );

  const persist = useCallback(
    (next: State) => {
      const withEmail = signedInEmail
        ? { ...next, email: signedInEmail }
        : next;
      stateRef.current = withEmail;
      setS(withEmail);
      save(withEmail);
      if (signedInEmail && cloudSyncedRef.current) {
        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => {
          void pushCloud(stateRef.current, false);
        }, 600);
      }
    },
    [signedInEmail, pushCloud, setS, stateRef]
  );

  useEffect(() => {
    if (!ready) return;
    if (authStatus === "loading") {
      setSyncStatus((s) => (s === "guest" ? "loading" : s));
      return;
    }
    if (!signedInEmail) {
      cloudSyncedRef.current = false;
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
          let next: State = { ...stateRef.current, email: signedInEmail };
          const granted = applyOwnerGrant(next);
          next = granted.state;
          stateRef.current = next;
          setS(next);
          save(next);
          if (granted.granted) {
            setPayNote("+1000 TC.");
            setMsg("+1000 TC.");
          }
          return;
        }
        if (!res.ok) {
          setSyncStatus("error");
          return;
        }
        const data = (await res.json()) as { lamp?: State | null };
        const local: State = { ...stateRef.current, email: signedInEmail };
        const merged = mergeLampStates(local, data.lamp ?? null);
        const granted = applyOwnerGrant(merged);
        let next: State = granted.state;
        const dripped = applyDrip(next);
        next = dripped.state;
        if (dripped.gained) setLastDrip(dripped.gained);
        stateRef.current = next;
        setS(next);
        save(next);
        cloudSyncedRef.current = true;
        const put = await fetch("/api/lamp", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lamp: next, merge: false }),
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
        if (granted.granted) {
          setPayNote("+1000 TC.");
          setMsg("+1000 TC.");
        }
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    ready,
    authStatus,
    signedInEmail,
    setS,
    setPayNote,
    setMsg,
    setLastDrip,
    stateRef,
  ]);

  return { syncStatus, persist, signedInEmail };
}
