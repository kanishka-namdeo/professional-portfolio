import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import { TrailProgress } from '@/components/TrailProgress';
import { WaypointPalette } from '@/components/WaypointPalette';
import { Journey } from '@/components/journey/Journey';
import { camps } from '@/data/camps';
import { faqItems } from '@/data/faq';
import { writing } from '@/data/ledger';
import { ThemeToggle } from '@/components/ThemeToggle';

// Below-the-fold islands load as separate JS chunks. ssr: true (the default in
// the App Router) keeps their HTML in the server-rendered document — this is a
// JS-chunk split, not a content change, so no `loading` fallback is needed.
const BaseCamp = dynamic(() => import('@/components/camps/BaseCamp').then((m) => m.BaseCamp), { ssr: true });
const Ledger = dynamic(() => import('@/components/ledger/Ledger').then((m) => m.Ledger), { ssr: true });
const EndOfTrail = dynamic(() => import('@/components/EndOfTrail').then((m) => m.EndOfTrail), { ssr: true });

const siteUrl = 'https://kanishkanamdeo.com';
const personId = `${siteUrl}/#person`;

// Ledger display dates are "Mon YYYY"; schema.org datePublished needs ISO 8601.
const MONTH_INDEX: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};
const toISODate = (date: string) => {
  const match = /^([A-Za-z]{3}) (\d{4})$/.exec(date);
  return match ? `${match[2]}-${MONTH_INDEX[match[1]]}-01` : date;
};

// ── Page-level JSON-LD graph ──────────────────────────────────────────
// All page schemas in a single @graph: fewer <script> tags, and crawlers
// can correlate entities (e.g. BlogPosting.author → Person in layout graph).

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // FAQ — generated from the same data ContactFAQ renders, so the schema
    // can't drift from what readers actually see.
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    // Breadcrumbs — section anchors for single-page navigation.
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'The Journey', item: `${siteUrl}/#journey` },
        { '@type': 'ListItem', position: 3, name: 'Base Camps', item: `${siteUrl}/#camps` },
        { '@type': 'ListItem', position: 4, name: 'The Ledger', item: `${siteUrl}/#ledger` },
        { '@type': 'ListItem', position: 5, name: 'End of the Trail', item: `${siteUrl}/#contact` },
      ],
    },
    // SoftwareApplication — one per Base Camp project.
    // Gives Google structured data about the projects (stack, repo, description).
    ...camps.map((camp) => ({
      '@type': 'SoftwareApplication',
      name: camp.title,
      description: camp.tagline,
      url: camp.repoUrl,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      datePublished: camp.year,
      programmingLanguage: camp.stack,
      author: { '@id': personId },
      isAccessibleForFree: true,
    })),
    // BlogPosting — one per writing entry from the Ledger.
    // Enables rich results for articles and links them to the author.
    ...writing.map((entry) => ({
      '@type': 'BlogPosting',
      headline: entry.title,
      description: entry.subtitle,
      image: entry.image,
      datePublished: toISODate(entry.date),
      url: entry.url,
      author: { '@id': personId },
      publisher: {
        '@type': 'Organization',
        name: 'Medium',
        url: 'https://medium.com',
      },
    })),
  ],
};

export default function Home() {
  return (
    <>
      {/* Skip-to-content link lives in app/layout.tsx (first tab stop, targets
          #journey) — it must sit outside <main> to actually skip anything. */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Screen reader only heading for SEO */}
      <h1 className="sr-only">Kanishka Namdeo - Product Manager Portfolio - Dubai, UAE</h1>

      {/* Crawler-friendly navigation — gives search engines explicit <a> links
          to index, complementing the JS-driven waypoint navigation. Each link
          is sr-only-focusable: clipped until keyboard focus reveals it as a
          chip, so there are no invisible tab stops (WCAG 2.4.7/2.4.11). */}
      <nav aria-label="Page sections">
        <a href="#journey" className="sr-only-focusable">The Journey</a>
        <a href="#camps" className="sr-only-focusable">Base Camps</a>
        <a href="#ledger" className="sr-only-focusable">The Ledger</a>
        <a href="#contact" className="sr-only-focusable">End of the Trail</a>
      </nav>

      {/* Hero */}
      <Hero />

      {/* The Journey — five career waypoints along the expedition map */}
      <Journey />

      {/* Base Camps — the built-in-public receipts. tabIndex={-1} lets the
          skip/anchor jump land focus here (see [tabindex='-1'] in globals.css). */}
      <section id="camps" aria-label="Base camps" tabIndex={-1}>
        {camps.map((camp) => (
          <BaseCamp key={camp.id} camp={camp} />
        ))}
      </section>

      {/* The Ledger — the open-source index */}
      <Ledger />

      {/* End of the Trail — contact */}
      <EndOfTrail />

      {/* Fixed right-edge progress rail */}
      <TrailProgress />

      {/* Day/night switch — fixed top-right corner, persists to localStorage */}
      <ThemeToggle />

      {/* ⌘K waypoint jumper — keyboard-first navigation over everything above */}
      <WaypointPalette />
    </>
  );
}
