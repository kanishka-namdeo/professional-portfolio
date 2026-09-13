'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';
import type { Era } from '@/data/journey';

type Pt = Era['coords'];

/** Offset alternate points slightly so the trail reads hand-drawn, not CAD. */
function jitter({ x, y }: Pt, i: number): Pt {
  return {
    x: x + (i % 2 === 0 ? -1.2 : 1.4),
    y: y + (i % 3 === 0 ? 1.6 : -1.1),
  };
}

/** Trail polyline through era coords (in % of the map box). */
function trailD(): string {
  const pts: Pt[] = eras.map((e) => e.coords);
  return pts
    .map((p, i) => {
      if (i === 0) {
        const start = jitter(p, i);
        return `M ${start.x} ${start.y}`;
      }
      // quadratic segment: wobbled control point near the waypoint, endpoint exact
      const ctrl = jitter(p, i);
      return `Q ${ctrl.x} ${ctrl.y} ${p.x} ${p.y}`;
    })
    .join(' ');
}

export function ExpeditionMap({ activeId }: { activeId: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={ref} className="relative aspect-[3/2] w-full" data-testid="expedition-map">
      <Image src="/map/contours.svg" alt="" fill className="object-cover" aria-hidden />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d={trailD()}
          fill="none"
          stroke="var(--color-rust)"
          strokeWidth="0.5"
          strokeLinecap="round"
          style={reduceMotion ? { pathLength: 1 } : { pathLength }}
        />
      </svg>
      <ul role="list" aria-label="Career waypoints" className="absolute inset-0">
        {eras.map((era) => (
          <li key={era.id} className="absolute" style={{ left: `${era.coords.x}%`, top: `${era.coords.y}%` }}>
            <button
              type="button"
              onClick={() => lenis?.scrollTo(`#era-${era.id}`)}
              aria-label={`Travel to ${era.company}`}
              className={`rounded-none border px-2 py-1 font-[family-name:var(--font-data)] text-[11px] transition-transform ${
                activeId === era.id
                  ? 'border-[var(--color-rust)] bg-[var(--color-rust)] text-[var(--color-parchment)]'
                  : 'border-[var(--color-ink)] bg-[var(--color-parchment)] text-[var(--color-ink)] hover:-rotate-2'
              }`}
              style={{ transform: `translate(-50%, -50%) rotate(${era.coords.x % 2 ? 1.5 : -1.5}deg)` }}
            >
              {era.company}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExpeditionMapMini({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
      <path d={trailD()} fill="none" stroke="var(--color-inkline)" strokeWidth="1" />
      <motion.path d={trailD()} fill="none" stroke="var(--color-rust)" strokeWidth="1" style={{ pathLength: progress }} />
    </svg>
  );
}
