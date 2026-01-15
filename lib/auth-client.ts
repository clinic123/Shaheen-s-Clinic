import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { auth } from "./auth";

// Get base URL for auth client
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: always use current origin (works with any domain)
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  // Priority: NEXT_PUBLIC_BETTER_AUTH_URL > BETTER_AUTH_URL > NEXT_PUBLIC_BASE_URL
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Default to localhost for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [inferAdditionalFields<typeof auth>(), adminClient(), nextCookies()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  forgetPassword,
  updateUser,
} = authClient;
