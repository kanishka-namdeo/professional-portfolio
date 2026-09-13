'use client';

import { useLenis } from 'lenis/react';
import { ExpeditionMap } from './map/ExpeditionMap';

/** Full-viewport parchment hero: title, the expedition map, one CTA. */
export default function Hero() {
  const lenis = useLenis();
  return (
    <section id="hero" aria-label="Introduction" className="relative flex min-h-[100svh] flex-col justify-center py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="font-[family-name:var(--font-data)] text-xs uppercase tracking-[0.25em] text-[var(--color-rust)]">
          Dispatches
        </p>
        <h2 className="mt-4 max-w-4xl font-[family-name:var(--font-voice)] text-5xl font-bold leading-[1.1] text-[var(--color-ink)] md:text-6xl">
          Kanishka Namdeo — a field log, 2016 → present
        </h2>
        <p className="mt-4 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)]/70">
          Open to new roles — Dubai / remote
        </p>
        <div className="mt-10 max-w-3xl">
          <ExpeditionMap activeId={null} className="aspect-[16/9] max-h-[70vh]" />
        </div>
        <button
          type="button"
          onClick={() => (lenis ? lenis.scrollTo('#era-origin') : document.getElementById('era-origin')?.scrollIntoView({ behavior: 'smooth' }))}
          className="mt-10 border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[4px_4px_0_var(--color-rust)]"
        >
          Follow the trail
        </button>
      </div>
    </section>
  );
}
