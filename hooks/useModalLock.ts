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

// ── Background inertness for portal-rendered dialogs ─────────────────────
//
// While a div-based dialog (palette/dossier) is open, everything behind it
// must leave the tab order and the accessibility tree (WAI-ARIA modal dialog
// pattern). Those dialogs render through portals as direct <body> children
// tagged [data-modal-dialog], so every OTHER body child is background.
// `inert` is used instead of aria-hidden: it removes the subtree from the a11y
// tree without aria-hidden's "ancestor of the focused element" footgun, and
// browsers that don't support it simply ignore it (the document-level Tab
// trap and focus reclaim in each dialog cover the keyboard path there).
// The camp lightbox does not use this: a native <dialog> shown with
// showModal() already inerts the background via the top layer.
let inertCount = 0;

export function useBackgroundInert(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const background = Array.from(document.body.children).filter(
      (el) => !(el instanceof HTMLElement && el.hasAttribute('data-modal-dialog')),
    );
    inertCount += 1;
    if (inertCount === 1) {
      background.forEach((el) => el.setAttribute('inert', ''));
    }
    return () => {
      inertCount -= 1;
      if (inertCount === 0) {
        background.forEach((el) => el.removeAttribute('inert'));
      }
    };
  }, [open]);
}
