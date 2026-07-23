import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore build errors from empty placeholder files in other customer routes
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
