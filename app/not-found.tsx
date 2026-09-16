// app/not-found.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

// Explicit noindex: without it the layout's "index, follow" robots meta and
// Next's auto noindex both land in 404.html (two conflicting directives).
export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

/**
 * Unknown route — a coordinate off the edge of the map. One way out: home.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-6 py-24">
      <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
        UNCHARTED COORDINATE
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
        Off the map.
      </h1>
      <p className="mt-4 font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]/85">
        This route isn’t on any survey we hold — the trail ends here. Head back
        to the last known waypoint and pick up the route from there.
      </p>
      <Link
        href="/"
        className="mt-8 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[3px_3px_0_var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
      >
        Return to the trailhead
      </Link>
    </div>
  );
}
