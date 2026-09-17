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

/** Trail sync anchor: a page scroll position paired with the trail progress it must produce. */
export interface TrailAnchor {
  /** Page scrollY (px) at which the trail reaches fraction f. */
  y: number;
  /** Path-length fraction (0–1) of the trail at that scroll position. */
  f: number;
}

/**
 * Cumulative path-length fraction of each era's waypoint, from the mount-time
 * sample cache. The trail visits waypoints in order, so each nearest-sample
 * search starts where the previous one ended (monotonic); the jittered Q
 * control points sit off the curve and cannot steal a match because waypoints
 * are ~20 units apart against at most 1.6 units of jitter.
 */
export function waypointFractions(samples: Pt[]): number[] {
  const fallback = eras.map((_, i) => (eras.length === 1 ? 0 : i / (eras.length - 1)));
  if (samples.length < 2) return fallback;
  const fractions: number[] = [];
  let from = 0;
  for (const era of eras) {
    let best = from;
    let bestDist = Infinity;
    for (let i = from; i < samples.length; i++) {
      const dx = samples[i].x - era.coords.x;
      const dy = samples[i].y - era.coords.y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    fractions.push(best / (samples.length - 1));
    from = best;
  }
  return fractions;
}

/**
 * Piecewise-linear scroll → trail-progress map over the chapter anchors.
 * Below the first anchor the traveller waits at the trailhead; above the last
 * it rests at the destination — the story, not the section's viewport transit,
 * defines 0 and 1. Between anchors it interpolates proportionally to scroll,
 * so the traveller crosses each segment while the reader scrolls between the
 * two chapters that bracket it.
 */
export function trailProgressAt(scrollY: number, anchors: TrailAnchor[]): number {
  if (anchors.length === 0) return 0;
  if (scrollY <= anchors[0].y) return anchors[0].f;
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    if (scrollY <= b.y) {
      const t = b.y === a.y ? 1 : (scrollY - a.y) / (b.y - a.y);
      return a.f + (b.f - a.f) * t;
    }
  }
  return anchors[anchors.length - 1].f;
}

export function ExpeditionMap({
  activeId,
  className = 'aspect-[3/2]',
  priority = false,
  showLabels = true,
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
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const isHero = priority;
  // Hero: the trail draws itself once on load. Journey: it draws as you travel.
  // This viewport-transit scroll pass drives ONLY the hero's contour parallax
  // (one establishing scene) — it must never drive the journey trail: its
  // ['start end','end start'] window includes the section's enter/exit phases,
  // which desyncs the draw from the active chapter (the bug this replaces).
  const { scrollYProgress: viewProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const contourY = useTransform(viewProgress, [0, 1], ['-1.6%', '1.6%']);
  // Journey trail: page scroll mapped through the chapter anchors (below).
  const { scrollY } = useScroll();
  const rawProgress = useMotionValue(0);
  // Near-critical damping (ζ ≈ 1): smooths scroll jitter without trailing the
  // story. The previous 60/20 spring lagged the active chapter by ~0.5s.
  const pathProgress = useSpring(rawProgress, { stiffness: 130, damping: 23 });
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
  // Story-sync state: anchor list (scrollY ↔ trail fraction per chapter) and
  // whether the reader has reached the first chapter — the traveller is shown
  // at the trailhead from that moment on, even at fraction 0.
  const anchorsRef = useRef<TrailAnchor[]>([]);
  const storyStartedRef = useRef(false);

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
    // Visible once the draw has started — or, for the journey map, from the
    // moment the story starts (the traveller stands on the origin waypoint
    // while chapter 1 is active, at fraction 0).
    marker.style.opacity = clamped < 0.005 && !storyStartedRef.current ? '0' : '1';
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

  // ── Story sync (journey instance) ─────────────────────────────────────────
  // The trail is a function of the story, not of the section's viewport
  // transit. Each waypoint's path fraction (waypointFractions over the sample
  // cache) is anchored to the page scrollY at which its chapter centres — the
  // same moment useActiveEra's centre band highlights the pin — and the
  // traveller interpolates between anchors as the reader scrolls between
  // chapters. Anchors recompute on window resize and whenever a chapter changes
  // height (the press-ledger fold), via a ResizeObserver per chapter.
  useEffect(() => {
    if (isHero || reduceMotion) return;
    const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-era]'));
    if (chapters.length === 0) return;
    const fallback = chapters.map((_, i) => (chapters.length === 1 ? 0 : i / (chapters.length - 1)));
    const recompute = () => {
      const fractions = samplesRef.current ? waypointFractions(samplesRef.current) : fallback;
      anchorsRef.current = chapters.map((chapter, i) => {
        const rect = chapter.getBoundingClientRect();
        return {
          y: rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2,
          f: fractions[i] ?? fallback[i] ?? 0,
        };
      });
      const y = scrollY.get();
      storyStartedRef.current = y >= anchorsRef.current[0].y;
      rawProgress.set(trailProgressAt(y, anchorsRef.current));
    };
    recompute();
    const unsubscribe = scrollY.on('change', (y) => {
      const anchors = anchorsRef.current;
      storyStartedRef.current = anchors.length > 0 && y >= anchors[0].y;
      rawProgress.set(trailProgressAt(y, anchors));
    });
    window.addEventListener('resize', recompute);
    const observers: ResizeObserver[] = [];
    if (typeof ResizeObserver !== 'undefined') {
      // jsdom guard — matches the marker cache observer above.
      for (const chapter of chapters) {
        const observer = new ResizeObserver(recompute);
        observer.observe(chapter);
        observers.push(observer);
      }
    }
    return () => {
      unsubscribe?.();
      window.removeEventListener('resize', recompute);
      for (const observer of observers) observer.disconnect();
    };
  }, [isHero, reduceMotion, scrollY, rawProgress]);

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
