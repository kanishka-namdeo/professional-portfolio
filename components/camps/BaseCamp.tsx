'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import type { Camp } from '@/data/camps';
import { useRoughAnnotation } from '@/hooks/useRoughAnnotation';

/** SSR-safe media query: false until mounted, then tracks the live value. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** '[data-anno="canvas"]' -> 'canvas' */
function annoName(selector: string): string {
  return selector.match(/"([^"]*)"/)?.[1] ?? selector;
}

export function BaseCamp({ camp }: { camp: Camp }) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  // Paused mirrors the media element; the toggle below is always rendered so
  // autoplaying recordings stay pausable (WCAG 2.2.2 Pause, Stop, Hide).
  const [paused, setPaused] = useState(true);
  // once: annotations are created on first entry and then only shown/hidden per
  // step (useRoughAnnotation's step effect) — without `once`, every scroll
  // re-entry tore the marks down and re-animated them from scratch.
  const inView = useInView(containerRef, { margin: '-20% 0px', once: true });
  const reduceMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => setMounted(true), []);

  // Spec guardrails: reduced-motion -> poster + play control; mobile -> tap to
  // play; desktop -> muted autoplay loop. Everything else stays silent.
  const autoPlay = mounted && isDesktop && !reduceMotion;

  useEffect(() => {
    if (!autoPlay) return;
    // Autoplay is active, so the recording plays; reflect that on the control.
    // (onPlay/onPause keep the state truthful afterwards.)
    setPaused(false);
    const video = videoRef.current;
    if (video && video.paused) {
      // Chromium doesn't honour a post-mount autoplay attribute flip on a
      // preload="none" element — nudge it explicitly.
      const played: unknown = video.play();
      if (played instanceof Promise) played.catch(() => {});
    }
  }, [autoPlay]);

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
          {/* Camp heading: h2 so camps surface in the heading outline (h1 →
              journey/camp h2s); the mono eyebrow styling is unchanged. */}
          <h2 className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
            BASE CAMP — {camp.title.toUpperCase()} · {camp.year}
          </h2>
          <div className="relative mt-4 border border-[var(--color-ink)] bg-[var(--color-paper)] p-2 shadow-[3px_3px_0_var(--color-shadow-soft)]">
            <Image
              src={camp.screenshot}
              alt={`${camp.title} — ${camp.tagline}`}
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full"
            />
            {/* field-note labels pinned to regions of the screenshot; rough-notation underlines each label.
                Edge-aware anchoring (left edge on the left half, right edge on the right half) keeps the
                labels inside the plate so they never widen the page. */}
            {camp.annotations.map((a) => (
              <span
                key={a.selector}
                data-anno={annoName(a.selector)}
                className="absolute block max-w-[70%] border border-[var(--color-ink)] bg-[var(--color-parchment)] px-1.5 py-0.5 font-[family-name:var(--font-data)] text-[11px] leading-tight text-[var(--color-rust)]"
                style={{
                  left: `${a.pos.x}%`,
                  top: `${a.pos.y}%`,
                  transform: a.pos.x < 50 ? 'translate(0, -50%)' : 'translate(-100%, -50%)',
                }}
              >
                {a.note}
              </span>
            ))}
          </div>
          <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">
            fig. — {camp.tagline}{' '}
            <a className="text-[var(--color-rust)] underline" href={camp.repoUrl} target="_blank" rel="noopener noreferrer">
              [{camp.repo} →]
            </a>
          </p>
          <div className="relative mt-4">
            <video
              data-testid="camp-recording"
              // Intrinsic 1280x720 (poster size) so the browser reserves the
              // right box before metadata loads — kills layout shift (CLS).
              width={1280}
              height={720}
              className="block h-auto w-full border border-[var(--color-ink)]/20"
              src={camp.recording.src}
              poster={camp.recording.poster}
              autoPlay={autoPlay}
              muted
              loop
              playsInline
              preload="none"
              aria-label={camp.recording.caption}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              ref={(el) => {
                videoRef.current = el;
                if (!el) return;
                el.muted = true; // runtime guarantee: the field recording stays silent
                el.setAttribute('muted', ''); // React sets `muted` as a property only, never the content attribute
              }}
            />
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                if (video.paused) void video.play();
                else video.pause();
              }}
              aria-label={paused ? `Play recording: ${camp.title}` : `Pause recording: ${camp.title}`}
              className="absolute inset-0 flex cursor-pointer items-end justify-start p-3 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
            >
              <span className="border border-[var(--color-ink)] bg-[var(--color-parchment)] px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-rust)] shadow-[2px_2px_0_var(--color-shadow-hard)]">
                {paused ? 'Play' : 'Pause'} recording
              </span>
            </button>
          </div>
          <p className="mt-1 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">{camp.recording.caption}</p>
        </div>

        {/* stepping text. Dim state never fades the whole <li> (opacity stacks
            on text and drops it under 4.5:1 in both themes, WCAG 1.4.3) —
            inactive steps switch to the --color-ink-muted token instead. */}
        <ol className="space-y-10" aria-label={`${camp.title} — how it works`}>
          {camp.steps.map((s, i) => (
            <li
              key={s.heading}
              data-step={i}
              onMouseEnter={() => setStep(i)}
            >
              <StepBlock index={i} onEnter={setStep} heading={s.heading} body={s.body} active={step === i} />
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function StepBlock({ index, onEnter, heading, body, active }: { index: number; onEnter: (step: number) => void; heading: string; body: string; active: boolean }) {
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
      {/* Dim text = --color-ink-muted (≥4.5:1 on both themes' surfaces);
          active text returns to full ink. Never opacity on text. */}
      <p className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink-muted)]">STEP {index + 1}</p>
      <h3
        className={`mt-1 font-[family-name:var(--font-voice)] text-2xl font-bold transition-colors ${
          active ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'
        }`}
      >
        {heading}
      </h3>
      <p
        className={`mt-2 font-[family-name:var(--font-voice)] text-base leading-relaxed transition-colors ${
          active ? 'text-[var(--color-ink)]/80' : 'text-[var(--color-ink-muted)]'
        }`}
      >
        {body}
      </p>
    </div>
  );
}
