import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const user = request.cookies.has("accessToken");
  // Only require authentication for the profile page
  if (!user && request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Update matcher to only include routes that require authentication
export const config = {
  matcher: ["/profile"],
};
