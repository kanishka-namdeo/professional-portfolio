// components/journey/Journey.tsx
'use client';

import { useEffect, useState } from 'react';
import { eras } from '@/data/journey';
import { ExpeditionMap } from '../map/ExpeditionMap';
import { JourneyChapter } from './JourneyChapter';

/**
 * The Journey: sticky expedition map on desktop, chapters beside it;
 * on mobile the chapters stack with a left timeline line and the map is hidden.
 * Active-chapter tracking: IntersectionObserver on the era sections.
 */
export function Journey() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-era]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-era'));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" aria-label="The journey" className="relative py-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[minmax(0,34rem)_1fr] lg:gap-14">
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ExpeditionMap activeId={activeId} className="aspect-[4/3]" />
            <p className="mt-3 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">
              The trail draws itself as you travel. Click a waypoint to jump.
            </p>
            <ol className="mt-4 space-y-1">
              {eras.map((era) => (
                <li key={era.id} className="flex gap-3 font-[family-name:var(--font-data)] text-[11px]">
                  <span className={activeId === era.id ? 'text-[var(--color-rust)]' : 'text-[var(--color-ink)]/45'}>{era.number}</span>
                  <span className={activeId === era.id ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]/60'}>{era.short}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="border-l-2 border-[var(--color-inkline)] pl-6 md:border-l-0 md:pl-0">
          {eras.map((era) => (
            <JourneyChapter key={era.id} era={era} active={activeId === era.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
