'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which era section is currently centred in the viewport.
 * Each consumer gets its own observer — they are cheap, and sharing state
 * across a server-rendered page would require a context provider.
 */
export function useActiveEra(): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-era]'));
    const observer = new IntersectionObserver(
      (entries) => {
        // entries is not ordered by centrality, and during a fast scroll two
        // chapters can overlap the centre band at once — the most visible one
        // wins, not merely the last one reported.
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const mostVisible = visible.reduce((a, b) => (b.intersectionRatio > a.intersectionRatio ? b : a));
        setActiveId(mostVisible.target.getAttribute('data-era'));
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
