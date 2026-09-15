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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F3EDE2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

// ── JSON-LD: single @graph for all site-level schemas ──────────────────
// Fewer DOM nodes, helps crawlers correlate entities, and avoids the
// "which script is authoritative?" problem of multiple blocks.

const siteUrl = 'https://kanishkanamdeo.com';

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
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Kanishka Namdeo | Product Manager | Dubai, UAE',
      description: metadata.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Kanishka Namdeo',
      jobTitle: 'Product Manager',
      url: siteUrl,
      email: 'mailto:kanishkanamdeo@hotmail.com',
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
        {/* Custom link relations not covered by Next.js metadata API */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="Kanishka Namdeo — writing" href="/rss.xml" />
        <link rel="ai-training" type="text/plain" href="/llms.txt" />
        {/* Consolidated JSON-LD graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* First tab stop on the page: bypasses the hero's scenery for the
            first content section. Must live outside <main> to skip anything. */}
        <a href="#journey" className="skip-link">
          Skip to content
        </a>
        <ReactLenis root options={{ lerp: 0.1, syncTouch: false, anchors: { offset: -80 } }}>
          <main id="main-content">{children}</main>
        </ReactLenis>
        <Analytics />
      </body>
    </html>
  );
}
