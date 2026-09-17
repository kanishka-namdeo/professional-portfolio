// components/journey/CaseStudyDossier.tsx
// The "read without leaving" surface for a case study: the chapter's stamp
// link stays a real anchor (no-JS visitors and crawlers land on the themed
// route), but with JS a click opens the dossier as a full-screen overlay
// instead — same theme, scroll position behind it untouched, Esc/button to
// return exactly where the reader was. Focus handling mirrors
// WaypointPalette: stop Lenis, trap Tab, restore focus on close.
//
// The document and its renderer load lazily on first open: the case-study
// text is ~25KB of source most trail readers never open, so it must not sit
// in the home page's critical chunk. The standalone /case-study/rentlz route
// keeps its own static import — crawlers and no-JS visitors lose nothing.
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { useBackgroundInert, useModalLock } from '@/hooks/useModalLock';
import type { CaseStudyDoc } from '@/data/caseStudy';

type CaseStudyArticleComponent = ComponentType<{ doc: CaseStudyDoc; titleAs?: 'h1' | 'h2' }>;

export function CaseStudyDossier({ href, label }: { href: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [article, setArticle] = useState<{ doc: CaseStudyDoc; Article: CaseStudyArticleComponent } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<Element | null>(null);

  // Stop the page's Lenis engine while reading so wheel input can't scroll
  // the trail behind the dossier; body overflow guards non-Lenis fallbacks.
  // The shared lock keeps this composable with the ⌘K palette if both are up.
  useModalLock(open);

  // Document-level keyboard handling while open. A React onKeyDown on the
  // dialog div only sees events that bubble THROUGH that div — but clicking
  // the article's non-focusable text parks focus on a focusable ancestor
  // OUTSIDE the dialog, and keydowns then target that ancestor: Escape died
  // and Tab roamed the background while the reader stayed locked inside
  // (verified in Chromium). Document-level listeners work no matter where
  // focus sits, and a focusin reclaim pulls stray focus back into the panel
  // (belt-and-braces for browsers without `inert` support).
  // Declared before the focus-restore effect so the listeners are detached
  // before that effect's cleanup moves focus back to the stamp link.
  useEffect(() => {
    if (!open) return;
    const onDocKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = panelRef.current.contains(active);
      // Wrap in both directions, including Tab from outside the panel (focus
      // parked on an ancestor by a text click) — forward Tab must re-enter
      // the panel at the first item, never leak past it.
      if (event.shiftKey) {
        if (active === first || !inside) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !inside) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      // Focus changes that stay inside the panel are fine…
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return;
      // …anything else (background click, programmatic focus) gets reclaimed
      // into the dossier's close button.
      closeRef.current?.focus();
    };
    document.addEventListener('keydown', onDocKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onDocKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  // Everything behind the portal-rendered dialog leaves the tab order and
  // the accessibility tree while it is open (WAI-ARIA modal dialog pattern).
  // Must detach before the focus-restore effect below runs, so the stamp
  // link is focusable again (not inert) at the moment focus returns to it.
  useBackgroundInert(open);

  // Load document + renderer on first open, guarded against unmount.
  useEffect(() => {
    if (!open || article) return;
    let alive = true;
    void Promise.all([import('@/data/caseStudy'), import('./CaseStudyArticle')])
      .then(([{ rentlzCaseStudy }, { CaseStudyArticle }]) => {
        if (alive) setArticle({ doc: rentlzCaseStudy, Article: CaseStudyArticle });
      })
      .catch(() => {
        // Loading the overlay content is best-effort; the stamp link's route
        // remains the fallback surface for the same document.
      });
    return () => {
      alive = false;
    };
  }, [open, article]);

  const openFromLink = () => {
    // Capture the trigger at interaction time — the background-inert effect
    // (see useBackgroundInert) kicks focus off the stamp link before an
    // open-effect could read it (inert content can't hold focus).
    restoreFocus.current = document.activeElement;
    setOpen(true);
  };

  // Focus handling: move focus to the close button after paint, and restore
  // the trigger on close (every close path — the cleanup runs on unmount too,
  // so route changes can't strand focus).
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      // Runs after the inert release's cleanup (declared earlier), so the
      // stamp link is focusable again by now.
      if (restoreFocus.current instanceof HTMLElement) restoreFocus.current.focus();
      restoreFocus.current = null;
    };
  }, [open]);

  return (
    <>
      {/* next/link rewrites the href with the deploy basePath (a raw <a> does
          not), so no-JS visitors on the GitHub Pages mirror still land on the
          themed route instead of a 404. Modifier-clicks (new tab/window) fall
          through to the browser instead of being swallowed by the overlay. */}
      <Link
        href={href}
        onClick={(event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openFromLink();
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-block border border-[var(--color-ink)]/30 bg-[var(--color-paper)]/60 px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink)]/70 transition-colors duration-150 hover:border-[var(--color-rust)] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
      >
        {label}
      </Link>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={article?.doc.title ?? label}
            data-modal-dialog="dossier"
            className="fixed inset-0 z-[70] bg-[var(--color-ink)]/40"
          >
            <div
              ref={panelRef}
              // data-lenis-prevent: while this dialog is open Lenis is STOPPED,
              // and a stopped Lenis preventDefaults every wheel event unless
              // it starts inside a data-lenis-prevent element — without this
              // the article could not be wheel-scrolled at all (same reason
              // the palette's listbox carries it). overscroll-contain stops
              // scroll chaining at the panel's boundaries.
              data-lenis-prevent
              className="h-full overflow-y-auto overscroll-contain bg-[var(--color-parchment)]"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
            <div className="sticky top-0 z-10 border-b border-[var(--color-inkline)] bg-[var(--color-parchment)]/95 backdrop-blur-sm">
              <div className="mx-auto flex max-w-[760px] items-center justify-between gap-4 px-6 py-3">
                <p className="truncate font-[family-name:var(--font-data)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                  {article?.doc.eyebrow ?? ''}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 border border-[var(--color-ink)]/30 px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-rust)] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
                >
                  Close ×
                </button>
              </div>
            </div>
            <div className="mx-auto max-w-[760px] px-6 pb-20 pt-10">
              {article ? (
                <article.Article doc={article.doc} />
              ) : (
                <p role="status" className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                  Opening the dossier…
                </p>
              )}
            </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
