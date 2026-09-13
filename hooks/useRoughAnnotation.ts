'use client';

import { useEffect, useRef, type RefObject } from 'react';
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
 *
 * Instances are created once per (container, selectors, enabled, reduceMotion)
 * and kept in a ref; the step only toggles show()/hide(), so hovering through
 * the story never tears down and re-annotates the marks.
 * rough-notation is dynamically imported so it stays out of the SSR bundle.
 */
export function useRoughAnnotation({ container, selectors, step, enabled }: Options) {
  const reduceMotion = useReducedMotion();
  const instancesRef = useRef<AnnotationHandle[]>([]);
  // Latest-ref: creation applies visibility for whatever step is current at the
  // moment the dynamic import resolves, without putting step in the create deps.
  const stepRef = useRef(step);
  stepRef.current = step;

  // Effect 1: create/release instances. Runs only when the marks themselves change.
  useEffect(() => {
    if (!enabled || !container.current) return;
    let cancelled = false;
    instancesRef.current = [];

    (async () => {
      const { annotate } = await import('rough-notation');
      if (cancelled || !container.current) return;
      instancesRef.current = selectors
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

      instancesRef.current.forEach((inst, i) => (i <= stepRef.current ? inst.show() : inst.hide()));
    })();

    return () => {
      cancelled = true;
      instancesRef.current.forEach((inst) => inst.hide());
      instancesRef.current = [];
    };
  }, [container, selectors, enabled, reduceMotion]);

  // Effect 2: step changes only toggle visibility — no teardown, no re-annotate.
  useEffect(() => {
    instancesRef.current.forEach((inst, i) => (i <= step ? inst.show() : inst.hide()));
  }, [step]);
}
