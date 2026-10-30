import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const proxy = (request: NextRequest) => {
  if (getSessionCookie(request)) return NextResponse.next();
  const url = new URL("/entrar", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
};

export const config = { matcher: ["/painel/:path*", "/admin/:path*"] };
