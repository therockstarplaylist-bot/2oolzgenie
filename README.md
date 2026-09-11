# 2oolz Genie 

Next.js App Router port of [2oolzgenie.com](https://www.2oolzgenie.com/) — forge, market, casino lobby, arcade, tools, shop, profile.

Guest mode keeps the lamp in browser `localStorage` (`2oolz-v2`). **Sign in with Google** syncs TC, tools, tier, wishes, drip, and ownerGrant to the cloud keyed by Google email.

## Google accounts + cloud lamp

1. **Google Cloud OAuth client**
   - Create an OAuth 2.0 Client ID (Web application).
   - Authorized JavaScript origins: `https://www.2oolzgenie.com`, `http://localhost:3000`
   - Authorized redirect URIs:
     - `https://www.2oolzgenie.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
2. **Upstash Redis** (free tier is fine)
   - Create a database → copy REST URL + token.
3. **Vercel project env** (Settings → Environment Variables) — paste these, then redeploy:

| Variable | Notes |
| --- | --- |
| `AUTH_SECRET` | Random secret (`npx auth secret` or `openssl rand -base64 32`) |
| `AUTH_URL` | `https://www.2oolzgenie.com` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID (alias: `GOOGLE_CLIENT_ID`) |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret (alias: `GOOGLE_CLIENT_SECRET`) |
| `UPSTASH_REDIS_REST_URL` | Upstash REST URL (or `KV_REST_API_URL`) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST token (or `KV_REST_API_TOKEN`) |

4. Open the site → **Sign in with Google** (header or Profile). First login merges local `2oolz-v2` into `lamp:{email}`:
   - coins = max(local, cloud)
   - tools = union deduped by `name+time`
   - tier = higher of the two
   - wishes / ownerGrant = max / OR
   - `passiveAt` = later of the two (coherent drip)

API: `GET` / `PUT` `/api/lamp` (session required). Auth: `/api/auth/[...nextauth]`.

## Owner lamp grant

One-time +1000 TC for `therockstarplaylist@gmail.com`:

- `https://www.2oolzgenie.com/?grant=1000&email=therockstarplaylist@gmail.com`
- Or Profile → Claim lamp / Sign in with that Google account

## Tools

Nav **tools** with Library | Free tools. Free shelf demos Open without TC. Forged/kept tools have Open + detail panel.

## Casino

Lobby grid (UELG:CASINO_01 . house ~20%): wheel, slots, drop, High/Low, Face-down 52, flip, dice, lucky, doors, roulette, ladder, memory, scratch. All underpay vs fair odds.

## Run

```bash
cp .env.example .env.local
# fill AUTH_* and UPSTASH_* for cloud sync; guest mode works without them
npm install && npm run dev
```
 
