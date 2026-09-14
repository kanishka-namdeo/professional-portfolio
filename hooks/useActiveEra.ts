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
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-era'));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
