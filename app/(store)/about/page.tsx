import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "The 2oolzgenie App Store is Brandon's shelf of free Android apps and one Windows tool.",
};

const LAMP = [
  { href: "/lamp", label: "Forge", note: "Describe a need and forge a tool." },
  { href: "/lamp?page=market", label: "Market", note: "Look through the tool shelf." },
  { href: "/lamp?page=casino", label: "Casino", note: "Chip games. Coins buy chips. Nothing pays real money." },
  { href: "/lamp?page=arcade", label: "Arcade", note: "Seven small games. Sound stays off until you turn it on." },
  { href: "/lamp?page=tools", label: "Lamp tools", note: "Tools you forged, plus a few free demos." },
  { href: "/lamp?page=shop", label: "Shop", note: "Coin packs and lamp tiers for the genie site." },
  { href: "/lamp?page=profile", label: "Profile", note: "Your lamp, sign-in, and the owner grant." },
] as const;

export default function AboutPage() {
  return (
    <div className="plain">
      <h1>About</h1>
      <p>
        2oolzgenie App Store is Brandon&apos;s shelf for his own apps. Everything here is free.
        The Android apps are indie builds. They are not from Google Play. Lamp coins are only for the
        games on the lamp. They are not cash.
      </p>
      <h2>On this store</h2>
      <ul className="link-list">
        <li>
          <Link href="/games">
            Games
            <small>Deep Dive, Big Drop, Game Lab, Dream Lake, and Sovereign Campus</small>
          </Link>
        </li>
        <li>
          <Link href="/tools">
            Tools
            <small>World Launcher, PhoneBridge, Winning Research Lab, and Avatar Maker</small>
          </Link>
        </li>
        <li>
          <Link href="/privacy">
            Privacy Policy
            <small>What the apps do, and do not, collect</small>
          </Link>
        </li>
      </ul>
      <h2>The original lamp</h2>
      <p>
        The older 2oolz Genie site is still here. It is separate from these downloads. Signing in
        there is only for the lamp.
      </p>
      <ul className="link-list">
        {LAMP.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              {item.label}
              <small>{item.note}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
