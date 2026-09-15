// app/error.tsx
'use client';

import { useEffect } from 'react';

/**
 * Route error boundary — a dropped dispatch, not a dead end. The retry
 * re-renders the route segment in place; the link walks back to the trailhead.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Surfaced in the console/observability; the page itself stays on-brand.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-start justify-center px-6 py-24">
      <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
        FIELD NOTE — TRANSMISSION FAILED
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
        Signal lost.
      </h1>
      <p className="mt-4 font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]/85">
        The dispatch you asked for didn’t come through — something failed on our
        side of the radio. Re-dial, or walk back to the trailhead.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[3px_3px_0_var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
        >
          Retry the transmission
        </button>
        <a
          href="/"
          className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)] focus-visible:outline-offset-2"
        >
          Back to the trail
        </a>
      </div>
    </div>
  );
}
