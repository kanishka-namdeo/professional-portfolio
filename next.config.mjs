/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export only for GitHub Pages, not for Vercel
  output: process.env.GITHUB_ACTIONS ? 'export' : undefined,
  // basePath and assetPrefix derived from NEXT_BASE_PATH for GitHub Pages project sites
  basePath: process.env.GITHUB_ACTIONS ? (process.env.NEXT_BASE_PATH || '') : '',
  assetPrefix: process.env.GITHUB_ACTIONS && process.env.NEXT_BASE_PATH ? `${process.env.NEXT_BASE_PATH}/` : '',
  images: {
    // Boolean cast: GITHUB_ACTIONS arrives as the string "true" and Next 16
    // strict config validation rejects a string here.
    unoptimized: Boolean(process.env.GITHUB_ACTIONS),
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
  // Disable TypeScript errors during build (use separate type-check command)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Security + caching headers for all routes
  async headers() {
    // Heavy self-hosted assets are re-committed in place (no content hashing),
    // so pin nothing forever: one day fresh plus a week of stale-while-
    // revalidate still skips Vercel's default revalidate-every-request
    // round-trip on repeat views while letting updates propagate quickly.
    const assetCache = { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' };
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy to prevent XSS attacks.
          // - 'unsafe-eval' was removed: only dev tooling needed it and Turbopack dev works without it.
          // - 'unsafe-inline' stays in script-src because the Next.js App Router inlines
          //   flight-data <script> blocks into the HTML. Known follow-up: nonce-based CSP
          //   via middleware to drop 'unsafe-inline' (the theme pre-paint script and
          //   JSON-LD blocks must carry the nonce when that happens).
          // - img-src is narrowed to the only remote image host in use: Medium thumbnails
          //   in the Ledger (data/ledger.ts) are served from *.medium.com.
          // - object-src/base-uri/form-action do NOT inherit from default-src and must be
          //   spelled out; no <object>/<embed>/<form>/<base> exists in the app.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.medium.com; font-src 'self'; connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
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
          // Isolate the browsing context from cross-origin openers (XS-Leaks)
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
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
      ...['/projects/:path*', '/recordings/:path*', '/map/:path*', '/og-image.jpg', '/field-log.pdf'].map(
        (source) => ({ source, headers: [assetCache] }),
      ),
    ];
  },
};

export default nextConfig;
