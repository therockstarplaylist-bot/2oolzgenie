import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId = (
  process.env.AUTH_GOOGLE_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  ""
).trim();
const googleClientSecret = (
  process.env.AUTH_GOOGLE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET ||
  ""
).trim();

if (!googleClientId || !googleClientSecret) {
  console.error(
    "[auth] Missing Google OAuth credentials. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET (or GOOGLE_CLIENT_* aliases). Redis/Upstash is not required for Sign-in — sessions use JWT cookies (AUTH_SECRET + Google vars only)."
  );
}

// Google's discovery document says the callback includes iss, but the live
// callback often does not. Auth.js then rejects it before a session exists.
// Explicit token/userinfo URLs skip that discovery check. Issuer stays so a
// callback that does include iss still matches accounts.google.com.
const google = Google({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
  authorization: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    params: { scope: "openid email profile" },
  },
  token: "https://oauth2.googleapis.com/token",
  userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
});
google.type = "oauth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [google],
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        session.user.email = session.user.email.trim().toLowerCase();
      }
      return session;
    },
  },
});
