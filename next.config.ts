import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // This is the magic line for Next.js 16
    ignoreBuildErrors: true,
  },
  eslint: {
    // This tells it to skip the linting check
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
