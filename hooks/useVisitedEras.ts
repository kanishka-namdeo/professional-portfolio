'use client';

import { useEffect, useState } from 'react';
import { eras } from '@/data/journey';
import { useActiveEra } from './useActiveEra';

const STORAGE_KEY = 'dispatches:visited-eras';

/**
 * Records every era the reader has travelled through (an era counts as visited
 * once it becomes the active chapter). Survives reloads within the session, so
 * the completion easter egg doesn't reset on refresh.
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
  }, [activeId]);

  return visited;
}

/** True once every era has been travelled through. */
export function useTrailComplete(): boolean {
  const visited = useVisitedEras();
  return visited.size >= eras.length;
}
