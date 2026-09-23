import type { Metadata } from "next";
import Link from "next/link";
import { SprintPayButton } from "@/components/SprintPayButton";

export const metadata: Metadata = {
  title: "Founder Clarity Sprint · $297 — 2oolz Genie",
  description:
    "90-minute Founder Clarity Sprint: five Genie skill passes on your real problem. Ranked plan + kill criteria. Pay $297 via PayPal.",
};

const BOOK_MAIL =
  "mailto:theopenmindfold@gmail.com?subject=Founder%20Clarity%20Sprint%20%E2%80%94%20book%20after%20PayPal&body=I%20paid%20%24297%20via%20PayPal.%0A%0ATimezone%3A%0A%0AMy%20situation%20(5%20sentences)%3A%0A";

export default async function SprintPage({
  searchParams,
}: {
  searchParams?: Promise<{ paid?: string }>;
}) {
  const sp = (await searchParams) || {};
  const paid = sp.paid === "sprint297";

  return (
    <main>
      <p className="seal">Toolz Genie · Path A</p>
      <h1>Founder Clarity Sprint</h1>
      <p>
        In 90 minutes we run five Genie skills on your actual mess. You leave
        with a ranked plan and kill switches — not another vibe chat.
      </p>

      {paid ? (
        <div className="wish" style={{ margin: "16px 0" }}>
          Payment received (or returned from PayPal). Email{" "}
          <strong>theopenmindfold@gmail.com</strong> with your timezone + 5
          sentences on your situation to book the 90-min slot.
        </div>
      ) : null}

      <p
        style={{
          fontSize: "2rem",
          color: "var(--coin)",
          fontWeight: 700,
          margin: "16px 0",
          fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        $297{" "}
        <span style={{ fontSize: "1rem", color: "var(--mu)", fontWeight: 500 }}>
          USD · one session
        </span>
      </p>

      <div className="paybox">
        <h2 style={{ color: "var(--fg)" }}>You get</h2>
        <ul className="howto">
          <li>90-minute live session (Google Meet / Discord)</li>
          <li>
            Five structured Skill Genie passes on <em>your</em> problem
          </li>
          <li>Deliverable pack: P0/P1/P2, kill criteria, 7-day action list</li>
          <li>One async check-in within 7 days</li>
        </ul>
      </div>

      <div className="note">
        <strong style={{ color: "var(--fg)" }}>Best for</strong>
        <p style={{ margin: "8px 0 0" }}>
          Solo founders and indie hackers stuck on what to build, cut, or ship
          next.
        </p>
      </div>

      <div className="grid" style={{ marginTop: 20, gap: 10 }}>
        <SprintPayButton />
        <a className="btn ghost" href={BOOK_MAIL}>
          Email to book your slot
        </a>
      </div>

      <div className="tool-panel" style={{ marginTop: 28 }}>
        <h2>How payment works</h2>
        <ol className="howto">
          <li>
            Tap <strong>Pay $297 with PayPal</strong> — opens official PayPal
            checkout (card or PayPal balance).
          </li>
          <li>Pay as a purchase / Goods &amp; Services when asked.</li>
          <li>
            After paying, email{" "}
            <code style={{ color: "var(--coin)" }}>
              theopenmindfold@gmail.com
            </code>{" "}
            with timezone + 3–5 sentences on your situation.
          </li>
          <li>You get a calendar invite within 24 hours.</li>
        </ol>
      </div>

      <p className="drip" style={{ marginTop: 32 }}>
        Adult professional services. No medical, legal, or investment advice.
      </p>
      <p style={{ marginTop: 16 }}>
        <Link href="/" style={{ color: "var(--accent)" }}>
          ← Back to 2oolz Genie
        </Link>
      </p>
    </main>
  );
}
