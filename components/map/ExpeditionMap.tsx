'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  scrollTargetRef,
}: {
  activeId: string | null;
  className?: string;
  /** Set only for the above-the-fold (hero) instance so the LCP image is not lazy. */
  priority?: boolean;
  /** Waypoint chips are on by default; the hero draws them too — that's the navigation. */
  showLabels?: boolean;
  /**
   * Optional ref to the scroll container that should drive the trail-draw progress.
   * The Journey section passes its own ref so the trail draws as the reader scrolls
   * through the chapters. When omitted (Hero instance), the map's own container is
   * used — fine there because the hero trail is a one-shot load animation, not
   * scroll-driven.
   */
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const isHero = priority;
  // Hero: the trail draws itself once on load. Journey: it draws as you travel.
  // The scroll target is the journey section (passed in) for the sticky map, or
  // the map container itself for the hero (where scroll progress only drives the
  // contour parallax, not the trail).
  const scrollTarget = scrollTargetRef ?? ref;
  const { scrollYProgress } = useScroll({ target: scrollTarget, offset: ['start end', 'end start'] });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  // Manually compute stroke-dasharray/offset for the draw animation.
  // We use the actual path length (computed after mount) instead of pathLength="1"
  // to avoid coordinate system conflicts.
  const [totalLength, setTotalLength] = useState(0);
  useEffect(() => {
    // Guard: jsdom (and non-browser SVG impls) lack SVGGeometryElement APIs.
    if (pathRef.current && typeof pathRef.current.getTotalLength === 'function') {
      setTotalLength(pathRef.current.getTotalLength());
    }
  }, []);
  // Use motion values for the draw animation
  const strokeDasharrayMotion = useTransform(pathProgress, (v) => totalLength > 0 ? `${v * totalLength} ${totalLength}` : '0 0');
  const strokeDashoffsetMotion = useTransform(pathProgress, (v) => totalLength > 0 ? (1 - v) * totalLength : 0);
  // Apply directly to DOM for reliable SVG rendering
  useEffect(() => {
    if (!pathRef.current || isHero || reduceMotion) return;
    const unsubscribe = strokeDasharrayMotion.on('change', (val) => {
      if (pathRef.current) {
        pathRef.current.style.strokeDasharray = String(val);
      }
    });
    const unsubscribe2 = strokeDashoffsetMotion.on('change', (val) => {
      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = String(val);
      }
    });
    return () => {
      unsubscribe?.();
      unsubscribe2?.();
    };
  }, [strokeDasharrayMotion, strokeDashoffsetMotion, isHero, reduceMotion]);

  // The "you are here" marker rides the trail: with the hero's load draw, and with
  // scroll progress in the journey map. Positioned by direct DOM writes — a state
  // update per scroll frame would re-render every pin, and this runs at 60fps.
  const pathRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const heroDraw = useMotionValue(0);
  const driver = isHero ? heroDraw : pathProgress;
  // For hero: animate stroke-dasharray/offset directly
  const heroStrokeDasharrayMotion = useTransform(heroDraw, (v) => totalLength > 0 ? `${v * totalLength} ${totalLength}` : '0 0');
  const heroStrokeDashoffsetMotion = useTransform(heroDraw, (v) => totalLength > 0 ? (1 - v) * totalLength : 0);
  // Apply directly to DOM for reliable SVG rendering
  useEffect(() => {
    if (!pathRef.current || !isHero || reduceMotion) return;
    const unsubscribe = heroStrokeDasharrayMotion.on('change', (val) => {
      if (pathRef.current) {
        pathRef.current.style.strokeDasharray = String(val);
      }
    });
    const unsubscribe2 = heroStrokeDashoffsetMotion.on('change', (val) => {
      if (pathRef.current) {
        pathRef.current.style.strokeDashoffset = String(val);
      }
    });
    return () => {
      unsubscribe?.();
      unsubscribe2?.();
    };
  }, [heroStrokeDasharrayMotion, heroStrokeDashoffsetMotion, isHero, reduceMotion]);

  useEffect(() => {
    if (!isHero || reduceMotion) return;
    const controls = animate(heroDraw, 1, { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 });
    return () => controls.stop();
  }, [isHero, reduceMotion, heroDraw]);

  useMotionValueEvent(driver, 'change', (v) => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker || typeof path.getTotalLength !== 'function') return;
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
    if (!path || !marker || typeof path.getTotalLength !== 'function') return;
    const end = path.getPointAtLength(path.getTotalLength());
    marker.style.left = `${end.x}%`;
    marker.style.top = `${end.y}%`;
    marker.style.opacity = '1';
  }, [reduceMotion]);

  // One establishing scene of parallax (the hero map), per the motion guidelines.
  const contourY = useTransform(scrollYProgress, [0, 1], ['-1.6%', '1.6%']);

  const travel = (era: Era) => {
    const target = `#era-${era.id}`;
    if (lenis) lenis.scrollTo(target);
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

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
                onClick={() => travel(era)}
                aria-label={`Travel to ${era.company}`}
                title={era.company}
                className={`whitespace-nowrap rounded-none border px-2 py-1 font-[family-name:var(--font-data)] text-[10px] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] ${
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
