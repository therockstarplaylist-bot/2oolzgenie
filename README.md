# 2oolz Genie

Faithful Next.js (App Router + TypeScript) port of [2oolzgenie.com](https://www.2oolzgenie.com/) — dark single-page lamp with forge, market, casino, arcade, tools, shop, and profile.

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

## Owner lamp grant

One-time +1000 TC for `therockstarplaylist@gmail.com` (localStorage; per browser):

- Visit `https://www.2oolzgenie.com/?grant=1000&email=therockstarplaylist@gmail.com`
- Or open Profile → enter that email → **Claim lamp**

## Tools

Nav includes **tools**. Open any forged/kept tool from the list (44px Open target). Empty state links to Forge / Market.

## Deploy on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `next build` · Output: default.
4. Deploy. Root `/` is served by the App Router (`app/page.tsx`).

No env vars required for the client lamp. PayPal return URLs use the deployed origin automatically.

## Product seals

UELG:FORGE_01 · UELG:EASE_01 · MARKET_01 · CASINO_01 · ARCADE_01 · TOOLS_01 · TRADE_01

## License

Private — therockstarplaylist-bot.
