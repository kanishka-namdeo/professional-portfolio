'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
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

/** Fallback for the decorative stroke color when the token is unreadable. */
const RUST_FALLBACK = '#8C4A2F';

/** Reads the live --color-rust token at annotation-creation time. */
function readRustColor(): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') return RUST_FALLBACK;
  const token = getComputedStyle(document.documentElement).getPropertyValue('--color-rust').trim();
  return token || RUST_FALLBACK;
}

/**
 * Shows rough-notation annotations with index <= step, hides the rest.
 *
 * Instances are created once per (container, selectors, enabled, reduceMotion)
 * and kept in a ref; the step only toggles show()/hide(), so hovering through
 * the story never tears down and re-annotates the marks. The stroke color is
 * the live --color-rust token, so marks re-create when the ThemeToggle flips
 * the `dark` class on <html> (a hardcoded day-rust vanished on dark surfaces).
 * rough-notation is dynamically imported so it stays out of the SSR bundle.
 */
export function useRoughAnnotation({ container, selectors, step, enabled }: Options) {
  const reduceMotion = useReducedMotion();
  const instancesRef = useRef<AnnotationHandle[]>([]);
  // Latest-ref: creation applies visibility for whatever step is current at the
  // moment the dynamic import resolves, without putting step in the create deps.
  // Synced in an effect (never during render): the import resolves orders of
  // magnitude later than an effect flush, so the read below always sees the
  // committed step.
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  // Bumped when the documentElement class changes; its only job is to re-run
  // the creation effect so annotations re-read the color token for the theme.
  const [themeKey, setThemeKey] = useState(0);
  useEffect(() => {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    const observer = new MutationObserver(() => setThemeKey((k) => k + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Effect 1: create/release instances. Runs only when the marks themselves
  // change (or the theme flips, which re-reads the color token).
  useEffect(() => {
    if (!enabled || !container.current) return;
    let cancelled = false;
    instancesRef.current = [];

    (async () => {
      const { annotate } = await import('rough-notation');
      if (cancelled || !container.current) return;
      const color = readRustColor();
      instancesRef.current = selectors
        .map((selector) => {
          const el = container.current?.querySelector(selector);
          if (!el) return null;
          return annotate(el as HTMLElement, {
            type: 'underline',
            color,
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
  }, [container, selectors, enabled, reduceMotion, themeKey]);

  // Effect 2: step changes only toggle visibility — no teardown, no re-annotate.
  useEffect(() => {
    instancesRef.current.forEach((inst, i) => (i <= step ? inst.show() : inst.hide()));
  }, [step]);
}
