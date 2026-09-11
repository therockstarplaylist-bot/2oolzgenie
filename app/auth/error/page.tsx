"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function AuthErrorInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main style={{ maxWidth: "28rem", margin: "0 auto", padding: "40px 16px" }}>
      <p className="seal">Auth</p>
      <h1>Sign-in failed</h1>
      <p>
        Google Sign-in did not complete. This is usually a misconfigured OAuth
        client ID/secret or redirect URI — not a Redis/Upstash issue. Sessions
        use JWT cookies and only need <code>AUTH_SECRET</code> plus Google
        credentials.
      </p>
      {error ? (
        <p className="note" style={{ marginTop: 12 }}>
          Error code: <code>{error}</code>
        </p>
      ) : null}
      <div className="tool-actions" style={{ marginTop: 20 }}>
        <Link href="/" className="btn ghost">
          Go home
        </Link>
        <button type="button" className="btn" onClick={() => signIn("google")}>
          Try again
        </button>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{ maxWidth: "28rem", margin: "0 auto", padding: "40px 16px" }}
        >
          <p className="seal">Auth</p>
          <h1>Sign-in failed</h1>
          <p>Loading…</p>
        </main>
      }
    >
      <AuthErrorInner />
    </Suspense>
  );
}
