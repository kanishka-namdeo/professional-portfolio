import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import ScrollNav from '@/components/ScrollNav';
import Footer from '@/components/Footer';

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
  title: 'Kanishka Namdeo | Product Manager & Leader | Dubai, UAE',
  description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products. Led 8x ARR growth, 30K+ user acquisition, and 50+ location expansion. Expert in product strategy, NLP/LLM, and enterprise solutions.',
  keywords: ['product manager', 'product management', 'Dubai', 'UAE', 'SaaS', 'mobility', 'AI', 'NLP', 'LLM', 'enterprise software', 'startup', 'robotics', '9 years experience', 'ARR growth', 'user acquisition'],
  authors: [{ name: 'Kanishka Namdeo' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  openGraph: {
    type: 'profile',
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
        alt: 'Kanishka Namdeo - Product Manager Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@kanishkanamdeo',
    title: 'Kanishka Namdeo | Product Manager & Leader',
    description: 'Product Manager with 9+ years experience building and scaling SaaS, mobility, and AI products.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://kanishkanamdeo.com',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans">
        <Navigation />
        <ScrollNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
