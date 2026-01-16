import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

// Get base URL for auth client
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: always use current origin (works with any domain)
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  // Default to localhost for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),

  plugins: [
    // Note: inferAdditionalFields removed to prevent server code bundling in client
    // Types are already defined in types/better-auth.d.ts
    adminClient(),
  ],
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

  updateUser,
} = authClient;
