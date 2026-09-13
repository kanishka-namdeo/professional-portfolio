# Dispatches — Portfolio Redesign Design Spec

**Date:** 2026-09-13
**Status:** Approved direction, pending spec review
**Author:** Brainstorm session (Kanishka + ZCode)

---

## 1. Problem

The current site (kanishkanamdeo.com, Next.js 16 / React 19 / Tailwind 4 / motion) renders as generic dark-SaaS: placeholder stock photos (picsum.photos) in the hero and 4 project cards, case-study content (challenge/solution/impact/metrics/press) buried behind collapsed cards, no scroll storytelling, a "neobrutalist" CSS claim that never renders, and AI-slop tells (hero stat-row template, pulsing availability dot, invisible particle mesh). The strongest asset — a 9-year arc from defense robotics → logistics → NLP → 10×-ARR mobility scale-up → AI/agent products — is presented as interchangeable cards.

## 2. Goals & constraints

**Primary audience:** recruiters & hiring managers (60-second skim + depth on demand).
**Structure:** single-page scrollytelling. No separate project pages.
**Hard constraint — anti-AI design rules** (see memory: anti-ai-design-principles): no Inter-only type, no purple/blue gradients or gradient text, no glassmorphism/glow, no stock/AI/placeholder imagery, no pill eyebrows, no hero stat-row templates, no pulsing status dots, no identical fade-ins, copy in first person with verifiable specifics. Humanizing devices we commit to: feTurbulence grain (~4%), Rough-Notation-style hand-drawn annotations, intentional imperfection (±1.5° rotations, wobbly SVG strokes), credited real artifacts, colophon.
**Direction chosen:** "Dispatches" — Expedition Map / Field Log (media edition). The career is a map; scroll is travel.

## 3. Page architecture (5 movements)

The SVG map is simultaneously hero, navigation, and progress indicator.

1. **The Map (hero)** — "Kanishka Namdeo — a field log, 2016 → present." Procedural SVG topographic map with 5 waypoints + trail. The arc is visible before any scroll. CTA: "Follow the trail."
2. **The Journey (career)** — 5 waypoint chapters (Sagar Defence → Intugine → Medulla/TekIP → MoveInSync → AvloAI/consulting). Desktop: waypoint pins briefly; SVG trail draws itself between waypoints driven by scroll progress. On arrival: metric counters fire (10× ARR, 70K+ users, 50+ locations, 5× doc processing) and press-clipping "postcards" tape in (real links: Impakter '24, The Hindu '18, Mumbai Mirror '18, Naya Rajasthan '18).
   Chapter copy shape: **terrain (challenge) → crossing (what I did) → summit (impact)** — first person, specifics only, rewritten from existing Experience case-study data.
3. **Base Camps (flagship projects)** — 3 camps: **AgentCanvas, pi-dash, thetell**. Each: one large real screenshot (`next/image`), a scroll-stepped annotation build-up (2–4 Rough-Notation-style callouts narrating an architecture decision), and one **field recording** — a Remotion loop rendered at build time (agent-run replay / dashboard sweep / signal-debate visualization; muted `<video playsinline loop>` + poster; ≤1–2 MB each).
4. **The Ledger** — compact index of remaining repos (Unown, Twin, coding-plan-proxy, everything-search-mcp, electron-mcp, cursor-learning-harness, instructify, rust-sim, social-beam) + Medium writing. Rows: name, one-liner, language, year, link. No carousel — replaces `Showcase.tsx` entirely.
5. **End of the Trail (contact + colophon)** — CTA, availability as plain text (no pulsing dot), colophon: "Set in Crimson Pro & JetBrains Mono. Drawn & built by hand in Next.js."

A thin fixed **trail-progress rail** (micro-map) fills with scroll, doubles as chapter nav and as the accessibility bypass for the scroll story.

## 4. Visual system

- **Type:** Crimson Pro (narrative voice) + JetBrains Mono (coordinates, metadata, ledger rows). No Inter.
- **Palette:** parchment base `#F3EDE2`, ink `#2E281E`, secondary ink-blue linework `rgba(90,110,140,…)`, single rust accent `#8C4A2F` reserved for "you are here" + active states.
- **Texture:** procedural topographic contours (structural — encodes the journey), feTurbulence grain at ~4% opacity.
- **Imperfection (bounded):** waypoint labels rotate ±1.5°, trail paths use hand-wobble stroke, postcards tape in at slight angles. Nothing else rotates.
- **Dark mode:** v1 ships light only (the map is the identity; a dark map variant is a fast-follow, not a launch requirement). Existing ThemeToggle is removed in v1 to avoid a half-designed dark state.

