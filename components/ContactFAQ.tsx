'use client';

import { useState } from 'react';
import { faqItems } from '@/data/faq';

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-label="Field notes, asked often">
      {/* h3: the FAQ is a subsection of EndOfTrail's h2 — keep it in the
          heading outline for heading navigation (WCAG 1.3.1 / 2.4.6). */}
      <h3 className="font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.2em] text-[var(--color-rust)]">
        Field Notes — Asked Often
      </h3>

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
