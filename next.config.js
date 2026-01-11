/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath and assetPrefix derived from NEXT_BASE_PATH for GitHub Pages project sites
  output: 'export',
  basePath: process.env.NEXT_BASE_PATH || '',
  assetPrefix: process.env.NEXT_BASE_PATH ? `${process.env.NEXT_BASE_PATH}/` : '',
  images: {
    unoptimized: true,
    // For static export, we can't use Next.js image optimization API
    // but next/image still provides lazy loading and proper src attributes
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