## 5. Map asset

**Procedural contours, generated once at build time** (user decision: procedural SVG; validated toolchain: [simplex-noise](https://github.com/jwagner/simplex-noise.js) → [d3-contour](https://d3js.org/d3-contour) marching squares → GeoJSON MultiPolygons → static SVG paths):

- `scripts/generate-map.mjs` (devDependency-only libraries, run manually/one-time) renders a seeded, deterministic contour field (simplex noise, fixed seed, ~25 threshold bands) and writes `public/map/contours.svg`. The committed static SVG ships to users — **no noise/contour code in the client bundle**. Re-run the script to re-roll the terrain deliberately; never at runtime.
- A small React SVG overlay (`ExpeditionMap.tsx`) adds the interactive layer on top of the static contours: 5 waypoint markers along a south-west → north-east trail (2016 origin at bottom, 2026 at top), clickable → scrolls to chapter, plus the live-drawn trail path.
- Hand-wobble applies to the trail stroke only, not the contour rings. Waypoint labels rotate ±1.5°.
- Budget: contours.svg < 200 KB (path simplification via d3 `streamLine`/rounding; verify size after generation).

## 6. Motion & interaction engine (libraries validated 2026-09-13)

- **`motion`** (already installed, `^13.1.0`; imports from `motion/react` — the current name for framer-motion; see [motion.dev docs](https://motion.dev/docs/react-scroll-animations)). We use only its documented scroll surface — no hand-rolled scroll math:
  - `useScroll({ target, offset })` + `useTransform` → trail `stroke-dashoffset` draw, map re-centering, progress rail fill.
  - `useInView` → annotation step activation, postcard entrances (`whileInView` for one-shots).
  - `animate()` springs → metric counters (final value rendered server-side; spring enhances on view).
- **`lenis` 1.x** ([darkroomengineering/lenis](https://github.com/darkroomengineering/lenis), MIT) via its official `lenis/react` entry (`ReactLenis` root component in `app/layout.tsx` — not the legacy `@studio-freight/lenis`). Desktop feel only: `syncTouch: false` so mobile uses native scrolling. Anchor links go through `lenis.scrollTo`.
- **`rough-notation` 0.5.1** ([rough-stuff/rough-notation](https://github.com/rough-stuff/rough-notation), MIT — stable/"done" since 2020, 4 KB). Used **directly as vanilla JS behind a small `useRoughAnnotation()` hook** (show/hide per annotation index, driven by `useInView` steps) — no React wrapper dependency; the community wrappers (`react-rough-notation`, `@turahe/react-rough-notation`) are thin, low-activity, and add nothing we need.
- **`remotion` 4.x** — devDependency only; render at build time via `@remotion/renderer` (local CLI render, no Lambda). **License:** free for individuals and organizations ≤ 3 employees ([license FAQ](https://www.remotion.dev/docs/license/faq)) — compliant for this personal portfolio; re-verify if the site ever becomes a company product. Output: muted `<video playsinline loop preload="none" poster>` — never the runtime player.
- **Counters:** `motion` springs (no react-countup dependency). **Sticky/step scenes:** CSS `position: sticky` + `useInView` (no Scrollama, no GSAP — `motion` + sticky covers every pattern; never two engines on one element).
- Optional progressive enhancement: CSS scroll-driven `animation-timeline` behind `@supports` for the progress rail only (Chrome/Edge 115+, Safari 26; harmless no-op elsewhere).
- **Guardrails:** `prefers-reduced-motion` → no pinning, trail fully drawn, counters static, loops show poster + play button. Content is 100% readable without motion. Mobile: no pinned scenes; map collapses to a static vertical timeline; loops tap-to-play.

### 6.1 Dependency decisions (all free, validated 2026-09-13)

| Package | Version | License | Role | Status |
|---|---|---|---|---|
| `motion` | ^13.1.0 (installed) | MIT | all scroll-linked & entrance animation | current, actively maintained |
| `lenis` | 1.x | MIT | desktop smooth scroll via `lenis/react` | current, actively maintained |
| `rough-notation` | 0.5.1 | MIT | hand-drawn annotations (vanilla, hooked) | stable/"done"; no wrapper dep |
| `remotion`, `@remotion/renderer` | 4.x | free license (individuals/≤3 ppl) | build-time field-recording loops | current, actively maintained |
| `simplex-noise` | 4.x | MIT | contour field seed (build script only) | stable |
| `d3-contour` | 4.x | ISC | marching-squares contours (build script only) | stable |
| `next/font` (built-in) | — | — | self-host Crimson Pro + JetBrains Mono, zero layout shift | Next.js best practice |
| `lucide-react` | ^1.31 (installed) | ISC | icons | keep |
| `embla-carousel-react` | ^8.6 (installed) | MIT | — | **remove** (Ledger replaces the carousel) |
| `@vercel/analytics` | keep | — | analytics | keep |

### 6.2 Framework best practices (Next.js 16 App Router)

- Server Components by default; `'use client'` only on interactive leaves (map overlay, chapters, counters, annotation hook, Lenis root).
- Content lives in typed `data/*.ts` modules imported by Server Components — no client-side data fetching; GitHub ledger list is generated at build time (plain `fetch`, no octokit).
- `next/image` for every screenshot (explicit `sizes`, lazy below fold); `next/font/google` for both typefaces (self-hosted, `display: swap`).
- No layout-shifting animations (transform/opacity only); SSR final values so content exists without JS.

## 7. Components (new/changed)

| Component | Action | Purpose |
|---|---|---|
| `components/map/ExpeditionMap.tsx` | new | interactive SVG overlay (waypoints, trail draw) over static `contours.svg` |
| `scripts/generate-map.mjs` | new | one-time contour generation: simplex-noise + d3-contour → `public/map/contours.svg` |
| `hooks/useRoughAnnotation.ts` | new | vanilla rough-notation wrapper: show/hide per annotation step |
| `components/journey/JourneyChapter.tsx` | new | waypoint chapter (pin, counters, press-clipping postcards rendered inline) |
| `components/journey/MetricCounter.tsx` | new | spring counter, SSR final value |
| `components/camps/BaseCamp.tsx` | new | sticky media + steps + loop (annotations driven by the hook above) |
| `components/ledger/Ledger.tsx` | new | repos + writing index |
| `components/Hero.tsx` | rewrite | map hero |
| `components/Experience.tsx` | delete | replaced by Journey |
| `components/Showcase.tsx` | delete | replaced by Camps + Ledger |
| `components/ParticleMesh.tsx` | delete | invisible in audit; freed budget |
| `components/ThemeToggle.tsx` | delete | v1 ships light-only (§4) |
| `data/journey.ts`, `data/camps.ts`, `data/ledger.ts` | new | typed content extracted from current Experience.tsx / Showcase.tsx |
| `remotion/*.tsx` | new | 3 loop compositions |
| `scripts/render-recordings.mjs` | new | build-time Remotion render |

StickyCTA/BackToTop/ScrollNav: retired; progress rail supersedes them.

## 8. Content plan

- Journey chapters derive from the 8 existing `Experience` entries consolidated into 5 eras (Medulla.AI + TekIP fold into one "language era"; AvloAI + consulting into "the agent years").
- **Content reconciliation needed during implementation:** the current site says "50+ locations" in the hero but "70+ new locations" in MoveInSync achievements — pick one figure (verify against user's records) and use it everywhere.
- Copy rewritten first-person; banned-word list check (delve/leverage/robust/etc.); every metric keeps its receipt (press link or repo).
- Camps need 1 real screenshot each (AgentCanvas ✓ `agent-canvas.png`, pi-dash ✓ `pi-dash.webp`, thetell ✓ `thetell.png` — all exist in `public/projects/`).
- Ledger sources: GitHub API at build time (static list with manual curation flags) — no client-side fetching.

## 9. Testing

- Unit: counter SSR values, journey data integrity (all press URLs resolve), ledger generation.
- Playwright: scroll progress rail reaches all chapters; reduced-motion path shows full content; mobile 390px has no horizontal overflow; loops present with posters.
- Lighthouse budget: LCP < 2.5s, CLS < 0.1, total JS ≤ current baseline + Lenis only.

## 10. Out of scope (v1)

Dark map theme, separate project pages, i18n, the Pokémon-journey easter egg (candidate for v2), remotion player UI in-page, blog.
