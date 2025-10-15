import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // All domains (use with caution)
        // Or specific domains:
        // hostname: 'example.com',
      },
    ],

  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
