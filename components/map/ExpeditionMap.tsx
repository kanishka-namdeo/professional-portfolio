'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
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

export function ExpeditionMap({
  activeId,
  className = 'aspect-[3/2]',
  priority = false,
  showLabels = true,
}: {
  activeId: string | null;
  className?: string;
  /** Set only for the above-the-fold (hero) instance so the LCP image is not lazy. */
  priority?: boolean;
  /** Waypoint chips are on by default; the hero draws them too — that's the navigation. */
  showLabels?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const isHero = priority;
  // Hero: the trail draws itself once on load. Journey: it draws as you travel.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // The "you are here" marker rides the trail: with the hero's load draw, and with
  // scroll progress in the journey map. Positioned by direct DOM writes — a state
  // update per scroll frame would re-render every pin, and this runs at 60fps.
  const pathRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const heroDraw = useMotionValue(0);
  const driver = isHero ? heroDraw : pathLength;

  useEffect(() => {
    if (!isHero || reduceMotion) return;
    const controls = animate(heroDraw, 1, { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 });
    return () => controls.stop();
  }, [isHero, reduceMotion, heroDraw]);

  useMotionValueEvent(driver, 'change', (v) => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;
    const clamped = Math.max(0, Math.min(1, v));
    const point = path.getPointAtLength(path.getTotalLength() * clamped);
    marker.style.left = `${point.x}%`;
    marker.style.top = `${point.y}%`;
    marker.style.opacity = clamped < 0.005 ? '0' : '1';
  });

  // Reduced motion: no draw, no ride — park the marker at the destination (2026).
  useEffect(() => {
    if (!reduceMotion) return;
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;
    const end = path.getPointAtLength(path.getTotalLength());
    marker.style.left = `${end.x}%`;
    marker.style.top = `${end.y}%`;
    marker.style.opacity = '1';
  }, [reduceMotion]);

  // One establishing scene of parallax (the hero map), per the motion guidelines.
  const contourY = useTransform(scrollYProgress, [0, 1], ['-1.6%', '1.6%']);

  return (
    <div ref={ref} className={`relative w-full ${className}`} data-testid="expedition-map">
      <motion.div
        className="absolute inset-0"
        style={isHero && !reduceMotion ? { y: contourY } : undefined}
      >
        <Image src="/map/contours.svg" alt="" fill className="object-cover" aria-hidden priority={priority} fetchPriority={priority ? 'high' : undefined} />
      </motion.div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          ref={pathRef}
          d={trailD()}
          fill="none"
          stroke="var(--color-rust)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={isHero && !reduceMotion ? { pathLength: 0 } : false}
          animate={isHero && !reduceMotion ? { pathLength: 1 } : undefined}
          transition={isHero ? { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 } : undefined}
          style={isHero ? undefined : reduceMotion ? { pathLength: 1 } : { pathLength }}
        />
      </svg>
      {/* waypoint pins — HTML so they stay circular inside the stretched viewBox */}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {eras.map((era, i) => {
          const isLast = i === eras.length - 1;
          const isActive = activeId === era.id;
          const size = isLast || isActive ? 14 : 10;
          return (
            <span
              key={era.id}
              className="absolute rounded-full border"
              style={{
                left: `${era.coords.x}%`,
                top: `${era.coords.y}%`,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                borderColor: 'var(--color-rust)',
                borderWidth: isLast ? 3 : 2,
                backgroundColor: isLast || isActive ? 'var(--color-rust)' : 'var(--color-parchment)',
              }}
            />
          );
        })}
      </span>
      {/* the traveller: rides the trail with the draw / with scroll */}
      <span
        ref={markerRef}
        aria-hidden
        className="pointer-events-none absolute z-10 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-rust)] bg-[var(--color-parchment)] shadow-[0_0_0_3px_rgba(243,237,226,0.85)]"
        style={{ left: '0%', top: '0%', opacity: 0, transform: 'translate(-50%, -50%)' }}
      >
        <span className="absolute inset-[2px] rounded-full bg-[var(--color-rust)]" />
      </span>
      {showLabels && (
        <ul role="list" aria-label="Career waypoints" className="absolute inset-0">
          {eras.map((era) => (
            <li key={era.id} className="absolute" style={{ left: `${era.coords.x}%`, top: `${era.coords.y}%` }}>
              <button
                type="button"
                onClick={() => lenis?.scrollTo(`#era-${era.id}`)}
                aria-label={`Travel to ${era.company}`}
                title={era.company}
                className={`whitespace-nowrap rounded-none border px-2 py-1 font-[family-name:var(--font-data)] text-[10px] transition-transform ${
                  activeId === era.id
                    ? 'border-[var(--color-rust)] bg-[var(--color-rust)] text-[var(--color-parchment)]'
                    : 'border-[var(--color-ink)] bg-[var(--color-parchment)] text-[var(--color-ink)] hover:-rotate-2'
                }`}
                style={{
                  transform: `translate(-50%, -170%) rotate(${era.coords.x % 2 ? 1.5 : -1.5}deg)`,
                }}
              >
                {era.short}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
