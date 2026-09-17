// components/journey/Journey.tsx
'use client';

import { eras } from '@/data/journey';
import { useActiveEra } from '@/hooks/useActiveEra';
import { ExpeditionMap } from '../map/ExpeditionMap';
import { JourneyChapter } from './JourneyChapter';

/**
 * The Journey: sticky expedition map on desktop, chapters beside it;
 * on mobile the chapters stack with a left timeline line and the map is hidden.
 * Active-chapter tracking lives in useActiveEra (shared with the progress rail).
 * The trail draw needs no scroll target from here: ExpeditionMap anchors each
 * waypoint to the scroll position where its chapter centres, so the draw and
 * the pin highlights share the same definition of “which chapter is active”.
 */
export function Journey() {
  const activeId = useActiveEra();

  return (
    // tabIndex={-1}: skip/anchor jumps land focus here (see [tabindex='-1']
    // in globals.css).
    <section id="journey" aria-label="The journey" className="relative py-10" tabIndex={-1}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[minmax(0,34rem)_1fr] lg:gap-14">
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ExpeditionMap activeId={activeId} className="aspect-[4/3]" mapLabel="journey map" />
            <p className="mt-3 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">
              The trail draws itself as you travel.
            </p>
            <ol className="mt-4 space-y-1">
              {eras.map((era) => (
                <li key={era.id} className="flex gap-3 font-[family-name:var(--font-data)] text-[11px]">
                  <span className={activeId === era.id ? 'text-[var(--color-rust)]' : 'text-[var(--color-ink-muted)]'}>{era.number}</span>
                  <span className={activeId === era.id ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'}>{era.short}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        {/* min-w-0: grid item must be allowed under content width, or the
            nowrap press-ledger headlines (truncate) floor the mobile track
            at ~576px and force horizontal overflow. */}
        <div className="min-w-0 border-l-2 border-[var(--color-inkline)] pl-6 md:border-l-0 md:pl-0">
          {eras.map((era) => (
            <JourneyChapter key={era.id} era={era} active={activeId === era.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
