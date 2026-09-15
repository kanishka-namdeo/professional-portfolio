'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dispatches-theme';

function setThemeMeta(dark: boolean) {
  // layout.tsx emits two media-scoped metas (light + dark); after a toggle the
  // active palette wins everywhere, so point both at the active colour.
  const color = dark ? '#1E1913' : '#F3EDE2';
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color);
  });
}

/**
 * Fixed top-right corner: the day/night switch for the Dispatches palette.
 * The pre-paint script in app/layout.tsx has already applied the stored
 * choice before first paint; this button syncs its state from the DOM,
 * persists user toggles, and follows system changes until the user makes
 * an explicit choice.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Re-sync from the source of truth so the class survives whatever React's
    // hydration does to <html> (the pre-paint script has already handled
    // first paint; this is the authoritative state from here on).
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable — follow the system
    }
    const initial = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', initial);
    setDark(initial);
    setThemeMeta(initial);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (event: MediaQueryListEvent) => {
      // An explicit user choice (persisted) wins over the OS setting.
      let explicit: string | null = null;
      try {
        explicit = localStorage.getItem(STORAGE_KEY);
      } catch {
        // storage unavailable — follow the system
      }
      if (explicit) return;
      document.documentElement.classList.toggle('dark', event.matches);
      setDark(event.matches);
      setThemeMeta(event.matches);
    };
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }
    setThemeMeta(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      // Static label: aria-pressed already carries the state; a flipping label
      // would make AT announce the state twice ("Switch to day theme, pressed").
      aria-label="Toggle dark theme"
      title={dark ? 'Day' : 'Night'}
      className="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center border border-[var(--color-ink)]/30 bg-[var(--color-parchment)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-rust)] hover:text-[var(--color-rust)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
    >
      {dark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
