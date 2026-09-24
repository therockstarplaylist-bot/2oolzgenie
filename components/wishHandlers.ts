"use client";
import { getWishPack, getWishTool } from "./wishCatalog";
import type { State } from "./constants";

type Deps = {
  spend: (n: number) => boolean;
  softNeedCoins: (n: number) => void;
  persist: (s: State) => void;
  stateRef: { current: State };
  setMsg: (m: string) => void;
  setBuyNudge: (v: null) => void;
  go: (tab: string) => void;
};

export function makeWishHandlers({
  spend,
  softNeedCoins,
  persist,
  stateRef,
  setMsg,
  setBuyNudge,
  go,
}: Deps) {
  const onWishBuy = (wishId: string) => {
    const wish = getWishTool(wishId);
    if (!wish) return setMsg("Unknown wish.");
    const cur = stateRef.current;
    if (cur.tools.some((t) => t.freeId === wish.id)) return setMsg("Already unlocked.");
    if (!spend(wish.cost)) return softNeedCoins(wish.cost);
    const after = stateRef.current;
    persist({
      ...after,
      tools: [
        { n: wish.n, r: wish.tier === "djinn" ? "djinn" : "wish", t: Date.now(), freeId: wish.id },
        ...after.tools,
      ],
    });
    setBuyNudge(null);
    setMsg("Unlocked · " + wish.n + " · " + wish.cost + " TC.");
    go("tools");
  };

  const onWishPackBuy = (packId: string) => {
    const pack = getWishPack(packId);
    if (!pack) return setMsg("Unknown pack.");
    const cur = stateRef.current;
    if ((cur.ownedPacks || []).includes(pack.id))
      return setMsg("Already own this pack — install tools under Tools.");
    if (!spend(pack.cost)) return softNeedCoins(pack.cost);
    const after = stateRef.current;
    persist({ ...after, ownedPacks: [...(after.ownedPacks || []), pack.id] });
    setBuyNudge(null);
    setMsg("Pack sealed · " + pack.n + " · open Tools to install one-at-a-time.");
    go("tools");
  };

  const installWishPackTool = (packId: string, toolId: string) => {
    const pack = getWishPack(packId);
    if (!pack || !pack.toolIds.includes(toolId)) return setMsg("Tool not in this pack.");
    const cur = stateRef.current;
    if (!(cur.ownedPacks || []).includes(packId)) return setMsg("Buy the pack first.");
    if (cur.tools.some((t) => t.freeId === toolId)) return setMsg("Already installed.");
    const meta = getWishTool(toolId);
    if (!meta) return setMsg("Unknown tool.");
    persist({
      ...cur,
      tools: [
        { n: meta.n, r: "wish", t: Date.now(), freeId: toolId, packId },
        ...cur.tools,
      ],
    });
    setMsg("Installed · " + meta.n);
  };

  return { onWishBuy, onWishPackBuy, installWishPackTool };
}
