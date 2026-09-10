# 2oolz Genie

Faithful Next.js (App Router + TypeScript) port of [2oolzgenie.com](https://www.2oolzgenie.com/) — dark single-page lamp with forge, market, casino, arcade, shop, and profile.

## Stack

- Next.js App Router
- React + TypeScript
- Client-side economy in `localStorage` key `2oolz-v2`
- PayPal checkout (`lonnyyells@gmail.com`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `next build` · Output: default.
4. Deploy. Root `/` is served by the App Router (`app/page.tsx`).

No env vars required for the client lamp. PayPal return URLs use the deployed origin automatically.

## Product seals

UELG:FORGE_01 · UELG:EASE_01 · MARKET_01 · CASINO_01 · ARCADE_01 · TRADE_01

## License

Private — therockstarplaylist-bot.
