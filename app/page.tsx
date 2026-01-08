import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Showcase from '@/components/Showcase';
import About from '@/components/About';
import StickyCTA from '@/components/StickyCTA';
import BackToTop from '@/components/BackToTop';

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
        text: "Absolutely — I've worked with distributed teams across multiple regions. I'm comfortable with async communication, regular video check-ins, and overlap across timezones. I use tools like Notion, Slack, and Jira to keep everything transparent and aligned.",
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
        text: "Early in my career, I spent 3 months building analytics dashboards I was personally excited about. Launch day: only 2 users enabled it. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build — 20+ interviews minimum.",
      },
    },
    {
      '@type': 'Question',
      name: 'Why hire me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "I bring both technical depth and product sensibility. I don't just ship features — I think about the user, the business, and long-term maintainability. I'm low-drama and high-impact, with a track record of scaling products across mobility, SaaS, and robotics domains.",
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
      name: 'Experience',
      item: `${siteUrl}/#experience`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Code & Open Source',
      item: `${siteUrl}/#products`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'About & FAQ',
      item: `${siteUrl}/#about`,
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

      <main id="main-content" role="main">
        <article>
          {/* Screen reader only heading for SEO */}
          <h1 className="sr-only">Kanishka Namdeo - Product Manager Portfolio - Dubai, UAE</h1>

          {/* Hero Section */}
          <Hero />

          {/* Experience Section */}
          <Experience />

          {/* Code & Open Source Section */}
          <Showcase />

          {/* About & FAQ Section (Merged) */}
          <About />
        </article>

        {/* Sticky CTA */}
        <StickyCTA />

        {/* Back to Top Button */}
        <BackToTop />
      </main>
    </>
  );
}
