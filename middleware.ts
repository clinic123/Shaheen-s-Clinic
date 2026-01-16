import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for:
  // - API routes (including auth callbacks)
  // - Static files
  // - Public routes (login, signup, etc.)
  // - Auth callback routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/success") ||
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/blogs") ||
    pathname.startsWith("/books") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/facilities") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/notices") ||
    pathname.startsWith("/research") ||
    pathname.startsWith("/scope") ||
    pathname.startsWith("/teams") ||
    pathname.startsWith("/workshops") ||
    pathname.startsWith("/consulting") ||
    pathname.startsWith("/clinic") ||
    pathname.startsWith("/dr-shaheen") ||
    pathname.startsWith("/international") ||
    pathname.startsWith("/forum")
  ) {
    return NextResponse.next();
  }

  // For protected routes, check session
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is authenticated
    if (!session?.user?.id) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // If session check fails, allow the request to proceed
    // (better to allow than to block legitimate requests)
    console.error("Middleware session check error:", error);
    return NextResponse.next();
  }
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
