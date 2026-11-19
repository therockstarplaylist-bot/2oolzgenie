"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { APPS } from "@/lib/catalog";
import { LampMark } from "./glyphs";

const LAMP_LINKS = [
  { href: "/lamp", label: "Forge", note: "Describe a need and forge a tool" },
  { href: "/lamp?page=market", label: "Market", note: "Look through the tool shelf" },
  { href: "/lamp?page=casino", label: "Casino", note: "Small coin games on the lamp" },
  { href: "/lamp?page=arcade", label: "Arcade", note: "Hangman and a tap game" },
  { href: "/lamp?page=tools", label: "Lamp tools", note: "Forged tools and free demos" },
  { href: "/lamp?page=shop", label: "Shop", note: "Coin packs and lamp tiers" },
  { href: "/lamp?page=profile", label: "Profile", note: "Your lamp and sign-in" },
] as const;

export function StoreFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuTitleId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const app = APPS.find((item) => pathname === `/apps/${item.slug}`);
  const section =
    pathname.startsWith("/games") || app?.category === "game"
      ? "games"
      : pathname.startsWith("/tools") || app?.category === "tool"
        ? "tools"
        : pathname.startsWith("/about") || pathname.startsWith("/privacy")
          ? "about"
          : pathname === "/"
            ? "home"
            : "";
  const brandIsHeading = pathname === "/";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  }

  const brand = (
    <>
      <LampMark />
      <span className="brand-text">
        <span className="brand-name">
          <span className="brand-2oolz">2oolz</span>
          <span className="brand-genie">genie</span>
        </span>
        <span className="brand-sub">App Store</span>
      </span>
    </>
  );

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="store-column">
        <header className="topbar">
          {brandIsHeading ? (
            <h1 className="brand">
              <Link href="/" aria-current="page">
                {brand}
              </Link>
            </h1>
          ) : (
            <p className="brand">
              <Link href="/">{brand}</Link>
            </p>
          )}
          <button
            type="button"
            className="menu-btn"
            aria-label="Menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <main id="content">{children}</main>
      </div>
      <nav className="tabbar" aria-label="App Store">
        <Tab href="/" label="Home" current={section === "home"}>
          <HomeIcon />
        </Tab>
        <Tab href="/games" label="Games" current={section === "games"}>
          <GamesIcon />
        </Tab>
        <Tab href="/tools" label="Tools" current={section === "tools"}>
          <ToolsIcon />
        </Tab>
        <Tab href="/about" label="About" current={section === "about"}>
          <AboutIcon />
        </Tab>
      </nav>
      <dialog
        ref={dialogRef}
        className="menu"
        aria-labelledby={menuTitleId}
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="menu-top">
          <h2 id={menuTitleId}>Menu</h2>
          <button type="button" className="menu-close" onClick={() => dialogRef.current?.close()}>
            Close
          </button>
        </div>
        <div className="menu-body">
          <ul className="menu-list">
            <li>
              <Link href="/games">Games</Link>
            </li>
            <li>
              <Link href="/tools">Tools</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
          <h3 className="menu-label">The original lamp</h3>
          <ul className="menu-list">
            {LAMP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span>{link.label}</span>
                  <small>{link.note}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}

function Tab({
  href,
  label,
  current,
  children,
}: {
  href: string;
  label: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined}>
      {children}
      <span>{label}</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GamesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="18" height="11" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5h3M9.5 11v3M16 11.5h.01M18 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 7a4 4 0 0 0-5.7 5.2L4 16.5 7.5 20l4.3-4.3A4 4 0 0 0 17 10l-2.2 2.2-2-2L14 7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6.5 19.5c1.2-3 3.1-4.5 5.5-4.5s4.3 1.5 5.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
