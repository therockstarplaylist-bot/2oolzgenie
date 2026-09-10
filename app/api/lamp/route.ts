import { auth } from "@/auth";
import { mergeLampStates, normalize, type State } from "@/components/constants";
import {
  isRedisConfigured,
  readLamp,
  writeLamp,
} from "@/lib/lamp-store";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

async function requireEmail(): Promise<
  { email: string } | { error: NextResponse }
> {
  const session = (await auth()) as Session | null;
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { email };
}

export async function GET() {
  const gate = await requireEmail();
  if ("error" in gate) return gate.error;
  if (!isRedisConfigured()) {
    return NextResponse.json(
      {
        error: "Storage not configured",
        hint: "Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel",
      },
      { status: 503 }
    );
  }
  try {
    const lamp = await readLamp(gate.email);
    return NextResponse.json({ lamp, email: gate.email });
  } catch (e) {
    const message = e instanceof Error ? e.message : "read_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const gate = await requireEmail();
  if ("error" in gate) return gate.error;
  if (!isRedisConfigured()) {
    return NextResponse.json(
      {
        error: "Storage not configured",
        hint: "Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel",
      },
      { status: 503 }
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const payload = (body as { lamp?: Partial<State>; merge?: boolean }) || {};
  const incoming = normalize({
    ...(payload.lamp || {}),
    email: gate.email,
  });
  try {
    const existing = await readLamp(gate.email);
    const next =
      payload.merge === false
        ? incoming
        : mergeLampStates(incoming, existing);
    const saved = await writeLamp(gate.email, next);
    return NextResponse.json({
      lamp: saved,
      email: gate.email,
      merged: Boolean(existing),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "write_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
