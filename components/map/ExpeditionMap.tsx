'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  mapLabel,
}: {
  activeId: string | null;
  className?: string;
  /** Set only for the above-the-fold (hero) instance so the LCP image is not lazy. */
  priority?: boolean;
  /** Waypoint chips are on by default; the hero draws them too — that's the navigation. */
  showLabels?: boolean;
  /**
   * Distinguishes the two map instances for assistive tech: the hero and the
   * journey render identical waypoint buttons, and without this each
   * destination is announced twice with no way to tell them apart.
   */
  mapLabel?: string;
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
  // scroll progress in the journey map. Positioned by direct DOM writes from a
  // pre-sampled cache — a state update per scroll frame would re-render every
  // pin, and this runs at 60fps with zero SVG geometry calls per frame.
  const pathRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  // Trail sample cache: getPointAtLength is pre-sampled once per mount, so the
  // per-frame handler interpolates between samples instead of calling SVG
  // geometry APIs every frame.
  const samplesRef = useRef<Pt[] | null>(null);
  // Container px size cache: the svg is preserveAspectRatio="none", so viewBox
  // units (0-100) are literally % of the box — % maps to px via these.
  const sizeRef = useRef<{ w: number; h: number } | null>(null);
  const lastProgressRef = useRef(0);

  // Positions the traveller from the sample cache. Pure DOM writes — safe to
  // call on every frame and again on resize. Stable identity: it only touches
  // refs, and the motion-value subscription below would otherwise re-bind on
  // every render.
  const applyMarker = useCallback((v: number) => {
    const marker = markerRef.current;
    const samples = samplesRef.current;
    const size = sizeRef.current;
    if (!marker || !samples || samples.length < 2 || !size) return;
    const clamped = Math.max(0, Math.min(1, v));
    const idx = clamped * (samples.length - 1);
    const i = Math.floor(idx);
    const j = Math.min(samples.length - 1, i + 1);
    const t = idx - i;
    const x = samples[i].x + (samples[j].x - samples[i].x) * t;
    const y = samples[i].y + (samples[j].y - samples[i].y) * t;
    // The old translate(-50%, -50%) centring folds into the same transform.
    marker.style.transform = `translate(calc(${(x / 100) * size.w}px - 50%), calc(${(y / 100) * size.h}px - 50%))`;
    marker.style.opacity = clamped < 0.005 ? '0' : '1';
    lastProgressRef.current = clamped;
  }, []);

  // Measure + pre-sample the trail once per mount; keep the px cache fresh on
  // resize (the marker is repositioned from the cached progress).
  useEffect(() => {
    const container = ref.current;
    const path = pathRef.current;
    if (!container) return;
    sizeRef.current = { w: container.clientWidth, h: container.clientHeight };
    // Guard: jsdom (and non-browser SVG impls) lack SVGGeometryElement APIs —
    // skip measuring and sampling entirely when they are unavailable.
    if (path && typeof path.getTotalLength === 'function' && typeof path.getPointAtLength === 'function') {
      const total = path.getTotalLength();
      setTotalLength(total);
      const SAMPLE_COUNT = 200;
      const samples: Pt[] = [];
      for (let i = 0; i < SAMPLE_COUNT; i++) {
        const p = path.getPointAtLength((i / (SAMPLE_COUNT - 1)) * total);
        samples.push({ x: p.x, y: p.y });
      }
      samplesRef.current = samples;
    }
    if (typeof ResizeObserver === 'undefined') return; // jsdom guard
    const observer = new ResizeObserver(() => {
      sizeRef.current = { w: container.clientWidth, h: container.clientHeight };
      applyMarker(lastProgressRef.current);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [applyMarker]);

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

  useMotionValueEvent(driver, 'change', applyMarker);

  // Reduced motion: no draw, no ride — park the marker at the destination (2026)
  // using the last trail sample (applyMarker(1) interpolates to samples[N-1]).
  useEffect(() => {
    if (!reduceMotion) return;
    const marker = markerRef.current;
    if (!marker || !samplesRef.current) return; // jsdom/geometry guard
    applyMarker(1);
  }, [reduceMotion, applyMarker]);

  // One establishing scene of parallax (the hero map), per the motion guidelines.
  const contourY = useTransform(scrollYProgress, [0, 1], ['-1.6%', '1.6%']);

  const travel = (era: Era) => {
    const target = `#era-${era.id}`;
    if (lenis) lenis.scrollTo(target);
    else
      // Pre-hydration fallback: no animated scroll under reduced motion.
      document.querySelector(target)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
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
      {/* the traveller: rides the trail with the draw / with scroll. Anchored
          at left:0/top:0 and moved via transform from the px cache; the
          (-50%,-50%) centring is folded into the per-frame transform. */}
      <span
        ref={markerRef}
        aria-hidden
        className="pointer-events-none absolute z-10 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-rust)] bg-[var(--color-parchment)] shadow-[0_0_0_3px_rgba(243,237,226,0.85)]"
        style={{ left: 0, top: 0, opacity: 0, transform: 'translate(-50%, -50%)' }}
      >
        <span className="absolute inset-[2px] rounded-full bg-[var(--color-rust)]" />
      </span>
      {showLabels && (
        // overflow-clip: the chips' nowrap layout boxes hang past the map on
        // narrow viewports (Blink counts the pre-transform box in scrollable
        // overflow → 10-16px horizontal overflow). clip never creates a scroll
        // container. overflow-clip-margin keeps the chips' visual overhang
        // (top translate ≈ 32px, rotated right edge ≈ 20px) painting freely;
        // it also widens the scrollable overflow by that margin on every side,
        // so it must stay under the hero's px-10 (40px) viewport slack — 36px
        // keeps 320px viewports overflow-free while covering the overhang.
        <ul
          role="list"
          aria-label={mapLabel ? `Career waypoints — ${mapLabel}` : 'Career waypoints'}
          className="absolute inset-0 overflow-clip [overflow-clip-margin:36px]"
        >
          {eras.map((era) => (
            // Zero-size anchor: the chip's layout box must not widen the
            // document on narrow viewports (the button's translate(-50%)
            // centres it visually, and post-transform boxes don't overflow).
            <li key={era.id} className="absolute h-0 w-0" style={{ left: `${era.coords.x}%`, top: `${era.coords.y}%` }}>
              <button
                type="button"
                onClick={() => travel(era)}
                aria-label={mapLabel ? `Travel to ${era.company} (${mapLabel})` : `Travel to ${era.company}`}
                title={era.company}
                className={`inline-flex min-h-[24px] items-center whitespace-nowrap rounded-none border px-2 py-1 font-[family-name:var(--font-data)] text-[10px] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] ${
                  activeId === era.id
                    ? 'border-[var(--color-rust)] bg-[var(--color-rust)] text-[var(--color-on-rust)]'
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
