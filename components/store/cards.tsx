import Link from "next/link";
import {
  downloadHref,
  androidFile,
  type StoreApp,
} from "@/lib/catalog";
import { Glyph } from "./glyphs";

export function GameCard({
  app,
  layout = "poster",
}: {
  app: StoreApp;
  layout?: "poster" | "wide";
}) {
  return (
    <li className={layout === "wide" ? "game-item wide" : "game-item"}>
      <Link href={`/apps/${app.slug}`} className="game-card">
        <img
          className="game-card-img"
          src={app.card.src}
          alt=""
          width={layout === "wide" ? 800 : 412}
          height={layout === "wide" ? 480 : 860}
        />
        <span className="game-card-shade" aria-hidden="true" />
        {app.card.art ? <span className="art-flag">Artwork</span> : null}
        <span className="game-card-copy">
          <span className="game-card-name">{app.name}</span>
          <span className="game-card-tag" style={{ color: app.accent }}>
            <Glyph name={app.glyph} size={16} />
            <span>{app.tagline}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export function GameScroller({ apps }: { apps: readonly StoreApp[] }) {
  return (
    <ul className="game-scroller">
      {apps.map((app) => (
        <GameCard key={app.slug} app={app} />
      ))}
    </ul>
  );
}

export function ToolRow({ app }: { app: StoreApp }) {
  return (
    <li className="tool">
      <Link href={`/apps/${app.slug}`} className="tool-link">
        {app.icon ? (
          <img className="tool-icon-img" src={app.icon.src} alt="" width={48} height={48} />
        ) : (
          <span className="tool-icon" style={{ color: app.accent }} aria-hidden="true">
            <Glyph name={app.glyph} size={26} />
          </span>
        )}
        <span className="tool-text">
          <span className="tool-name">{app.name}</span>
          <span className="tool-tag">{app.tagline}</span>
        </span>
      </Link>
      <span className="free">{app.price}</span>
      <Link href={`/apps/${app.slug}`} className="get">
        Get<span className="sr-only"> {app.name}</span>
      </Link>
    </li>
  );
}

export function SectionHead({
  id,
  title,
  href,
}: {
  id: string;
  title: string;
  href: string;
}) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      <Link href={href}>
        See all<span className="sr-only"> {title}</span>
        <span aria-hidden="true"> ›</span>
      </Link>
    </div>
  );
}

export function Hero({ app }: { app: StoreApp }) {
  const file = androidFile(app);
  return (
    <article className="hero">
      <div className="hero-inner">
        <Link href={`/apps/${app.slug}`} className="hero-shot">
          <img
            src={app.card.src}
            alt={app.card.alt}
            width={412}
            height={860}
            fetchPriority="high"
          />
        </Link>
        <div className="hero-copy">
          <p className="eyebrow">Featured</p>
          <h2>
            <Link href={`/apps/${app.slug}`}>{app.name}</Link>
          </h2>
          <p className="hero-tag">{app.tagline}</p>
          <div className="hero-actions">
            <a className="dl" href={downloadHref(file)} download={file.filename}>
              <DownloadIcon />
              Download
              <span className="sr-only"> {app.name}</span>
            </a>
            <Link className="details" href={`/apps/${app.slug}`}>
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
