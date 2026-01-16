import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware - NO AUTH CHECKS
 *
 * This middleware only handles basic routing and bypasses all auth logic.
 * Authentication checks are handled in:
 * - Server Components (using getServerSession)
 * - Route Handlers (using auth.api.getSession)
 * - Client Components (using useSession)
 *
 * This prevents deadlocks on Vercel Edge runtime when using better-auth.
 */
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Auth checks are done at the page/route level
  return NextResponse.next();
}

export const config = {
  // Middleware runs on Edge runtime by default
  // No Node.js dependencies = no deadlocks with better-auth
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - including /api/auth/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
