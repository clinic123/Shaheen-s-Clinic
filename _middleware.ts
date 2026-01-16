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
  // Middleware DISABLED for testing - will re-enable after OAuth fix
  // Middleware runs on Edge runtime by default
  // No Node.js dependencies = no deadlocks with better-auth
  matcher: [
    // Disabled - match nothing to bypass middleware
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
