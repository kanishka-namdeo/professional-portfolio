'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import type { Camp } from '@/data/camps';
import { useRoughAnnotation } from '@/hooks/useRoughAnnotation';

/**
 * Where annotation anchor tacks sit on the media plate, cycled per annotation.
 * Rough-notation draws on whatever element carries the data-anno attribute,
 * so these overlays let every camp's selectors resolve without per-camp markup.
 */
const ANCHOR_SPOTS = [
  'left-[10%] top-[16%]',
  'right-[12%] bottom-[20%]',
  'left-[38%] bottom-[10%]',
] as const;

/** '[data-anno="canvas"]' -> 'canvas' */
function annoName(selector: string): string {
  return selector.match(/"([^"]*)"/)?.[1] ?? selector;
}

export function BaseCamp({ camp }: { camp: Camp }) {
  const containerRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const inView = useInView(containerRef, { margin: '-20% 0px' });

  // Stable array reference: recomputed only when the camp's annotations change,
  // so useRoughAnnotation's effect doesn't re-fire every render.
  const selectors = useMemo(() => camp.annotations.map((a) => a.selector), [camp.annotations]);

  useRoughAnnotation({
    container: containerRef,
    selectors,
    step,
    enabled: inView,
  });

  return (
    <article id={`camp-${camp.id}`} ref={containerRef} className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
        {/* sticky media plate */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
            BASE CAMP — {camp.title.toUpperCase()} · {camp.year}
          </p>
          <div className="relative mt-4 border border-[var(--color-ink)] bg-white p-2 shadow-[3px_3px_0_rgba(46,40,30,0.15)]">
            <Image
              src={camp.screenshot}
              alt={`${camp.title} — ${camp.tagline}`}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full"
              unoptimized
            />
            {/* annotation anchor points overlay the screenshot */}
            {camp.annotations.map((a, i) => (
              <span
                key={a.selector}
                data-anno={annoName(a.selector)}
                aria-hidden="true"
                className={`absolute block h-6 w-6 ${ANCHOR_SPOTS[i % ANCHOR_SPOTS.length]}`}
              />
            ))}
          </div>
          <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">
            fig. — {camp.tagline}{' '}
            <a className="text-[var(--color-rust)] underline" href={camp.repoUrl} target="_blank" rel="noopener noreferrer">
              [{camp.repo} →]
            </a>
          </p>
          <video
            data-testid="camp-recording"
            className="mt-4 w-full border border-[var(--color-ink)]/20"
            src={camp.recording.src}
            poster={camp.recording.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={camp.recording.caption}
            ref={(el) => {
              if (!el) return;
              el.muted = true; // runtime guarantee: the autoplaying field recording stays silent
              el.setAttribute('muted', ''); // React sets `muted` as a property only, never the content attribute
            }}
          />
          <p className="mt-1 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">{camp.recording.caption}</p>
        </div>

        {/* stepping text */}
        <ol className="space-y-10" aria-label={`${camp.title} — the story`}>
          {camp.steps.map((s, i) => (
            <li
              key={s.heading}
              data-step={i}
              className={`transition-opacity ${step === i ? 'opacity-100' : 'opacity-50'}`}
              onMouseEnter={() => setStep(i)}
            >
              <StepBlock index={i} onEnter={setStep} heading={s.heading} body={s.body} />
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function StepBlock({ index, onEnter, heading, body }: { index: number; onEnter: (step: number) => void; heading: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: '-40% 0px -40% 0px' });
  // Latest-ref pattern: the effect must depend only on `visible`, never on the
  // callback identity. A fresh onEnter closure here would re-fire this effect
  // every render and let a later visible step override a hover-activated step.
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;
  useEffect(() => {
    if (visible) onEnterRef.current(index);
  }, [visible, index]);
  return (
    <div ref={ref}>
      <p className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/50">STEP {index + 1}</p>
      <h3 className="mt-1 font-[family-name:var(--font-voice)] text-2xl font-bold text-[var(--color-ink)]">{heading}</h3>
      <p className="mt-2 font-[family-name:var(--font-voice)] text-base leading-relaxed text-[var(--color-ink)]/80">{body}</p>
    </div>
  );
}
