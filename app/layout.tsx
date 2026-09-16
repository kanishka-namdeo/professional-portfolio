import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { eras } from '@/data/journey';

const crimsonPro = Crimson_Pro({ subsets: ['latin'], variable: '--font-crimson-pro', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://kanishkanamdeo.com'),
  title: {
    default: 'Kanishka Namdeo | Product Manager | Dubai, UAE',
    template: '%s | Kanishka Namdeo Portfolio',
  },
  description:
    'Product Manager with 9+ years across SaaS, mobility, and AI. Led 8× ARR growth to 70K+ monthly users and 30K+ new users onboarded across 50+ locations.',
  authors: [{ name: 'Kanishka Namdeo', url: 'https://kanishkanamdeo.com' }],
  creator: 'Kanishka Namdeo',
  publisher: 'Kanishka Namdeo',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'website',
    title: 'Kanishka Namdeo | Product Manager',
    description:
      'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products. Led 8× ARR growth to 70K+ monthly users and 30K+ new users onboarded across 50+ locations.',
    siteName: 'Kanishka Namdeo Portfolio',
    locale: 'en_US',
    url: 'https://kanishkanamdeo.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kanishka Namdeo - Product Manager Portfolio Preview',
      },
      {
        url: '/profile.jpg',
        width: 400,
        height: 400,
        alt: 'Kanishka Namdeo professional headshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kanishkanamdeo',
    site: '@kanishkanamdeo',
    title: 'Kanishka Namdeo | Product Manager',
    description:
      'Product Manager with 9+ years across SaaS, mobility, and AI. 8× ARR · 70K+ monthly users · 50+ locations.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://kanishkanamdeo.com',
  },
  category: 'technology',
  // PWA, geo, and referrer tags that Next.js metadata doesn't cover natively
  other: {
    'msapplication-TileColor': '#F3EDE2',
    'msapplication-tap-highlight': 'no',
    'referrer': 'strict-origin-when-cross-origin',
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai',
    'subject': 'Product Management Portfolio',
    'classification': 'Business',
    'language': 'English',
  },
  // Absolute URLs: the metadata API does not rewrite icons/manifest with
  // basePath, so root-relative values 404 on the GitHub Pages project-site
  // mirror (same reason the hand-written sitemap/rss links below are absolute).
  manifest: 'https://kanishkanamdeo.com/manifest.json',
  icons: {
    icon: [
      { url: 'https://kanishkanamdeo.com/favicon.ico', sizes: 'any' },
      { url: 'https://kanishkanamdeo.com/icon.svg', type: 'image/svg+xml' },
    ],
    apple: 'https://kanishkanamdeo.com/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  // Media-scoped so the browser chrome follows the system theme; ThemeToggle
  // keeps both metas pointed at the active palette after a manual toggle.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EDE2' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1913' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

// ── JSON-LD: single @graph for all site-level schemas ──────────────────
// Fewer DOM nodes, helps crawlers correlate entities, and avoids the
// "which script is authoritative?" problem of multiple blocks.

const siteUrl = 'https://kanishkanamdeo.com';

// JSON.stringify does not escape "/", so a string value containing "</script>"
// (or "<!--") could terminate the JSON-LD block early. All content is
// first-party today, but this keeps the hardening one refactor away from mattering.
const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Kanishka Namdeo Portfolio',
      url: siteUrl,
      description:
        'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products.',
      inLanguage: 'en',
    },
    // The WebPage node lives in app/page.tsx — a site-level graph describing
    // the homepage was wrong on /field-log and /case-study/rentlz, whose
    // canonicals differ.
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Kanishka Namdeo',
      jobTitle: 'Product Manager',
      url: siteUrl,
      email: 'kanishkanamdeo@hotmail.com',
      image: `${siteUrl}/profile.jpg`,
      description: metadata.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressCountry: 'UAE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'kanishkanamdeo@hotmail.com',
        contactType: 'professional',
        availableLanguage: ['English'],
      },
      sameAs: [
        'https://www.linkedin.com/in/kanishkanamdeo',
        'https://github.com/kanishka-namdeo',
        'https://kanishkanamdeo.medium.com',
        'https://twitter.com/kanishkanamdeo',
      ],
      knowsAbout: [
        'Product Management',
        'SaaS',
        'AI/ML',
        'NLP',
        'LLM',
        'Enterprise Software',
        'Startup Growth',
        'Mobility Solutions',
        'Robotics',
        'B2B Software',
      ],
      // Employment history from journey data — gives crawlers structured
      // career progression instead of just a flat job title. Era companies can
      // be compound ("Medulla.AI · TekIP"); Organizations take the first name.
      worksFor: eras.map((era) => ({
        '@type': 'Organization',
        name: era.company.split('·')[0].trim(),
        description: era.role,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Pre-paint theme: apply the stored (or system) choice before first
            paint so a dark user never sees a flash of the light theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('dispatches-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
        {/* Custom link relations not covered by Next.js metadata API. Absolute
            URLs: raw head HTML is not rewritten with basePath, so root-relative
            links 404 on the GitHub Pages project-site mirror. */}
        <link rel="sitemap" type="application/xml" href={`${siteUrl}/sitemap.xml`} />
        <link rel="alternate" type="application/rss+xml" title="Kanishka Namdeo — writing" href={`${siteUrl}/rss.xml`} />
        <link rel="ai-training" type="text/plain" href={`${siteUrl}/llms.txt`} />
        {/* Consolidated JSON-LD graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        {/* First tab stop on the page: bypasses the hero's scenery for the
            first content section. Must live outside <main> to skip anything. */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ReactLenis root options={{ lerp: 0.1, syncTouch: false, anchors: { offset: -80 } }}>
          {/* tabIndex={-1}: the skip link's fragment target on every route
              (unlike #journey, which only exists on the home page). */}
          <main id="main-content" tabIndex={-1}>{children}</main>
        </ReactLenis>
        {/* Vercel Analytics only where it can load: on the Pages mirror build
            (NEXT_BASE_PATH set) the script URL resolves under the project
            basePath and 404s on every pageview, so skip it there. */}
        {process.env.NEXT_BASE_PATH ? null : <Analytics />}
      </body>
    </html>
  );
}
