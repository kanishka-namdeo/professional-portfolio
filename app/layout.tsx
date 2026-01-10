import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ScrollNav from '@/components/ScrollNav';
import Footer from '@/components/Footer';
import SmoothScrollInit from '@/components/SmoothScrollInit';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kanishkanamdeo.com'),
  title: {
    default: 'Kanishka Namdeo | Product Manager & Leader | Dubai, UAE',
    template: '%s | Kanishka Namdeo Portfolio',
  },
  description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products. Led 8x ARR growth, 30K+ user acquisition, and 50+ location expansion. Expert in product strategy, NLP/LLM, and enterprise solutions.',
  keywords: ['product manager', 'product management', 'Dubai', 'UAE', 'SaaS', 'mobility', 'AI', 'NLP', 'LLM', 'enterprise software', 'startup', 'robotics', '9 years experience', 'ARR growth', 'user acquisition'],
  authors: [{ name: 'Kanishka Namdeo', url: 'https://kanishkanamdeo.com' }],
  creator: 'Kanishka Namdeo',
  publisher: 'Kanishka Namdeo',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'website',
    title: 'Kanishka Namdeo | Product Manager & Leader',
    description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products. Led 8x ARR growth and 30K+ user acquisition.',
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
    title: 'Kanishka Namdeo | Product Manager & Leader',
    description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products.',
    images: ['/og-image.jpg'],
  },
  facebook: {
    appId: '',
  },
  verification: {
    google: '',
    yandex: '',
  },
  alternates: {
    canonical: 'https://kanishkanamdeo.com',
    types: {
      'text/html': 'https://kanishkanamdeo.com',
    },
  },
  category: 'technology',
  formatDetection: {
    telephone: false,
    address: false,
    email: true,
  },
};

// JSON-LD Schema markup for SEO
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kanishka Namdeo Portfolio',
  url: 'https://kanishkanamdeo.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://kanishkanamdeo.com/{search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kanishka Namdeo',
  jobTitle: 'Product Manager & Leader',
  url: 'https://kanishkanamdeo.com',
  image: 'https://kanishkanamdeo.com/profile.jpg',
  sameAs: [
    'https://www.linkedin.com/in/kanishkanamdeo',
    'https://github.com/kane111',
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
  description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products. Led 8x ARR growth, 30K+ user acquisition, and 50+ location expansion.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'UAE',
  },
};

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Kanishka Namdeo - Product Management Consulting',
  url: 'https://kanishkanamdeo.com',
  description: 'Product management consulting services including product strategy, growth optimization, AI/LLM integration, and enterprise software development.',
  areaServed: 'Worldwide',
  serviceType: 'Product Management Consulting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          // Prevent auto-scroll on page load - runs immediately
          (function() {
            // Store the scroll position
            const scrollY = window.scrollY || 0;
            
            // If there's a hash in the URL, remove it immediately
            if (window.location.hash) {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            
            // Force scroll to top immediately
            if (scrollY !== 0) {
              window.scrollTo(0, 0);
            }
            
            // Prevent any auto-scrolling for the first 500ms
            let preventScroll = true;
            const originalScrollTo = window.scrollTo;
            window.scrollTo = function() {
              if (!preventScroll) {
                originalScrollTo.apply(window, arguments);
              }
            };
            
            setTimeout(function() {
              preventScroll = false;
              window.scrollTo = originalScrollTo;
              document.documentElement.classList.add('smooth-scroll');
            }, 500);
          })();
        ` }} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kanishka Portfolio" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="description" content={metadata.description || ''} />
        <meta name="keywords" content={Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : (metadata.keywords || '')} />
        {/* Open Graph */}
        <meta property="og:title" content={(metadata.openGraph?.title as string) || ''} />
        <meta property="og:description" content={(metadata.openGraph?.description as string) || ''} />
        <meta property="og:type" content={(metadata.openGraph as { type?: string })?.type || 'website'} />
        <meta property="og:url" content={(metadata.openGraph?.url as string) || ''} />
        <meta property="og:site_name" content={(metadata.openGraph?.siteName as string) || ''} />
        <meta property="og:locale" content={(metadata.openGraph?.locale as string) || 'en_US'} />
        {Array.isArray(metadata.openGraph?.images) && (metadata.openGraph?.images as Array<{ url: string; width?: number; height?: number; alt?: string }>).map((img, index) => (
          <meta key={index} property="og:image" content={img.url} />
        ))}
        {/* Twitter */}
        <meta name="twitter:card" content={((metadata.twitter as { card?: string })?.card) || 'summary_large_image'} />
        <meta name="twitter:site" content={(metadata.twitter?.site as string) || ''} />
        <meta name="twitter:creator" content={(metadata.twitter?.creator as string) || ''} />
        <meta name="twitter:title" content={(metadata.twitter?.title as string) || ''} />
        <meta name="twitter:description" content={metadata.twitter?.description as string} />
        {Array.isArray(metadata.twitter?.images) && (metadata.twitter?.images as string[]).map((img, index) => (
          <meta key={index} name="twitter:image" content={img} />
        ))}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
        <link rel="ai-training" type="text/plain" href="/llms.txt" />
        {/* SEO Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
      <body className="font-sans">
        <SmoothScrollInit />
        <Navigation />
        <ScrollNav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
