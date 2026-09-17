// components/MobileTrailChip.tsx
'use client';

import { useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { eras } from '@/data/journey';
import { useActiveEra } from '@/hooks/useActiveEra';
import { OPEN_PALETTE_EVENT } from './WaypointPalette';

/**
 * The trail rail's mobile counterpart: a fixed bottom-centre chip showing the
 * current waypoint and how much of the trail has been travelled, e.g.
 * "03 · Medulla.AI · 41%". Below md the rail is hidden, so this is the only
 * scroll readout — and the tap target (≥44px) that opens the waypoint
 * palette, via the same OPEN_PALETTE_EVENT the rail's ⌘K button dispatches.
 */
export function MobileTrailChip() {
  const { scrollYProgress } = useScroll();
  const activeId = useActiveEra();
  // Discrete, whole-percent state — one small update per scroll tick, cheap
  // enough for mobile (the desktop rail writes to a ref instead; it never
  // re-renders, this chip must, to swap the waypoint readout).
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPercent(Math.round(Math.max(0, Math.min(1, v)) * 100));
  });

  const activeIndex = eras.findIndex((era) => era.id === activeId);
  const current = activeIndex >= 0 ? eras[activeIndex] : null;

  return (
    <button
      type="button"
      onClick={(event) => {
        // Safari does not focus buttons on tap — focus it manually so the
        // palette's close restores the keyboard position here instead of
        // dropping the reader back at the page top.
        event.currentTarget.focus();
        window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
      }}
      aria-haspopup="dialog"
      // Label in Name (WCAG 2.5.3): the accessible name must contain the
      // visible readout ("03 · MoveInSync · 41%") so speech input matches.
      aria-label={
        current
          ? `Open waypoint jumper — ${current.number} · ${current.short} · ${percent}%`
          : 'Open waypoint jumper — en route'
      }
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex min-h-[44px] -translate-x-1/2 items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-parchment)] px-4 py-2 font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)] shadow-[3px_3px_0_var(--color-shadow-hard)] md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-rust)]" />
      <span>
        {current ? `${current.number} · ${current.short}` : 'en route'}
        <span className="text-[var(--color-ink-muted)]"> · </span>
        <span className="text-[var(--color-rust)]">{percent}%</span>
      </span>
    </button>
  );
}
