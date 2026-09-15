// components/journey/Journey.tsx
'use client';

import { useRef } from 'react';
import { eras } from '@/data/journey';
import { useActiveEra } from '@/hooks/useActiveEra';
import { ExpeditionMap } from '../map/ExpeditionMap';
import { JourneyChapter } from './JourneyChapter';

/**
 * The Journey: sticky expedition map on desktop, chapters beside it;
 * on mobile the chapters stack with a left timeline line and the map is hidden.
 * Active-chapter tracking lives in useActiveEra (shared with the progress rail).
 */
export function Journey() {
  const activeId = useActiveEra();
  // Ref for the journey section — passed to ExpeditionMap so the trail-draw
  // spring tracks the reader's progress through the chapters, not the tiny map
  // container's own scroll-through-viewport (which would finish instantly).
  const journeyRef = useRef<HTMLElement>(null);

  return (
    <section id="journey" aria-label="The journey" className="relative py-10" ref={journeyRef}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[minmax(0,34rem)_1fr] lg:gap-14">
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ExpeditionMap activeId={activeId} className="aspect-[4/3]" scrollTargetRef={journeyRef} />
            <p className="mt-3 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">
              The trail draws itself as you travel.
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
