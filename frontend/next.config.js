/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ 修复路径、404 等问题的关键配置
  output: 'standalone',
  trailingSlash: false,

  // ✅ 允许跨域加载资源（可选）
  images: {
    domains: ['localhost', 'vercel.app'],
  },

  // ✅ 如果你要在前端用环境变量，可以在这里配置
  env: {
    NEXT_PUBLIC_APP_NAME: 'EmoVibe',
  }
};

module.exports = nextConfig;