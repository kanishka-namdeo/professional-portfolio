// components/TrailProgress.tsx
'use client';

import { useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';
import { useActiveEra } from '@/hooks/useActiveEra';
import { MobileTrailChip } from './MobileTrailChip';
import { OPEN_PALETTE_EVENT } from './WaypointPalette';

/**
 * Fixed right-edge rail: a vertical track whose rust fill follows scroll,
 * a live "you are here" readout, and 01–05 jump buttons.
 *
 * Keyboard: focus the rail and use ↑/↓ (Home/End for first/last). These jumps
 * are instant, not animated — keyboard-initiated actions repeat, and animating
 * them makes the page feel slow.
 */
export function TrailProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion() ?? false;
  // Rail fill: springy for mouse travellers; under reduced motion the raw
  // scroll progress drives it directly (no lag/overshoot animation).
  const springProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const progress = reduceMotion ? scrollYProgress : springProgress;
  const lenis = useLenis();
  const activeId = useActiveEra();
  const navRef = useRef<HTMLElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  // Honest readout: how much of the page (the trail) has been travelled.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (percentRef.current) {
      percentRef.current.textContent = `${String(Math.round(Math.max(0, Math.min(1, v)) * 100)).padStart(2, '0')}%`;
    }
  });

  const activeIndex = eras.findIndex((era) => era.id === activeId);
  const current = activeIndex >= 0 ? eras[activeIndex] : null;

  const jumpTo = (index: number) => {
    const era = eras[Math.max(0, Math.min(eras.length - 1, index))];
    if (!era) return;
    if (lenis) lenis.scrollTo(`#era-${era.id}`, { immediate: true });
    else document.getElementById(`era-${era.id}`)?.scrollIntoView();
  };

  // Mouse travel stays smooth (Lenis default); keyboard jumps above are instant.
  const travelMouse = (era: (typeof eras)[number]) => {
    const target = `#era-${era.id}`;
    if (lenis) lenis.scrollTo(target);
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const base = activeIndex >= 0 ? activeIndex : 0;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        jumpTo(base + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        jumpTo(base - 1);
        break;
      case 'Home':
        event.preventDefault();
        jumpTo(0);
        break;
      case 'End':
        event.preventDefault();
        jumpTo(eras.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Trail progress"
        onKeyDown={onKeyDown}
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      >
        <div className="flex items-stretch gap-2">
          <ul role="list" className="flex flex-col justify-between py-px">
            {eras.map((era) => (
              <li key={era.id}>
                <button
                  type="button"
                  onClick={() => travelMouse(era)}
                  aria-label={`Travel to ${era.company} (${era.number})`}
                  aria-current={activeId === era.id ? 'step' : undefined}
                  className={`flex min-h-[24px] min-w-[24px] items-center justify-center font-[family-name:var(--font-data)] text-[10px] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] ${
                    activeId === era.id ? 'text-[var(--color-rust)]' : 'text-[var(--color-ink-muted)]'
                  }`}
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
        <p
          aria-live="polite"
          className="mt-2 text-right font-[family-name:var(--font-data)] text-[10px] leading-tight text-[var(--color-ink-muted)]"
        >
          {current ? (
            <>
              <span className="text-[var(--color-rust)]">{current.number}</span> / {`0${eras.length}`}
              <span className="block text-[var(--color-ink)]/75">{current.short}</span>
            </>
          ) : (
            <>
              <span>00 / {`0${eras.length}`}</span>
              <span className="block">en route</span>
            </>
          )}
          <span className="mt-1 block">↑↓ to travel</span>
        </p>
        <p className="mt-2 text-right font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink-muted)]">
          <span ref={percentRef}>00%</span> of the trail
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
          className="mt-2 flex min-h-[24px] w-full items-center justify-end text-right font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink-muted)] hover:text-[var(--color-rust)] focus-visible:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
          aria-label="Open the waypoint jumper"
        >
          ⌘K jump
        </button>
      </nav>
      {/* Mobile counterpart: below md the rail is hidden, so the bottom chip
          is the trail readout and the tap target that opens this palette. */}
      <MobileTrailChip />
    </>
  );
}
