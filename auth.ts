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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
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
