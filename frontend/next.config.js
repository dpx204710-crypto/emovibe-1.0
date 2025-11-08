// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // 指定自定义 pages 目录为 frontend/pages
  // 注意：必须是绝对路径
  experimental: {
    appDir: false,
  },
  webpack(config) {
    // 给别名 @pages，方便引用
    config.resolve.alias['@pages'] = path.join(__dirname, 'frontend/pages');
    return config;
  },

  // Next.js 13+ 支持的自定义 pagesDir
  // 注意：如果部署报错，请确保 Next.js 版本 >= 13
  // Vercel 会识别这个目录作为 pages
  pagesDir: path.join(__dirname, 'frontend/pages'),

  // 可选：自定义输出目录
  distDir: 'build',
};

module.exports = nextConfig;