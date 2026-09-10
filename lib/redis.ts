import { Redis } from "@upstash/redis";

/** Prefer Upstash; also accept Vercel KV REST vars. */
export function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function lampKey(email: string) {
  return `lamp:${email.trim().toLowerCase()}`;
}
