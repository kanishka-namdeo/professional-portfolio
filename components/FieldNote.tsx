'use client';

import Image from 'next/image';
import { useTrailComplete } from '@/hooks/useVisitedEras';

/**
 * Easter egg: a hidden field note that surfaces only for readers who travel
 * the whole trail (all five waypoints). It rewards completion with the most
 * personal thing on the site — the first project ever shipped.
 */
export function FieldNote() {
  const complete = useTrailComplete();
  if (!complete) return null;

  return (
    <aside
      aria-label="Hidden field note — you travelled the whole trail"
      className="mt-14 max-w-md rotate-[-0.8deg] border border-[var(--color-ink)]/25 bg-[var(--color-notepaper)] p-5 shadow-[3px_4px_8px_var(--color-shadow-soft)]"
    >
      {/* --color-rust-text: small (10-12px) rust text on the dark notepaper
          needs its own token — #CE7448 computes 4.18:1 there (WCAG 1.4.3). */}
      <p className="flex items-center gap-2 font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-rust-text)]">
        <span aria-hidden className="inline-block border border-[var(--color-rust)] px-1 py-[1px]">Field note</span>
        reward for completing the trail
      </p>
      <div className="relative mx-auto mt-4 h-28 w-28 overflow-hidden rounded-full border border-[var(--color-ink)]/15">
        <Image
          src="/field-note-vignette.webp"
          alt=""
          width={480}
          height={480}
          className="h-full w-full object-cover"
          loading="lazy"
          aria-hidden
        />
      </div>
      <p className="mt-3 font-[family-name:var(--font-voice)] text-base leading-relaxed text-[var(--color-ink)]">
        You made it the whole way — most people stop at the first waypoint.
        Since you made it: the very first thing I ever shipped was a tribute to
        Pokémon, built the night before a deadline that didn’t exist. The repo’s
        still up, and it’s still mine.
      </p>
      <p className="mt-3">
        <a
          href="https://github.com/kanishka-namdeo/the-pokemon-journey"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-data)] text-xs text-[var(--color-rust-text)] underline decoration-dotted underline-offset-4 hover:decoration-solid"
        >
          the-pokemon-journey ↗
        </a>
      </p>
    </aside>
  );
}
