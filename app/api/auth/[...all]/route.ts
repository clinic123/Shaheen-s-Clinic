import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  const response = await handler.GET(request);
  
  // Check if this is an OAuth callback
  const url = new URL(request.url);
  if (url.pathname === "/api/auth/callback/google") {
    // If response is already a redirect, use it
    if (response.status >= 300 && response.status < 400) {
      return response;
    }
    
    // If OAuth completed successfully (200), redirect to home or dashboard
    // The callbackURL should be in the state, but if not, default to home
    if (response.status === 200) {
      // Try to get callbackURL from the state in the URL
      const state = url.searchParams.get("state");
      const callbackURL = url.searchParams.get("callbackURL") || "/";
      
      // Redirect to the callback URL
      return NextResponse.redirect(new URL(callbackURL, request.nextUrl.origin));
    }
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  return handler.POST(request);
}
