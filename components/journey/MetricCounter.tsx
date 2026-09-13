'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import type { EraMetric } from '@/data/journey';

export function MetricCounter({ value, suffix, label }: EraMetric) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = String(Math.round(v)); },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span role="img" aria-label={`${value}${suffix ?? ''} ${label}`} className="inline-flex flex-col">
      <span className="font-[family-name:var(--font-data)] text-4xl font-bold text-[var(--color-ink)]">
        <span ref={ref}>{value}</span>
        {suffix && <span className="text-[var(--color-rust)]">{suffix}</span>}
      </span>
      <span className="text-sm text-[var(--color-ink)]/70">{label}</span>
    </span>
  );
}
