import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Verify application types during production builds.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
