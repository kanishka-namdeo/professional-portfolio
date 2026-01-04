/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath and assetPrefix derived from NEXT_BASE_PATH for GitHub Pages project sites
  output: 'export',
  basePath: process.env.NEXT_BASE_PATH || '',
  assetPrefix: process.env.NEXT_BASE_PATH ? `${process.env.NEXT_BASE_PATH}/` : '',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
