import type { Metadata } from "next";
import { GameCard } from "@/components/store/cards";
import { games } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Games",
  description: "Free Android games from Brandon: Deep Dive, Big Drop, and Game Lab.",
};

export default function GamesPage() {
  return (
    <>
      <div className="page-intro">
        <h1>Games</h1>
        <p>Three free Android games. Tap one for screenshots and the download.</p>
      </div>
      <ul className="game-grid">
        {games().map((app) => (
          <GameCard key={app.slug} app={app} layout="wide" />
        ))}
      </ul>
    </>
  );
}
