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
import { useModalLock } from '@/hooks/useModalLock';
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

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      if (restoreFocus.current instanceof HTMLElement) restoreFocus.current.focus();
      restoreFocus.current = null;
    };
  }, [open]);

  // Confine Tab to the dossier panel (close button + links inside the article);
  // Esc closes and returns the reader to their exact place on the trail.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-block border border-[var(--color-ink)]/30 bg-[var(--color-paper)]/60 px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-ink)]/70 transition-colors duration-150 hover:border-[var(--color-rust)] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
      >
        {label}
      </Link>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={article?.doc.title ?? label}
          data-modal-dialog="dossier"
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[70] bg-[var(--color-ink)]/40"
        >
          <div
            ref={panelRef}
            className="h-full overflow-y-auto bg-[var(--color-parchment)]"
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
        </div>
      )}
    </>
  );
}
