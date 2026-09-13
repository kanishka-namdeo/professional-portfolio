'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

interface Options {
  container: RefObject<HTMLElement | null>;
  selectors: string[];
  step: number;
  enabled: boolean;
}

interface AnnotationHandle {
  show: () => void;
  hide: () => void;
}

/**
 * Shows rough-notation annotations with index <= step, hides the rest.
 * rough-notation is dynamically imported so it stays out of the SSR bundle.
 */
export function useRoughAnnotation({ container, selectors, step, enabled }: Options) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || !container.current) return;
    let cancelled = false;
    let instances: AnnotationHandle[] = [];

    (async () => {
      const { annotate } = await import('rough-notation');
      if (cancelled || !container.current) return;
      instances = selectors
        .map((selector) => {
          const el = container.current?.querySelector(selector);
          if (!el) return null;
          return annotate(el as HTMLElement, {
            type: 'underline',
            color: '#8C4A2F',
            strokeWidth: 2,
            padding: 2,
            animationDuration: reduceMotion ? 0 : 600,
          });
        })
        .filter(Boolean) as AnnotationHandle[];

      instances.forEach((inst, i) => (i <= step ? inst.show() : inst.hide()));
    })();

    return () => {
      cancelled = true;
      instances.forEach((inst) => inst.hide());
    };
  }, [container, selectors, step, enabled, reduceMotion]);
}
