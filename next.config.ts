/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true, // 💥 Ignore lint errors in Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // 💥 Ignore TS errors in Vercel
  },
};

export default nextConfig;
