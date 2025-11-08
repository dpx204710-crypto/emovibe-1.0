/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // 指定自定义 pages 目录
  // 注意：必须使用绝对路径
  // 这样 Next.js 会把 frontend/pages 当作 pages 目录
  experimental: {
    appDir: false,
  },
  webpack(config, options) {
    config.resolve.alias['@pages'] = path.join(__dirname, 'frontend/pages');
    return config;
  },
  // 这里是关键配置
  // 指定 pagesDir 为 frontend/pages
  // 这样 Next.js 就不会去根目录的 pages
  // 注意：Vercel 部署时必须保证这个配置存在
  // @ts-ignore
  pagesDir: path.join(__dirname, 'frontend/pages'),
};

module.exports = nextConfig;