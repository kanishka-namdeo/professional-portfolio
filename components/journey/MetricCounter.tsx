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
    return () => { controls.stop(); node.textContent = String(value); };
  }, [inView, reduceMotion, value]);

  return (
    <div
      role="img"
      aria-label={`${value}${suffix ?? ''} ${label}`}
      className="flex items-baseline gap-2 border-l border-[var(--color-rust)]/40 pl-3"
    >
      <span className="font-[family-name:var(--font-data)] text-xl font-bold leading-none text-[var(--color-ink)]">
        <span ref={ref}>{value}</span>
        {suffix && <span className="text-[var(--color-rust)]">{suffix}</span>}
      </span>
      <span className="font-[family-name:var(--font-data)] text-[11px] leading-tight text-[var(--color-ink-muted)]">{label}</span>
    </div>
  );
}
