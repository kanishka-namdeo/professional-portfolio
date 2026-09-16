// app/case-study/rentlz/page.tsx
// Standalone themed home for the RentLz case study — the destination for
// direct links, crawlers, and no-JS visitors (the trail chapter opens the
// same document as an in-page dossier overlay instead of navigating here).
// Content comes from data/caseStudy.ts so the two surfaces can't drift.
import type { Metadata } from 'next';
import Link from 'next/link';
import { rentlzCaseStudy } from '@/data/caseStudy';
import { CaseStudyArticle } from '@/components/journey/CaseStudyArticle';

const SITE = 'https://kanishkanamdeo.com';

export const metadata: Metadata = {
  title: { absolute: 'RentLz Case Study — 8× ARR | Kanishka Namdeo' },
  description:
    'How MoveInSync RentLz became a SaaS platform: 8× ARR, 70K+ monthly users, and 50+ locations across 3 countries in a 2.5-year tenure.',
  alternates: { canonical: '/case-study/rentlz' },
  openGraph: {
    type: 'article',
    title: 'Scaling Corporate Mobility: How MoveInSync RentLz Achieved 8× ARR Growth',
    description:
      'Turning a fragmented corporate car rental market into a unified SaaS platform serving 70,000+ monthly users across 50+ locations globally.',
    url: `${SITE}/case-study/rentlz`,
    siteName: 'Kanishka Namdeo Portfolio',
    // A page-level openGraph replaces the layout's wholesale (no deep merge),
    // so the images must be redeclared here or og:image disappears.
    publishedTime: '2026-01-01T00:00:00.000Z',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kanishka Namdeo — RentLz case study preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scaling Corporate Mobility: How MoveInSync RentLz Achieved 8× ARR Growth',
    description:
      'Turning a fragmented corporate car rental market into a unified SaaS platform serving 70,000+ monthly users across 50+ locations globally.',
    images: ['/og-image.jpg'],
  },
};

export default function RentlzCaseStudyPage() {
  return (
    // A div, not <main>: the root layout already provides the single <main>
    // landmark on every route, and nested mains are invalid HTML.
    <div className="mx-auto max-w-[760px] px-6 pb-20 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // .replace keeps a "</script>" sequence inside any string value from
          // terminating the block early (JSON.stringify leaves "/" unescaped).
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Scaling Corporate Mobility: How MoveInSync RentLz Achieved 8× ARR Growth',
            description:
              'A deep dive into transforming a fragmented corporate car rental market into a unified SaaS platform serving 70,000+ monthly users across 50+ locations globally.',
            author: { '@type': 'Person', name: 'Kanishka Namdeo', url: SITE, jobTitle: 'Product Manager' },
            publisher: { '@type': 'Person', name: 'Kanishka Namdeo', url: SITE },
            image: `${SITE}/og-image.jpg`,
            datePublished: '2026-01-01',
            dateModified: '2026-09-16',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/case-study/rentlz` },
            keywords: 'Product Management, SaaS, Corporate Mobility, B2B, Enterprise Software, MoveInSync, RentLz, ARR Growth',
          }).replace(/</g, '\\u003c'),
        }}
      />
      <p className="mb-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
        >
          ← Back to the trail
        </Link>
      </p>
      <CaseStudyArticle doc={rentlzCaseStudy} titleAs="h1" />
      <p className="mt-10 font-[family-name:var(--font-data)] text-[0.7em] leading-relaxed text-[var(--color-ink-muted)]">
        For inquiries about this work, write in from{' '}
        <Link href="/#contact" className="underline-offset-2 hover:text-[var(--color-rust)] hover:underline">
          the end of the trail
        </Link>
        .
      </p>
    </div>
  );
}
