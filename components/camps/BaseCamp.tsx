'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import type { Camp, CampMedia, CampStep } from '@/data/camps';
import { useRoughAnnotation } from '@/hooks/useRoughAnnotation';
import { useModalLock } from '@/hooks/useModalLock';

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

/** Seconds -> "MM:SS" for the recording slate. */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Deterministic hand-drawn ellipse — the film editor's grease-pencil mark on
 * the selected contact-sheet frame. Pure function of (box, seed) so SSR and
 * hydration render the identical path; the seed is the media index.
 */
function greasePencilPath(boxW: number, boxH: number, seed: number): string {
  let t = seed * 2654435761 + 1013904223;
  const rand = () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const cx = boxW / 2;
  const cy = boxH / 2;
  const rx = boxW * 0.48;
  const ry = boxH * 0.45;
  const start = rand() * Math.PI * 2;
  const steps = 24;
  const over = 1.1; // overshoot past the opening, like a real pencil loop
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = start + (i / steps) * Math.PI * 2 * over;
    const wobble = 1 + (rand() - 0.5) * 0.07;
    const x = cx + Math.cos(a) * rx * wobble + (rand() - 0.5) * 1.2;
    const y = cy + Math.sin(a) * ry * wobble + (rand() - 0.5) * 1.2;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Step that owns a media item — the filmstrip keeps the step text coherent
 * with whatever it stages. Exact match wins; unreferenced frames (FR-03)
 * inherit the nearest step staging an earlier media index. */
function ownerStepFor(mediaIndex: number, steps: CampStep[]): number {
  let owner = -1;
  steps.forEach((s, i) => {
    if (s.mediaIndex === mediaIndex) owner = i;
  });
  if (owner >= 0) return owner;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].mediaIndex < mediaIndex) return i;
  }
  return 0;
}

