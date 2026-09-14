// components/TrailProgress.tsx
'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';

/** Fixed right-edge rail: a vertical track that fills as you scroll, with numbered jumps. */
export function TrailProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const lenis = useLenis();
  return (
    <nav aria-label="Trail progress" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="flex items-stretch gap-2">
        <ul role="list" className="flex flex-col justify-between py-px">
          {eras.map((era) => (
            <li key={era.id}>
              <button
                type="button"
                onClick={() => lenis?.scrollTo(`#era-${era.id}`)}
                aria-label={`Travel to ${era.company} (${era.number})`}
                className="block font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink)]/55 hover:text-[var(--color-rust)]"
              >
                {era.number}
              </button>
            </li>
          ))}
        </ul>
        <svg viewBox="0 0 8 200" preserveAspectRatio="none" className="h-56 w-2" aria-hidden>
          <line x1="4" y1="0" x2="4" y2="200" stroke="var(--color-inkline)" strokeWidth="1" />
          <motion.line
            x1="4"
            y1="0"
            x2="4"
            y2="200"
            stroke="var(--color-rust)"
            strokeWidth="2"
            style={{ pathLength: progress }}
          />
        </svg>
      </div>
    </nav>
  );
}
