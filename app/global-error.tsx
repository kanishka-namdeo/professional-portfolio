// app/global-error.tsx
'use client';

import { useEffect } from 'react';

/**
 * Root-level error boundary — the last radio before a white screen. app/error.tsx
 * only catches segment errors below the root layout; a crash in the layout tree
 * itself (ReactLenis, ThemeToggle, Analytics) lands here. Must render its own
 * <html>/<body> per the Next.js App Router contract, so it carries the theme
 * pre-paint snippet to keep dark readers out of a light flash.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('dispatches-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ margin: 0, background: '#F3EDE2', color: '#2E281E', fontFamily: 'Georgia, serif' }}>
        <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', color: '#A34A2A', fontFamily: 'monospace' }}>
            FIELD NOTE — TRANSMISSION FAILED
          </p>
          <h1 style={{ fontSize: '2.25rem', margin: '0.75rem 0 0' }}>Signal lost.</h1>
          <p style={{ lineHeight: 1.6 }}>
            The whole field log failed to come through this time — something broke on our
            side of the radio. Re-dial, or walk back to the trailhead.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: '1px solid #2E281E',
                background: '#2E281E',
                color: '#F3EDE2',
                padding: '0.75rem 1.25rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Retry the transmission
            </button>
            {/* A raw anchor is required here: global-error renders outside the
                crashed root layout, where next/link's router context no longer
                exists — a <Link> would itself throw. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                border: '1px solid #2E281E',
                color: '#2E281E',
                padding: '0.75rem 1.25rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Back to the trail
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
