// components/TrailProgress.tsx
'use client';

import { useScroll, useSpring } from 'motion/react';
import { ExpeditionMapMini } from './map/ExpeditionMap';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';

/** Fixed right-edge rail: mini map whose trail fills as you scroll, plus numbered jumps. */
export function TrailProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const lenis = useLenis();
  return (
    <nav aria-label="Trail progress" className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <ExpeditionMapMini progress={progress} />
      <ul role="list" className="mt-2 space-y-1">
        {eras.map((era) => (
          <li key={era.id}>
            <button
              type="button"
              onClick={() => lenis?.scrollTo(`#era-${era.id}`)}
              aria-label={`Travel to ${era.company}`}
              className="font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink)]/60 hover:text-[var(--color-rust)]"
            >
              {era.number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