export function BaseCamp({ camp, index, total }: { camp: Camp; index: number; total: number }) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // step -1 = pre-story: no step has activated yet and the stage rests on the
  // recording (the showreel-first opener — footage before interface).
  const [step, setStep] = useState(-1);
  const [pinned, setPinned] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // Paused mirrors the media element; the toggle below is always rendered so
  // autoplaying recordings stay pausable (WCAG 2.2.2 Pause, Stop, Hide).
  const [paused, setPaused] = useState(true);
  // once: annotations are created on first entry and then only shown/hidden per
  // staged media (useRoughAnnotation's step effect) — without `once`, every
  // scroll re-entry tore the marks down and re-animated them from scratch.
  const inView = useInView(containerRef, { margin: '-20% 0px', once: true });
  // Separate, sticky viewport watch for the recording: all three camps render
  // at page load, so an unconditional desktop autoplay would fetch and decode
  // ~2.2MB of below-fold video while the reader is still at the hero.
  const videoInView = useInView(containerRef, { margin: '-10% 0px' });
  const reduceMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => setMounted(true), []);

  const recordingIndex = camp.media.length - 1; // data contract: recording is last
  // The persistent recording layer (see the stage below) always renders the
  // LAST media item, whatever is staged right now.
  const recording = camp.media[recordingIndex];
  const stagedIndex = pinned ?? (step >= 0 ? camp.steps[step].mediaIndex : recordingIndex);
  const media = camp.media[stagedIndex];
  // Whether the recording layer owns the stage at the moment (staging a still
  // fades the recording out — it stays mounted, paused and inert, underneath).
  const stagingRecording = media.kind === 'recording';

  // Spec guardrails: reduced-motion -> poster + play control; mobile -> tap to
  // play; desktop -> muted autoplay loop, but only while the recording is the
  // staged media AND the camp is on screen.
  const autoPlay = mounted && isDesktop && !reduceMotion && videoInView && stagingRecording;

  // Whether playback was ever auto-started: only an auto-started video pauses
  // on viewport exit — a tap-to-play video (mobile/reduced motion) keeps
  // playing, and a user's manual pause survives scroll round-trips.
  const wasAutoStarted = useRef(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (autoPlay) {
      wasAutoStarted.current = true;
      // Autoplay is active, so the recording plays; reflect that on the control
      // immediately (onPlay/onPause keep it truthful afterwards — jsdom never
      // fires play events, so the event alone can't drive the label).
      setPaused(false);
      if (userPaused.current) return;
      if (video.paused) {
        // Chromium doesn't honour a post-mount autoplay attribute flip on a
        // preload="none" element — nudge it explicitly.
        const played: unknown = video.play();
        if (played instanceof Promise) played.catch(() => {});
      }
    } else if (wasAutoStarted.current && !video.paused) {
      video.pause();
    }
  }, [autoPlay]);

  // Chapter loop: while the recording is staged BY ITS STEP (not pinned, not
  // resting), playback stays inside [start, end) so the money moment loops for
  // as long as the reader is on that step. A manual pause is never overridden.
  const chapter =
    media.kind === 'recording' && pinned === null && step >= 0 ? media.chapter : undefined;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !chapter || !autoPlay || userPaused.current) return;
    if (video.currentTime < chapter[0] - 0.25 || video.currentTime > chapter[1]) {
      video.currentTime = chapter[0];
    }
    // timeupdate fires coarsely (~4Hz) — the epsilon keeps the loop seamless.
    const onTime = () => {
      if (video.currentTime >= chapter[1] - 0.15) video.currentTime = chapter[0];
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [chapter, autoPlay]);

  // Stable array reference: recomputed only when the staged media's
  // annotations change, so useRoughAnnotation's effect doesn't re-fire per render.
  const selectors = useMemo(() => media.annotations.map((a) => a.selector), [media]);

  useRoughAnnotation({
    container: containerRef,
    selectors,
    // A staged media shows all of its marks — the build-up happens across
    // media (plate -> frames -> footage), not within one screenshot.
    step: selectors.length - 1,
    enabled: inView,
  });

  // Step activation drives the story AND clears any filmstrip pin — the story
  // reclaims the stage on the next step.
  const activateStep = useCallback((i: number) => {
    setStep(i);
    setPinned(null);
  }, []);

  const selectMedia = useCallback(
    (i: number) => {
      setPinned((prev) => (prev === i ? prev : i));
      setStep(ownerStepFor(i, camp.steps));
    },
    [camp.steps],
  );

  // Keep the active filmstrip frame in horizontal view — scrollLeft writes
  // only (never scrollIntoView, which would also scroll the page when the
  // camp is below the fold on first paint).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const activeBtn = strip.querySelector<HTMLButtonElement>('button[aria-current="true"]');
    const active = activeBtn?.closest('li') as HTMLLIElement | null;
    if (!active) return;
    const left = active.offsetLeft;
    const right = left + active.offsetWidth;
    if (left < strip.scrollLeft + 8) strip.scrollLeft = Math.max(0, left - 8);
    else if (right > strip.scrollLeft + strip.clientWidth - 8) {
      strip.scrollLeft = right - strip.clientWidth + 8;
    }
  }, [stagedIndex]);

  // ── Lightbox (native <dialog>: top layer, inert background, ESC) ──────
  useModalLock(lightbox !== null);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg || lightbox === null) return;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', ''); // jsdom / engines without showModal
  }, [lightbox]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setLightbox(null);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
    dlg.addEventListener('close', onClose);
    return () => dlg.removeEventListener('close', onClose);
  }, []);

  const closeLightbox = useCallback(() => {
    const dlg = dialogRef.current;
    if (dlg && typeof dlg.close === 'function') {
      dlg.close(); // fires 'close' -> the listener above restores focus
    } else {
      dlg?.removeAttribute('open');
      setLightbox(null);
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    }
  }, []);

  // The staged recording pauses while the lightbox has the reader's attention
  // and resumes afterwards if autoplay still holds and the user hadn't paused.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (lightbox !== null) {
      if (!video.paused) video.pause();
    } else if (autoPlay && !userPaused.current && video.paused) {
      const played: unknown = video.play();
      if (played instanceof Promise) played.catch(() => {});
    }
  }, [lightbox, autoPlay]);

  const widescreen = media.width / media.height >= 16 / 9;

  return (
    <article id={`camp-${camp.id}`} ref={containerRef} className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-12">
        {/* sticky media column — the screening room. min-w-0: the filmstrip
            is a horizontal scroll container, and without it the grid item's
            automatic minimum (sum of the thumbs) blows the page out sideways
            on phones. */}
        <div className="min-w-0 md:sticky md:top-24 md:col-span-7 md:self-start">
          {/* Camp heading: h2 so camps surface in the heading outline (h1 →
              journey/camp h2s); the mono eyebrow styling is unchanged. The
              catalog line to its right files the camp in the expedition
              archive (BC-01/03 · 4 ARTIFACTS). */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
              BASE CAMP — {camp.title.toUpperCase()} · {camp.year}
            </h2>
            <p className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">
              BC-{String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')} · {camp.media.length} ARTIFACTS
            </p>
          </div>

          {/* the stage: a fixed 16:9 screening plate. Every media item renders
              into the same reserved box (zero CLS); non-widescreen plates mat
              onto the paper instead of stretching, and annotations anchor to
              the media box, never to the letterbox bars. */}
          <div className="relative mt-4 aspect-video border border-[var(--color-ink)] bg-[var(--color-paper)] p-1.5 shadow-[3px_3px_0_var(--color-shadow-soft)]">
            {/* Layer 0 — the field recording, PERSISTENTLY mounted. Remounting
                a <video> on every stage swap forced the browser to tear down
                and rebuild its decoder (and juggle hardware overlay planes)
                mid-scroll — a classic whole-screen flicker and jank spike.
                The layer never unmounts: it fades in when the recording owns
                the stage and goes inert otherwise (the autoplay gate pauses
                it the moment a still takes over). */}
            <motion.div
              className="absolute inset-1.5"
              initial={false}
              animate={{ opacity: stagingRecording ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
              inert={!stagingRecording}
              aria-hidden={!stagingRecording}
              style={{ pointerEvents: stagingRecording ? 'auto' : 'none' }}
            >
              <div className="relative h-full w-full">
                <video
                  data-testid="camp-recording"
                  // Intrinsic 1280x720 (poster size) so the browser
                  // reserves the right box before metadata loads —
                  // kills layout shift (CLS).
                  width={recording.width}
                  height={recording.height}
                  className="block h-full w-full object-cover"
                  src={recording.src}
                  poster={recording.poster}
                  autoPlay={autoPlay}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={recording.alt}
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
                    if (video.paused) {
                      userPaused.current = false;
                      void video.play();
                    } else {
                      userPaused.current = true;
                      video.pause();
                    }
                  }}
                  aria-label={paused ? `Play recording: ${camp.title}` : `Pause recording: ${camp.title}`}
                  className="absolute inset-0 flex cursor-pointer items-end justify-start p-3 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
                >
                  <span className="border border-[var(--color-ink)] bg-[var(--color-parchment)] px-3 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-rust)] shadow-[2px_2px_0_var(--color-shadow-hard)]">
                    {paused ? 'Play' : 'Pause'} recording
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Layer 1 — plates and frames crossfade ABOVE the recording.
                Cheap image swaps only; the heavy media below never churns. */}
            <AnimatePresence initial={false}>
              {!stagingRecording && (
                <motion.div
                  key={stagedIndex}
                  className="absolute inset-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div
                      className={`relative max-h-full max-w-full ${widescreen ? 'w-full' : 'h-full'}`}
                      style={{ aspectRatio: `${media.width} / ${media.height}` }}
                    >
                      <Image
                        src={media.src}
                        alt={media.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-contain"
                      />
                      {/* field-note labels pinned to regions of the media;
                          rough-notation underlines each label. Edge-aware
                          anchoring (left edge on the left half, right edge on
                          the right half) keeps labels inside the plate. */}
                      {media.annotations.map((a) => (
                        <span
                          key={a.selector}
                          data-anno={annoName(a.selector)}
                          className="absolute z-10 block max-w-[70%] border border-[var(--color-ink)] bg-[var(--color-parchment)] px-1.5 py-0.5 font-[family-name:var(--font-data)] text-[11px] leading-tight text-[var(--color-rust)]"
                          style={{
                            left: `${a.pos.x}%`,
                            top: `${a.pos.y}%`,
                            transform:
                              a.pos.x < 50 ? 'translate(0, -50%)' : 'translate(-100%, -50%)',
                          }}
                        >
                          {a.note}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* slate — the archive label of whatever is staged */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-2 top-2 z-20 max-w-[70%] border border-[var(--color-ink)] bg-[var(--color-parchment)] px-1.5 py-0.5 font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-rust-text)] shadow-[2px_2px_0_var(--color-shadow-hard)]"
            >
              {media.kind === 'recording'
                ? `REC · ${formatDuration(media.duration ?? 0)}`
                : `${media.frame} · ${media.note}`}
            </span>
            {/* enlarge — every artifact can be studied full-size */}
            <button
              type="button"
              onClick={() => setLightbox(stagedIndex)}
              aria-label={`Enlarge ${camp.title} ${media.frame === 'REC' ? 'field recording' : media.frame}`}
              className="absolute right-2 top-2 z-20 cursor-pointer border border-[var(--color-ink)] bg-[var(--color-parchment)] px-2 py-1 font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink)] shadow-[2px_2px_0_var(--color-shadow-hard)] hover:text-[var(--color-rust-text)] focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
            >
              Enlarge
            </button>
          </div>

          {/* contact sheet — one frame per artifact; the active one carries the
              grease-pencil mark. Selecting a frame stages it (and lines the
              step text up with it); ENLARGE studies it full-size. */}
          <ul
            ref={stripRef}
            aria-label={`${camp.title} — media`}
            className="mt-3 flex list-none snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]"
          >
            {camp.media.map((m, i) => {
              const active = i === stagedIndex;
              return (
                <li key={m.frame} className="snap-start">
                  <button
                    type="button"
                    onClick={() => selectMedia(i)}
                    aria-current={active ? 'true' : undefined}
                    aria-label={`${m.frame === 'REC' ? 'Field recording' : m.frame} — ${m.note}`}
                    className="block cursor-pointer border border-[var(--color-ink)]/40 pb-0.5 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
                  >
                    <span className="relative block aspect-video w-24 bg-[var(--color-paper)] md:w-28">
                      <Image
                        src={m.kind === 'still' ? m.src : m.poster ?? m.src}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-contain"
                      />
                      {active && (
                        <svg
                          aria-hidden
                          className="pointer-events-none absolute -inset-[5px]"
                          viewBox="0 0 122 73"
                          preserveAspectRatio="none"
                        >
                          <path
                            d={greasePencilPath(122, 73, i)}
                            fill="none"
                            stroke="var(--color-rust)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`mt-0.5 block w-full text-center font-[family-name:var(--font-data)] text-[10px] uppercase tracking-[0.1em] ${
                        active ? 'text-[var(--color-rust-text)]' : 'text-[var(--color-ink-muted)]'
                      }`}
                    >
                      {m.frame}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]">
            fig. — {camp.tagline}{' '}
            <a className="text-[var(--color-rust)] underline" href={camp.repoUrl} target="_blank" rel="noopener noreferrer">
              [{camp.repo} →]
            </a>
          </p>
        </div>

        {/* stepping text. Dim state never fades the whole <li> (opacity stacks
            on text and drops it under 4.5:1 in both themes, WCAG 1.4.3) —
            inactive steps switch to the --color-ink-muted token instead. */}
        <ol className="min-w-0 space-y-10 md:col-span-5" aria-label={`${camp.title} — how it works`}>
          {camp.steps.map((s, i) => (
            <li
              key={s.heading}
              data-step={i}
              tabIndex={0}
              onMouseEnter={() => activateStep(i)}
              onFocus={() => activateStep(i)}
              className="focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
            >
              <StepBlock index={i} onEnter={activateStep} heading={s.heading} body={s.body} active={step === i} />
            </li>
          ))}
        </ol>
      </div>

      {/* lightbox — native dialog: top layer + inert background + ESC for
          free; useModalLock stops Lenis and locks body scroll while open. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`camp-${camp.id}-lightbox-caption`}
        className="m-auto max-h-[92vh] w-[min(92vw,1080px)] border-2 border-[var(--color-ink)] bg-[var(--color-parchment)] p-3 shadow-[6px_6px_0_var(--color-shadow-hard)] [&::backdrop]:bg-[#241C10]/85"
      >
        {lightbox !== null && <LightboxBody media={camp.media[lightbox]} camp={camp} onClose={closeLightbox} />}
      </dialog>
    </article>
  );
}

function LightboxBody({ media, camp, onClose }: { media: CampMedia; camp: Camp; onClose: () => void }) {
  return (
    <div>
      {media.kind === 'still' ? (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(min-width: 1152px) 1040px, 92vw"
          className="mx-auto h-auto max-h-[72vh] w-auto max-w-full object-contain"
        />
      ) : (
        // User-initiated viewing: controls on, so the reader owns playback.
        <video
          src={media.src}
          poster={media.poster}
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
          className="mx-auto max-h-[72vh] w-auto max-w-full"
        />
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-inkline)] pt-2">
        <p
          id={`camp-${camp.id}-lightbox-caption`}
          className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink-muted)]"
        >
          {media.frame === 'REC' ? 'FIELD RECORDING' : media.frame} — {media.note} · {camp.title}
        </p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="cursor-pointer border-2 border-[var(--color-ink)] bg-[var(--color-parchment)] px-4 py-1.5 font-[family-name:var(--font-data)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-rust)] shadow-[3px_3px_0_var(--color-shadow-hard)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-rust)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function StepBlock({ index, onEnter, heading, body, active }: { index: number; onEnter: (step: number) => void; heading: string; body: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: '-40% 0px -40% 0px' });
  // Latest-ref pattern: the effect must depend only on `visible`, never on the
  // callback identity. A fresh onEnter closure here would re-fire this effect
  // every render and let a later visible step override a hover-activated step.
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);
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
