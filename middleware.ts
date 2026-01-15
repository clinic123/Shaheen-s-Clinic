import type { Session } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/auth", "/forgot-password", "/reset-password", "/login"];
const protectedRoutes = [
  "/dashboard",
  "/checkout",
  "/profile",
  "/admin",
  "/doctor",
];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get the session - use auth API directly instead of betterFetch
  let session: Session | null = null;
  try {
    // Import auth dynamically to avoid issues
    const { auth } = await import("@/lib/auth");
    const sessionResult = await auth.api.getSession({
      headers: request.headers,
    });
    
    // Only consider it a valid session if it has a user with an id
    if (sessionResult?.user?.id) {
      session = sessionResult;
    }
  } catch (error) {
    // If session fetch fails, treat as no session
    console.error("Middleware session check error:", error);
    session = null;
  }

  // If user is not authenticated and trying to access protected route
  if (!session?.user && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // If user is authenticated and trying to access auth page
  if (session?.user && isPublicRoute) {
    // Redirect to dashboard or role-based default
    const roleRedirects: Record<string, string> = {
      admin: "/admin/",
      doctor: "/doctor/",
      user: "/dashboard",
    };

    const role = session.user.role;
    const redirectUrl = (role && roleRedirects[role]) || "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
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
