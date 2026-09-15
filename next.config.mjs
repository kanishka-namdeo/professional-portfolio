/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export only for GitHub Pages, not for Vercel
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,
  // basePath and assetPrefix derived from NEXT_BASE_PATH for GitHub Pages project sites
  basePath: process.env.GITHUB_ACTIONS ? (process.env.NEXT_BASE_PATH || '') : '',
  assetPrefix: process.env.GITHUB_ACTIONS && process.env.NEXT_BASE_PATH ? `${process.env.NEXT_BASE_PATH}/` : '',
  images: {
    unoptimized: process.env.GITHUB_ACTIONS,
    // For static export, we can't use Next.js image optimization API
    // but next/image still provides lazy loading and proper src attributes
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // ESM-only packages used by the contour map generator (scripts/generate-map.mjs);
  // next/jest folds these into its node_modules transformIgnorePatterns so jest can
  // transform them to CJS. Not imported by any app code, so no production impact.
  transpilePackages: ['d3-contour', 'd3-array', 'internmap', 'simplex-noise'],
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable TypeScript errors during build (use separate type-check command)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy to prevent XSS attacks.
          // - 'unsafe-eval' was removed: only dev tooling needed it and Turbopack dev works without it.
          // - 'unsafe-inline' stays in script-src because the Next.js App Router inlines
          //   flight-data <script> blocks into the HTML. Known follow-up: nonce-based CSP
          //   via middleware to drop 'unsafe-inline'.
          // - img-src is narrowed to the only remote image host in use: Medium thumbnails
          //   in the Ledger (data/ledger.ts) are served from miro.medium.com.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://miro.medium.com https://*.medium.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com; frame-ancestors 'none';"
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Prevent XSS filter from being disabled by attackers
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Permissions Policy for browser features
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
          },
          // Strict Transport Security (only for HTTPS deployments)
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }] : [])
        ],
      },
    ];
  },
};

export default nextConfig;
