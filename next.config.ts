import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  // Exclude server-only packages from client bundling
  serverExternalPackages: [
    "bcryptjs",
    "better-auth",
    "@prisma/client",
    "prisma",
  ],
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  skipTrailingSlashRedirect: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
    };

    // Exclude server-only packages from client-side bundling
    if (!isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push(
          "bcryptjs",
          "better-auth",
          "@prisma/client",
          "prisma"
        );
      } else if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = [
          ...(Array.isArray(originalExternals) ? originalExternals : []),
          ({ request }: { request: string }) => {
            if (
              request &&
              (request.includes("bcryptjs") ||
                request.includes("better-auth") ||
                request.includes("@prisma/client") ||
                request.includes("prisma") ||
                request.startsWith("node:"))
            ) {
              return true;
            }
          },
        ];
      }
    }

    return config;
  },
};

export default nextConfig;
