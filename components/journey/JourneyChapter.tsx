// components/journey/JourneyChapter.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Era } from '@/data/journey';
import { MetricCounter } from './MetricCounter';

export function JourneyChapter({ era, active }: { era: Era; active: boolean }) {
  const reduce = useReducedMotion();
  // Mounted gate: motion SSRs `initial` styles, so chapters would render
  // opacity-0 for no-JS visitors. Render static until mounted, then opt in.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
          <p className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink)]/45">
            From the log
          </p>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4">
            {era.metrics.map((m) => <MetricCounter key={m.label} {...m} />)}
          </div>
        </motion.div>

        {era.press && era.press.length > 0 && (
          <motion.div {...enter(4)} className="mt-12">
            <p className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-ink)]/60">Receipts from the press</p>
            <ul className="mt-4 space-y-4">
              {era.press.map((p) => (
                <li key={p.url} className="group max-w-md rotate-[-0.8deg] border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/70 p-4 shadow-[2px_3px_6px_var(--color-shadow-soft)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:rotate-0">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                    <span className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">{p.source} · {p.date}</span>
                    <span className="mt-2 block font-[family-name:var(--font-voice)] text-base leading-snug text-[var(--color-ink)]">“{p.headline}”</span>
                    <span
                      aria-hidden
                      className="mt-2 block font-[family-name:var(--font-data)] text-[10px] text-[var(--color-rust)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      read the piece ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
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
            <a
              href={era.caseStudy.href}
              className="inline-block border border-[var(--color-ink)]/30 bg-[var(--color-paper)]/60 px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink)]/70 transition-colors duration-150 hover:border-[var(--color-rust)] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
            >
              {era.caseStudy.label}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
