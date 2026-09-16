// components/journey/JourneyChapter.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Era } from '@/data/journey';
import { CaseStudyDossier } from './CaseStudyDossier';
import { MetricCounter } from './MetricCounter';

// Press ledger: rows shown while collapsed before the "+N more clippings" fold.
const TAIL_VISIBLE = 3;

export function JourneyChapter({ era, active }: { era: Era; active: boolean }) {
  const reduce = useReducedMotion();
  // Mounted gate: motion SSRs `initial` styles, so chapters would render
  // opacity-0 for no-JS visitors. Render static until mounted, then opt in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [ledgerOpen, setLedgerOpen] = useState(false);

  const enter = (i: number) =>
    !mounted || reduce ? {} : {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-15% 0px' },
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    };

  return (
    <section id={`era-${era.id}`} className="relative min-h-[90vh] py-24" data-era={era.id} data-active={active}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.p {...enter(0)} className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
          WAYPOINT {era.number} — <time>{era.period.toUpperCase()}</time>
        </motion.p>
        <motion.h2 {...enter(1)} className="mt-2 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
          {era.company}
          <span className="mt-1 block text-xl italic text-[var(--color-ink)]/70">{era.role}</span>
        </motion.h2>

        <motion.div {...enter(2)} className="mt-10 space-y-6 font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]">
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Terrain — </strong>{era.terrain}</p>
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Crossing — </strong>{era.crossing}</p>
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Summit — </strong>{era.summit}</p>
        </motion.div>

        <motion.div {...enter(3)} className="mt-10">
          <p className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink-muted)]">
            From the log
          </p>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4">
            {era.metrics.map((m) => <MetricCounter key={m.label} {...m} />)}
          </div>
        </motion.div>

        {era.press && era.press.length > 0 && (
          <motion.div {...enter(4)} className="mt-12">
            <p className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Receipts from the press</p>
            {(() => {
              const [featured, ...tail] = era.press;
              const collapsed = tail.length > TAIL_VISIBLE && !ledgerOpen;
              const visibleTail = collapsed ? tail.slice(0, TAIL_VISIBLE) : tail;
              return (
                <>
                  <div className="group mt-4 max-w-md rotate-[-0.8deg] border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/70 p-4 shadow-[2px_3px_6px_var(--color-shadow-soft)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:rotate-0">
                    <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">{featured.source} · {featured.date}</span>
                        <span aria-hidden className="font-[family-name:var(--font-data)] text-sm text-[var(--color-rust)]">↗</span>
                      </span>
                      <span className="mt-2 block font-[family-name:var(--font-voice)] text-xl font-semibold leading-snug text-[var(--color-ink)]">“{featured.headline}”</span>
                    </a>
                  </div>
                  {tail.length > 0 && (
                    // Tape + sheet styling lives on a wrapper div: a <ul>'s
                    // content model allows only <li> children, and the
                    // decorative tape span sat directly inside it.
                    <div className="relative mt-4 max-w-xl rotate-[0.5deg] border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/55 shadow-[2px_3px_6px_var(--color-shadow-soft)] transition-transform duration-150 ease-out hover:rotate-0">
                      <span
                        aria-hidden
                        className="absolute -top-2 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-1 border-x border-dashed border-[var(--color-ink)]/25 bg-[var(--color-rust)]/25"
                      />
                      <ul id={`press-tail-${era.id}`}>
                        {visibleTail.map((p) => (
                          <li key={p.url} className="border-t border-dashed border-[var(--color-ink)]/20 first:border-t-0">
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              // The row truncates visually; the title keeps the
                              // full headline reachable for sighted users too
                              // (screen readers already read the DOM text).
                              title={p.headline}
                              className="flex min-w-0 items-baseline gap-3 px-3.5 py-2 transition-colors duration-150 hover:bg-[var(--color-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
                            >
                              <span className="shrink-0 font-[family-name:var(--font-data)] text-[10.5px] uppercase tracking-widest text-[var(--color-rust-text)]">{p.source}</span>
                              <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-voice)] text-[15.5px] leading-snug text-[var(--color-ink)]">{p.headline}</span>
                              <span aria-hidden className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">↗</span>
                            </a>
                          </li>
                        ))}
                        {tail.length > TAIL_VISIBLE && (
                          <li className="border-t border-dashed border-[var(--color-ink)]/20">
                            <button
                              type="button"
                              onClick={() => setLedgerOpen((v) => !v)}
                              aria-expanded={ledgerOpen}
                              aria-controls={`press-tail-${era.id}`}
                              className="flex w-full items-baseline gap-2 px-3.5 py-2 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink-muted)] transition-colors duration-150 hover:text-[var(--color-rust-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
                            >
                              <span className="text-[var(--color-rust-text)]">{ledgerOpen ? '–' : `+${tail.length - TAIL_VISIBLE}`}</span>
                              {ledgerOpen ? 'fold back' : 'more clippings'}
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
        {era.testimonial && (
          <motion.figure
            {...enter(5)}
            className="mt-10 max-w-md rotate-[0.8deg] border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/70 p-4 shadow-[2px_3px_6px_var(--color-shadow-soft)] transition-transform duration-150 ease-out hover:rotate-0"
          >
            <blockquote className="font-[family-name:var(--font-voice)] text-base leading-snug text-[var(--color-ink)]">
              “{era.testimonial.quote}”
            </blockquote>
            <figcaption className="mt-2 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">
              {era.testimonial.name} — <cite className="not-italic">{era.testimonial.title}</cite>
            </figcaption>
          </motion.figure>
        )}

        {era.caseStudy && (
          <motion.div {...enter(6)} className="mt-6">
            {/* Opens the dossier in-page (it loads its own document lazily);
                the href stays for no-JS/crawlers. */}
            <CaseStudyDossier href={era.caseStudy.href} label={era.caseStudy.label} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
