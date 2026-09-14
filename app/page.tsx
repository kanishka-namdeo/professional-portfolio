import Hero from '@/components/Hero';
import { TrailProgress } from '@/components/TrailProgress';
import { WaypointPalette } from '@/components/WaypointPalette';
import { Journey } from '@/components/journey/Journey';
import { BaseCamp } from '@/components/camps/BaseCamp';
import { camps } from '@/data/camps';
import { Ledger } from '@/components/ledger/Ledger';
import { EndOfTrail } from '@/components/EndOfTrail';

const siteUrl = 'https://kanishkanamdeo.com';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Remote work capability',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Absolutely. I've worked with distributed teams across multiple regions. I'm comfortable with async communication, regular video check-ins, and overlap across timezones. I use tools like Notion, Slack, and Jira to keep everything transparent and aligned.",
      },
    },
    {
      '@type': 'Question',
      name: 'Handling disagreements',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Disagreements are healthy when handled right. I focus on the problem, not the person. I ask questions to understand the other perspective, present data when possible, and I\'m always willing to compromise to keep the project moving forward.',
      },
    },
    {
      '@type': 'Question',
      name: 'Biggest failure and learnings',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Early in my career, I spent 3 months building analytics dashboards I was personally excited about. Launch day: only 2 users enabled it. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build: 20+ interviews minimum.",
      },
    },
    {
      '@type': 'Question',
      name: 'Why hire me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "I bring both technical depth and product sensibility. I don't just ship features; I think about the user, the business, and long-term maintainability. I'm low-drama and high-impact, with a track record of scaling products across mobility, SaaS, and robotics domains.",
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'The Journey',
      item: `${siteUrl}/#journey`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Base Camps',
      item: `${siteUrl}/#camps`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'The Ledger',
      item: `${siteUrl}/#ledger`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'End of the Trail',
      item: `${siteUrl}/#contact`,
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Screen reader only heading for SEO */}
      <h1 className="sr-only">Kanishka Namdeo - Product Manager Portfolio - Dubai, UAE</h1>

      {/* Hero */}
      <Hero />

      {/* The Journey — five career waypoints along the expedition map */}
      <Journey />

      {/* Base Camps — the built-in-public receipts */}
      <section id="camps" aria-label="Base camps">
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

      {/* ⌘K waypoint jumper — keyboard-first navigation over everything above */}
      <WaypointPalette />
    </>
  );
}
