# 2oolz Genie (Next.js)

UELG lamp app: forge tools, market drops, casino / arcade, **Tools** (Free utilities + Skill Genie), shop, profile.

## Stack

- Next.js App Router + Auth.js (Google) with **JWT sessions** (no Redis required for Sign-in)
- Optional Upstash Redis for cross-device lamp sync (`/api/lamp`)

## Env

Copy `.env.example` → `.env.local`:

- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL` / `NEXTAUTH_URL`
- Optional: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (lamp sync only)

Auth error page: `/auth/error` (shows the Auth.js `error` query param when Sign-in fails).

## Lamp sync

When signed in, local `2oolz-v2` merges with cloud:

- coins = max(local, cloud)
- tools = union deduped by `name+time`
- tier = higher of the two
- wishes / skillWishes / ownerGrant = max / OR
- `passiveAt` = later of the two (coherent drip)

API: `GET` / `PUT` `/api/lamp` (session required). Auth: `/api/auth/[...nextauth]`.

## Owner grant

One-time +1000 TC for `therockstarplaylist@gmail.com`:

- Claim email on Profile, or sign in with that Google account (auto-claim in `useGenie` / cloud merge).

## Tools

Nav **tools** (header shortcut always visible) with **Library | Free tools | Skill Genie**.

- **Free tools (≥20):** real client-side utilities (JSON, Base64, UUID, password, SHA-256, diff, regex, tip calc, …). Open → fields → Run → copyable output. No TC.
- **Skill Genie (50):** wish-unlock product tools (`skillWishes`). Buy packs in Shop (PayPal). 1 wish unlocks 1 tool; each has `run(input)`.
- Library holds forged / added / unlocked tools with Open panels.

## Dev

```bash
npm install
npm run build
npm run dev
```
