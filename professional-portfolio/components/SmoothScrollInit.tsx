'use client';

import { useEffect } from 'react';

export default function SmoothScrollInit() {
  useEffect(() => {
    // Additional safeguard: ensure we're at top on mount
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
