import { FORGE } from "./constants";

/** Spend TC for a forge, or consume one invite free-forge perk. */
export function takeForgePayment(
  freeForge: number | undefined,
  spend: (n: number) => boolean,
): { ok: boolean; useFree: boolean; nextFreeForge: number } {
  const cur = freeForge || 0;
  const useFree = cur > 0;
  if (!useFree && !spend(FORGE)) {
    return { ok: false, useFree: false, nextFreeForge: cur };
  }
  return {
    ok: true,
    useFree,
    nextFreeForge: useFree ? Math.max(0, cur - 1) : cur,
  };
}
