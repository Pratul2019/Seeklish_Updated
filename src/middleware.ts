import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  if (request.nextUrl.pathname.startsWith(`${process.env.NEXT_PUBLIC_API_URL}/RestoreUser`)) {
    if (!referer.includes("/api/auth/callback/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/RestoreUser/:path*",
  ],
};
