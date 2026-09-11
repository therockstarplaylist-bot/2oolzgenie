# 2oolz Genie

Next.js App Router port of [2oolzgenie.com](https://www.2oolzgenie.com/) — forge, market, casino lobby, arcade, tools, shop, profile.

Guest mode keeps the lamp in browser `localStorage` (`2oolz-v2`). **Sign in with Google** syncs TC, tools, tier, wishes, drip, and ownerGrant to the cloud keyed by Google email.

## Google accounts + cloud lamp

**Sign-in uses JWT sessions** — Auth.js does **not** need Redis/Upstash. You only need `AUTH_SECRET` + Google OAuth vars. Upstash is optional and only powers cross-device lamp sync via `/api/lamp`.

1. **Google Cloud OAuth client**
   - Create an OAuth 2.0 Client ID (Web application).
   - Authorized JavaScript origins: `https://www.2oolzgenie.com`, `http://localhost:3000`
   - Authorized redirect URIs:
     - `https://www.2oolzgenie.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
2. **Upstash Redis** (optional — free tier is fine)
   - Only needed for cross-device lamp sync. Without it, Sign-in still works; lamp stays local / sync shows "Cloud off".
   - Create a database → copy REST URL + token.
3. **Vercel project env** (Settings → Environment Variables) — paste these, then redeploy:

| Variable | Required? | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | **Yes** (Sign-in) | Random secret (`npx auth secret` or `openssl rand -base64 32`) |
| `AUTH_URL` | Recommended | `https://www.2oolzgenie.com` |
| `AUTH_GOOGLE_ID` | **Yes** (Sign-in) | Google OAuth client ID (alias: `GOOGLE_CLIENT_ID`; trimmed) |
| `AUTH_GOOGLE_SECRET` | **Yes** (Sign-in) | Google OAuth client secret (alias: `GOOGLE_CLIENT_SECRET`; trimmed) |
| `UPSTASH_REDIS_REST_URL` | Optional (sync) | Upstash REST URL (or `KV_REST_API_URL`) |
| `UPSTASH_REDIS_REST_TOKEN` | Optional (sync) | Upstash REST token (or `KV_REST_API_TOKEN`) |

Auth error page: `/auth/error` (shows the Auth.js `error` query param when Sign-in fails).

4. Open the site → **Sign in with Google** (header or Profile). First login merges local `2oolz-v2` into `lamp:{email}`:
   - coins = max(local, cloud)
   - tools = union deduped by `name+time`
   - tier = higher of the two
   - wishes / skillWishes / ownerGrant = max / OR
   - `passiveAt` = later of the two (coherent drip)

API: `GET` / `PUT` `/api/lamp` (session required). Auth: `/api/auth/[...nextauth]`.

## Owner lamp grant

One-time +1000 TC for `therockstarplaylist@gmail.com`:

- `https://www.2oolzgenie.com/?grant=1000&email=therockstarplaylist@gmail.com`
- Or Profile → Claim lamp / Sign in with that Google account

## Tools

Nav **tools** with Library | Free tools | Skill Genie. Free shelf demos Open without TC. Skill Genie has 50 unlockable product tools (1 `skillWish` each). Forged/kept tools have Open + detail panel.

## Skill Genie packs

Wish currency for the **Skill Genie** tools shelf (separate from daily casino `wishes` and TC):

| Pack id | Wishes | Price |
| --- | --- | --- |
| `spark` | 3 | $5 |
| `coil` | 10 | $12 |
| `seal` | 25 | $29 |
| `lattice` | 60 | $69 |
| `apex` | 120 | $129 |

1 skill wish unlocks 1 catalog tool into your library (`skillId`). Free Tools remain demos. State field: `skillWishes` (default 0). PayPal return credits the pack the same way as coin packs (`?paid=<packId>`).

## Casino

Lobby grid (UELG:CASINO_01 . house ~20%): wheel, slots, drop, High/Low, Face-down 52, flip, dice, lucky, doors, roulette, ladder, memory, scratch. All underpay vs fair odds.

## Run

```bash
cp .env.example .env.local
# fill AUTH_SECRET + AUTH_GOOGLE_* for Sign-in (JWT; no Redis)
# fill UPSTASH_* only if you want cross-device lamp sync; guest mode works without any of these
npm install && npm run dev
```
