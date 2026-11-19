import Link from "next/link";
import { GameScroller, Hero, SectionHead, ToolRow, TopPicks } from "@/components/store/cards";
import { featuredApp, games, homeTools } from "@/lib/catalog";

export default function StoreHomePage() {
  const featured = featuredApp();
  const toolApps = homeTools();
  return (
    <>
      <Hero app={featured} />
      <TopPicks />
      <SectionHead id="games-heading" title="Games" href="/games" />
      <GameScroller apps={games()} />
      <SectionHead id="tools-heading" title="Tools" href="/tools" />
      <ul className="tool-list" aria-labelledby="tools-heading">
        {toolApps.map((app) => (
          <ToolRow key={app.slug} app={app} />
        ))}
      </ul>
      <p className="home-foot">
        <span>Free indie apps from Brandon. Not from Google Play.</span>
        <Link href="/privacy">Privacy Policy</Link>
      </p>
    </>
  );
}
