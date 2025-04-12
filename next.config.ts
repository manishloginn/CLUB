/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 Ignores lint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 Ignores TypeScript errors during build
  },
};

module.exports = nextConfig;
