/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  trailingSlash: true
};

module.exports = nextConfig;