'use client';

// Shared modal lock: overlays (WaypointPalette, CaseStudyDossier) coordinate
// through one counter so a stacked pair — palette opened over an open dossier
// — can't restart Lenis or restore body scroll while the other is still up.
// Only the last overlay to close releases the page, and the page's true
// overflow is captured once at the FIRST lock so restores are FIFO-safe no
// matter which overlay closes first.
import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

let lockCount = 0;
let preLockOverflow = '';

/** How many overlays currently hold the lock (0 = page is scrollable). */
export function modalLockCount(): number {
  return lockCount;
}

export function useModalLock(open: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lockCount += 1;
    if (lockCount === 1) {
      lenis?.stop();
      preLockOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        lenis?.start();
        document.body.style.overflow = preLockOverflow;
      }
    };
  }, [open, lenis]);
}
