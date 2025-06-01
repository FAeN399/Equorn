/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@equorn/core'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
