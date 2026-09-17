# camps/ AGENTS.md

## Purpose
Base camp components for expedition waypoints. Provides the BaseCamp component — the media-first "screening room" for each flagship project — and its camp navigation elements.

## Ownership
- **Scope**: Base camp UI components and camp navigation
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Camp components are themed around expedition/base camp metaphor
- `BaseCamp.tsx` renders the camp eyebrow (`BASE CAMP — TITLE · YEAR`) as the camp's `h2` with unchanged styling, so camps appear in the heading outline (h1 → section h2s). A mono catalog line (`BC-01/03 · N ARTIFACTS`) sits to its right from the `index`/`total` props — page.tsx supplies them
- **The stage** is a fixed `aspect-video` screening plate (7/12 of the grid on desktop, sticky at `top-24`). Every media item renders into the same reserved box via `AnimatePresence` opacity crossfades (duration 0 under reduced motion) — zero CLS across swaps. Non-widescreen media mat onto the paper through a per-media `aspect-ratio` wrapper (`w-full` when the media is wider than 16:9, else `h-full`); annotation `pos` percentages anchor to that wrapper, never to the letterbox bars
- **Stage state machine**: `stagedIndex = pinned ?? (step >= 0 ? steps[step].mediaIndex : recordingIndex)`. `step` starts at -1 (pre-story resting state = the recording, SSR'd — showreel-first); step activation (inView center band, hover, OR focus on the step `<li>`) sets the step and CLEARS the pin — the story reclaims the stage. Filmstrip clicks set `pinned` and sync `step` via `ownerStepFor()` (exact media match wins; unreferenced frames inherit the nearest earlier step)
- **Filmstrip** = the contact sheet: one `<button>` per media item (`aria-current` on the staged one, `aria-label` "FR-02 — note"), scroll-snap `proximity` (never `mandatory` — tall-content trap), and the active frame carries the grease-pencil mark — a DETERMINISTIC hand-drawn ellipse (`greasePencilPath`, seeded by media index; pure function so SSR/hydration match). The strip auto-scrolls via `scrollLeft` writes ONLY (never `scrollIntoView`, which would scroll the page when the camp is below the fold on first paint)
- **Lightbox** = native `<dialog>` (top layer, inert background, ESC) opened by the ENLARGE chip: `showModal()` guarded for jsdom, `useModalLock` stops Lenis + locks body scroll, focus restores to the pre-open `activeElement` on close, lightbox content mounts ONLY while open (closed dialog costs nothing). The staged recording pauses while the lightbox is open and resumes only if autoplay still holds and the user hadn't paused
- **Recording playback**: autoplay gate = `mounted && isDesktop && !reduceMotion && videoInView && staged media is the recording`; `preload="none"` + poster always; the pause chip (`Play/Pause recording: TITLE`) is WCAG 2.2.2. While the recording is staged BY ITS STEP (not pinned/resting), a `chapter: [start, end)` loop keeps the money moment on screen (timeupdate epsilon 0.15s; a manual `userPaused` is never overridden)
- Step "dim" state switches text to `--color-ink-muted`; the step `<li>` must never take `opacity` (stacked opacity drops text below 4.5:1 in both themes). Step `<li>`s are `tabIndex={0}` so keyboard users drive the stage like hover does
- The camp container's `useInView` uses `once: true`: rough annotations are created on first entry and then only shown/hidden per staged media (`useRoughAnnotation`'s step effect passes `selectors.length - 1` — a staged media shows ALL its marks; the build-up happens across media, not within one screenshot)
- The slate chip (top-left, `aria-hidden`) shows `REC · MM:SS` for recordings or `FRAME · note` for stills; the ENLARGE chip (top-right) sits at `z-20` above the crossfading layers and the pause chip

## Work Guidance
- Keep camp components focused on waypoint presentation
- Use shared UI primitives from ui/ for buttons and cards
- Maintain expedition theme consistency
- New media artifacts: extract via `scripts/extract-camp-stills.mjs`, then wire into `data/camps.ts` (see data/AGENTS.md media contracts)

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`
- e2e/keyboard.spec.ts stages the recording via the filmstrip REC button before asserting pausability — keep that deterministic path working

## Child DOX Index
- __tests__/ - Component-specific tests
