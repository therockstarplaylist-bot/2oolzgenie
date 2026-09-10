import { normalize, type State } from "@/components/constants";
import { getRedis, lampKey } from "./redis";

export async function readLamp(email: string): Promise<State | null> {
  const redis = getRedis();
  if (!redis) throw new Error("REDIS_UNCONFIGURED");
  const raw = await redis.get<State | string>(lampKey(email));
  if (raw == null) return null;
  const parsed = typeof raw === "string" ? (JSON.parse(raw) as State) : raw;
  return normalize(parsed);
}

export async function writeLamp(email: string, state: State): Promise<State> {
  const redis = getRedis();
  if (!redis) throw new Error("REDIS_UNCONFIGURED");
  const next = normalize({
    ...state,
    email: email.trim().toLowerCase(),
  });
  await redis.set(lampKey(email), next);
  return next;
}

export function isRedisConfigured() {
  return Boolean(getRedis());
}
