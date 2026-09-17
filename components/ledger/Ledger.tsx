'use client';

import type { KeyboardEvent } from 'react';
import { ledgerRepos, writing } from '@/data/ledger';

/**
 * Scrollable-region pattern for the horizontal writing strip: when focus is
 * inside it (the container or any card link), keys drive horizontal scroll,
 * so the "scroll sideways" affordance works without a mouse.
 */
function onStripKeyDown(event: KeyboardEvent<HTMLUListElement>) {
  const el = event.currentTarget;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  const page = el.clientWidth * 0.8;
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      el.scrollBy({ left: page, behavior });
      break;
    case 'ArrowLeft':
      event.preventDefault();
      el.scrollBy({ left: -page, behavior });
      break;
    case 'PageDown':
      event.preventDefault();
      el.scrollBy({ left: page, behavior });
      break;
    case 'PageUp':
      event.preventDefault();
      el.scrollBy({ left: -page, behavior });
      break;
    case 'Home':
      event.preventDefault();
      el.scrollTo({ left: 0, behavior });
      break;
    case 'End':
      event.preventDefault();
      el.scrollTo({ left: el.scrollWidth, behavior });
      break;
    default:
      break;
  }
}

export function Ledger() {
  return (
    // tabIndex={-1}: skip/anchor jumps land focus here (see [tabindex='-1']
    // in globals.css).
    <section
      id="ledger"
      aria-labelledby="ledger-title"
      className="border-t border-[var(--color-inkline)] py-24"
      tabIndex={-1}
    >
      {/* No content-visibility:auto here, deliberately: its ~1000px placeholder
          swaps to the real height the moment the section first renders
          mid-scroll — a one-frame layout jump while Lenis is mid-lerp, which
          reads as a flash. The section is ~20 rows + 5 cards; rendering it
          eagerly costs nothing. */}
      <div className="mx-auto max-w-4xl px-6">
        <h2 id="ledger-title" className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">THE LEDGER — everything else, plainly</h2>
        <ul className="mt-8 divide-y divide-[var(--color-inkline)]">
          {ledgerRepos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 hover:bg-[var(--color-hover)] focus-visible:bg-[var(--color-hover)] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-[var(--color-rust)]">
                <span className="font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-rust)]">{r.name}</span>
                {/* min-w-0: let the one-liner column shrink below min-content so
                    the year never pushes past the viewport on narrow screens. */}
                <span className="min-w-0 font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]/75">{r.oneLiner}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">{r.language} · {r.year}</span>
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-14 font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">FIELD WRITING</h3>
        <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">
          Scroll sideways — a dispatch per card. <span aria-hidden>→</span>{' '}
          <span>Arrow keys scroll when focused.</span>
        </p>
        {/* Horizontal snap strip: variety against the vertical ledger, and the
            articles read as dispatches rather than another plain list. */}
        <ul
          role="list"
          tabIndex={0}
          aria-label="Field writing — scroll horizontally with the arrow keys"
          onKeyDown={onStripKeyDown}
          className="-mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
        >
          {writing.map((w) => (
            <li key={w.url} className="w-80 shrink-0 snap-start">
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col border border-[var(--color-ink)]/20 bg-[var(--color-paper)]/60 transition-colors hover:bg-[var(--color-paper)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-rust)]"
              >
                {/* Raw <img> is deliberate: remote Medium thumbnails can't go
                    through next/image on the static export, CSP img-src is
                    scoped to *.medium.com, and the aspect box prevents CLS. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.image}
                  alt=""
                  role="presentation"
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex h-full flex-col justify-between p-5">
                  <span className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">
                    {w.date} · {w.readTime}
                  </span>
                  <span className="mt-3 font-[family-name:var(--font-voice)] text-lg leading-snug text-[var(--color-ink)]">
                    {w.title}
                  </span>
                  <span className="mt-2 font-[family-name:var(--font-voice)] text-sm leading-snug text-[var(--color-ink-muted)]">
                    {w.subtitle}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-[family-name:var(--font-data)] text-sm">
          <a href="https://medium.com/@kanishkanamdeo" target="_blank" rel="noopener noreferrer" className="text-[var(--color-rust)] underline decoration-[var(--color-rust)]/30 underline-offset-4 hover:decoration-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2">See all writing on Medium →</a>
        </p>
      </div>
    </section>
  );
}
