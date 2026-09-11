import type { State, Tool } from "@/components/constants";
import { normalize } from "@/components/constants";

const TIER_RANK: Record<string, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  ultimate: 3,
  lifetime: 4,
};

export function higherTier(a: string, b: string): string {
  return (TIER_RANK[a] ?? 0) >= (TIER_RANK[b] ?? 0) ? a : b;
}

/** Merge local browser lamp with cloud lamp (first sync / PUT with merge). */
export function mergeLampStates(local: State, cloud: State | null): State {
  if (!cloud) return normalize(local);
  const seen = new Set<string>();
  const tools: Tool[] = [];
  for (const t of [...(cloud.tools || []), ...(local.tools || [])]) {
    const key = `${t.n}|${t.t}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tools.push(t);
  }
  tools.sort((a, b) => b.t - a.t);
  const email =
    (local.email || cloud.email || "").trim().toLowerCase() || undefined;
  return normalize({
    ...cloud,
    ...local,
    coins: Math.max(Number(local.coins) || 0, Number(cloud.coins) || 0),
    tools,
    tier: higherTier(local.tier || "free", cloud.tier || "free"),
    wishes: Math.max(Number(local.wishes) || 0, Number(cloud.wishes) || 0),
    skillWishes: Math.max(Number(local.skillWishes) || 0, Number(cloud.skillWishes) || 0),
    ownerGrant: Boolean(local.ownerGrant || cloud.ownerGrant),
    passiveAt: Math.max(
      Number(local.passiveAt) || 0,
      Number(cloud.passiveAt) || 0
    ) || Date.now(),
    email,
    loss: Math.max(Number(local.loss) || 0, Number(cloud.loss) || 0),
    earn: Math.max(Number(local.earn) || 0, Number(cloud.earn) || 0),
    page: local.page || cloud.page,
  });
}
