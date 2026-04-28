import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  // Allow auth pages through unauthenticated.
  if (
    nextUrl.pathname === "/admin/login" ||
    nextUrl.pathname === "/admin/check-email"
  ) {
    return NextResponse.next();
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    const isAdmin = (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin;
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", nextUrl.origin);
      loginUrl.searchParams.set("from", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
