import { WHOA_RARES } from "./wishWhoa";
import {
  DJINN_TOOLS,
  WISH_PACKS,
  WISH_TOOLS as BASE_WISH_TOOLS,
  getWishPack,
  type WishTool,
  type WishPack,
} from "./wishCatalog";

export type { WishTool, WishPack };
export { DJINN_TOOLS, WISH_PACKS, getWishPack };

/** Base Market rares + whoa rares (>=500 TC) with real runners. */
export const WISH_TOOLS: WishTool[] = [...BASE_WISH_TOOLS, ...WHOA_RARES];

export function getWishTool(id: string | undefined) {
  if (!id) return undefined;
  return (
    WISH_TOOLS.find((x) => x.id === id) ||
    DJINN_TOOLS.find((x) => x.id === id)
  );
}

export function getRunnableMeta(id: string | undefined) {
  if (!id) return undefined;
  const wish = getWishTool(id);
  if (wish) {
    return {
      id: wish.id,
      n: wish.n,
      rarity: wish.tier === "djinn" ? ("rare" as const) : ("rare" as const),
      blurb: wish.blurb,
      how: wish.how,
      body: wish.body,
      hint: wish.hint,
      tags: wish.tags,
      cost: wish.cost,
      paid: true as const,
      tier: wish.tier,
    };
  }
  return undefined;
}

export const ALL_PAID_RUNNER_IDS = [
  ...WISH_TOOLS.map((t) => t.id),
  ...DJINN_TOOLS.map((t) => t.id),
  "jwt-lite",
  "swiss",
] as const;
