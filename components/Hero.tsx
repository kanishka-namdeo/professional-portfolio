'use client';

import { useLenis } from 'lenis/react';
import { ExpeditionMap } from './map/ExpeditionMap';

/** Full-viewport parchment hero: title, the expedition map as navigation, one CTA. */
export default function Hero() {
  const lenis = useLenis();
  return (
    <section id="hero" aria-label="Introduction" className="relative flex min-h-[100svh] flex-col justify-center pt-24 pb-16">
      <div className="mx-auto w-full max-w-7xl px-10">
        <p className="font-[family-name:var(--font-data)] text-sm uppercase tracking-[0.25em] text-[var(--color-rust)]">
          Dispatches
        </p>
        <h2 className="mt-5 max-w-5xl font-[family-name:var(--font-voice)] text-5xl font-bold leading-[1.08] text-[var(--color-ink)] md:text-6xl">
          Kanishka Namdeo — a field log, 2016 → present
        </h2>
        <div className="mt-4 font-[family-name:var(--font-data)]">
          <p className="text-lg text-[var(--color-ink)]/85">
            Product Manager · 9+ years · SaaS, mobility &amp; AI
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            8× ARR · 70K+ monthly users · 50+ locations
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="font-[family-name:var(--font-data)] text-base text-[var(--color-ink)]/70">
            Open to new roles — Dubai / remote
          </p>
          <p className="font-[family-name:var(--font-data)] text-sm text-[var(--color-ink-muted)]">
            Click a waypoint to travel there.
          </p>
        </div>
        <div className="mt-8">
          <ExpeditionMap activeId={null} className="aspect-[21/9] max-h-[58vh]" priority mapLabel="hero map" />
        </div>
        <button
          type="button"
          onClick={() => {
            // Lenis respects reduced motion itself; the pre-hydration fallback
            // must check it before animating.
            if (lenis) {
              lenis.scrollTo('#era-origin');
              return;
            }
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            document.getElementById('era-origin')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
          }}
          className="mt-8 border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[4px_4px_0_var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
        >
          Follow the trail ↓
        </button>
      </div>
    </section>
  );
}
