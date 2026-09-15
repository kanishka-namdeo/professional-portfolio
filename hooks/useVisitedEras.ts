'use client';

import { useEffect, useState } from 'react';
import { eras } from '@/data/journey';
import { useActiveEra } from './useActiveEra';

const STORAGE_KEY = 'dispatches:visited-eras';

/** An era only counts once the reader has stayed in it this long. */
const DWELL_MS = 1500;

/**
 * Records every era the reader has actually travelled through. An era counts
 * as visited only after ~1.5s of continuous active time — scrolling past a
 * chapter without pausing doesn't count, so the completion easter egg stays
 * something you earn by reading. Survives reloads within the session.
 */
export function useVisitedEras(): Set<string> {
  const activeId = useActiveEra();
  // Starts empty on both server and client (no hydration mismatch); the stored
  // set is adopted after mount.
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setVisited(new Set(parsed as string[]));
      }
    } catch {
      // Storage unavailable (private mode) — the egg simply won't persist.
    }
  }, []);

  useEffect(() => {
    if (!activeId) return;
    // The timer restarts whenever the active era changes: leaving early
    // cancels the dwell, and coming back starts it over.
    const timer = window.setTimeout(() => {
      setVisited((prev) => {
        if (prev.has(activeId)) return prev;
        const next = new Set(prev);
        next.add(activeId);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        } catch {
          // Storage unavailable — continue in-memory.
        }
        return next;
      });
    }, DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [activeId]);

  return visited;
}

/** True once every era has been travelled through. */
export function useTrailComplete(): boolean {
  const visited = useVisitedEras();
  return visited.size >= eras.length;
}
