'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: 'Are you open to remote opportunities?',
    answer:
      "Yes. I've been working with distributed teams for years, so I'm fluent in Slack, Zoom, and the occasional 3 AM emergency call. I've learned that great product work doesn't require being in the same room, just the same wavelength.",
  },
  {
    question: "What's your biggest product failure, and what did you learn?",
    answer:
      'Early in my career, I spent 3 months building advanced analytics dashboards I was personally excited about. Launch day: 2 users enabled it. Zero ongoing usage. The lesson? I solved a problem I thought users had, not one they actually had. Since then, I always validate before I build: 20+ interviews minimum.',
  },
  {
    question: 'How do you handle stakeholders who disagree with your priorities?',
    answer:
      "Disagreement is healthy. It's often where the best decisions emerge. I listen first, bring data second, and explicitly call out trade-offs. If we're fundamentally misaligned, I escalate rather than debate for weeks. I've had stakeholders resist features that later became our biggest wins. They became advocates because I listened, not because I convinced.",
  },
  {
    question: 'Why should someone hire you?',
    answer:
      "Honestly? I ask a lot of questions. More than some people enjoy. But I've found that the right questions lead to better products and fewer 3 AM emergency calls. I bridge engineering and customer needs because I've been on both sides. I bring technical depth with a user-centered mindset.",
  },
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-label="Field notes, asked often">
      <p className="font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.2em] text-[var(--color-rust)]">
        Field Notes — Asked Often
      </p>

      <div>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={index === 0 ? undefined : 'border-t border-[var(--color-inkline)]'}>
              <button
                type="button"
                id={`faq-question-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-rust)]"
              >
                <span className="font-[family-name:var(--font-voice)] text-lg font-bold text-[var(--color-ink)] transition-colors duration-200 hover:text-[var(--color-rust)]">
                  {item.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  width="14"
                  height="14"
                  aria-hidden="true"
                  className={`shrink-0 transition duration-200 ease-out ${
                    isOpen ? 'rotate-180 text-[var(--color-rust)]' : 'text-[var(--color-ink)]/35'
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                aria-hidden={!isOpen}
              >
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 pr-4 font-[family-name:var(--font-voice)] text-sm leading-relaxed text-[var(--color-ink)]/80">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
