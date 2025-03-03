import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, 
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",  // Only remove logs in production
  },
};

export default nextConfig;
