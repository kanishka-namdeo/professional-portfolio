'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: "Are you open to remote opportunities?",
    answer: "Yes! I've been working with distributed teams for years, so I'm fluent in Slack, Zoom, and the occasional 3 AM emergency call. I've learned that great product work doesn't require being in the same room, just the same wavelength.",
  },
  {
    question: "What's your biggest product failure, and what did you learn?",
    answer: "Early in my career, I spent 3 months building advanced analytics dashboards I was personally excited about. Launch day: 2 users enabled it. Zero ongoing usage. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build: 20+ interviews minimum.",
  },
  {
    question: "How do you handle stakeholders who disagree with your priorities?",
    answer: "Disagreement is healthy. It's often where the best decisions emerge. I listen first, bring data second, and explicitly call out trade-offs. If we're fundamentally misaligned, I escalate rather than debate for weeks. I've had stakeholders resist features that later became our biggest wins. They became advocates because I listened, not because I convinced.",
  },
  {
    question: "Why should someone hire you?",
    answer: "Honestly? I ask a lot of questions. More than some people enjoy. But I've found that the right questions lead to better products and fewer 3 AM emergency calls. I bridge engineering and customer needs because I've been on both sides. I bring technical depth with a user-centered mindset.",
  },
];

type TabType = 'contact' | 'faq';

export default function ContactFAQ() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <section id="contact-faq" aria-labelledby="contact-title" role="region" aria-label="Contact Information and Frequently Asked Questions" className="mt-16">
      <header>
        <h2 id="contact-title" className="font-[family-name:var(--font-voice)] text-2xl font-bold text-[var(--color-ink)]">
          {activeTab === 'contact' ? 'Get In Touch' : 'Frequently Asked Questions'}
        </h2>
        <p className="mt-1 font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.15em] text-[var(--color-ink)]/60">
          {activeTab === 'contact'
            ? 'Let\'s discuss how we can work together'
            : 'Common questions about my work and expertise'}
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={`inline-flex items-center gap-2 border px-4 py-2 font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.15em] transition-colors ${
            activeTab === 'contact'
              ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-parchment)]'
              : 'border-[var(--color-ink)]/20 bg-white/60 text-[var(--color-ink)] hover:border-[var(--color-ink)]'
          }`}
          onClick={() => setActiveTab('contact')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact
        </button>
        <button
          className={`inline-flex items-center gap-2 border px-4 py-2 font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.15em] transition-colors ${
            activeTab === 'faq'
              ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-parchment)]'
              : 'border-[var(--color-ink)]/20 bg-white/60 text-[var(--color-ink)] hover:border-[var(--color-ink)]'
          }`}
          onClick={() => setActiveTab('faq')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          FAQ
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {/* Contact Tab */}
        <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <a href="mailto:kanishkanamdeo@hotmail.com" className="flex items-center gap-4 border border-[var(--color-ink)]/20 bg-white/60 px-4 py-3 transition-colors hover:border-[var(--color-ink)]" aria-label="Send email to Kanishka">
                <div className="text-[var(--color-rust)]" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-voice)] font-bold text-[var(--color-ink)]">Email</h4>
                  <span className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/70">kanishkanamdeo@hotmail.com</span>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/kanishkanamdeo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border border-[var(--color-ink)]/20 bg-white/60 px-4 py-3 transition-colors hover:border-[var(--color-ink)]" aria-label="Connect on LinkedIn">
                <div className="text-[var(--color-rust)]" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-voice)] font-bold text-[var(--color-ink)]">LinkedIn</h4>
                  <span className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/70">Connect with me</span>
                </div>
              </a>
              <div className="flex items-center gap-4 border border-[var(--color-ink)]/20 bg-white/60 px-4 py-3" aria-label="View location">
                <div className="text-[var(--color-rust)]" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-[family-name:var(--font-voice)] font-bold text-[var(--color-ink)]">Location</h4>
                  <span className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/70">Dubai, UAE</span>
                </div>
              </div>
            </div>
            <div className="border border-[var(--color-ink)]/20 bg-white/60 p-6">
              <h3 className="font-[family-name:var(--font-voice)] text-xl font-bold text-[var(--color-ink)]">Building Something That Needs Better Product-Market Fit?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/80">Whether you're scaling a B2B SaaS platform, leading a new product, or building AI-powered solutions, let's discuss how I can help accelerate your growth.</p>
              <div className="mt-4">
                <a href="mailto:kanishkanamdeo@hotmail.com" className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] transition-colors hover:border-[var(--color-rust)] hover:bg-[var(--color-rust)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Me an Email
                </a>
              </div>
              <div className="mt-6 border-t border-[var(--color-ink)]/20 pt-4">
                <h4 className="font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.2em] text-[var(--color-rust)]">Currently Seeking</h4>
                <p className="mt-2 text-sm text-[var(--color-ink)]/80">Senior Product Manager & Product Leadership roles in B2B SaaS, Mobility, and AI/ML companies</p>
                <p className="mt-1 font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/60">Response time: ASAP</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Tab */}
        <div className={activeTab === 'faq' ? 'block' : 'hidden'}>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, index) => (
              <div key={index} className={`border bg-white/60 transition-colors ${openFAQIndex === index ? 'border-[var(--color-ink)]' : 'border-[var(--color-ink)]/20'}`}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-[family-name:var(--font-voice)] text-lg font-bold text-[var(--color-ink)]"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openFAQIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  {item.question}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" className={`shrink-0 text-[var(--color-rust)] transition-transform ${openFAQIndex === index ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className="overflow-hidden transition-[max-height]"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  style={{ maxHeight: openFAQIndex === index ? '500px' : '0' }}
                >
                  <div id={`faq-question-${index}`} className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-ink)]/80">
                    {item.answer.split('\n').map((line, lineIndex) => {
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <p key={lineIndex} className="mt-2 pl-4">
                            {line.trim().substring(2)}
                          </p>
                        );
                      }
                      return <p key={lineIndex}>{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
