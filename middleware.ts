import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LAMP_QUERY = ["page", "grant", "email", "claim", "paid"];

/** Old lamp links lived on /. Keep them working on /lamp. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();
  const lampLink = LAMP_QUERY.some((key) => request.nextUrl.searchParams.has(key));
  if (!lampLink) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/lamp";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
