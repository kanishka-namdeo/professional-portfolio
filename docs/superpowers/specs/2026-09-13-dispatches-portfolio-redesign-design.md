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

**Procedural SVG contours** (user decision): contour rings generated as SVG paths (seeded, deterministic — same output every build), plus 5 waypoint markers positioned along a south-west → north-east trail (2016 origin at bottom, 2026 at top). Waypoints are interactive on the hero (click scrolls to chapter). Hand-wobble applied to trail strokes only, not contours. Estimated size < 200 KB.

## 6. Motion & interaction engine

- `motion` (`useScroll`, `useInView`, springs) for: trail drawing, counter springs, annotation step activation, postcard entrances, progress rail. No GSAP; never two engines on one element.
- **Lenis** for desktop smooth scroll; native touch scrolling on mobile (Lenis `syncTouch` off).
- Annotation steps: sticky media panel + stepping text (IntersectionObserver), desktop side-by-side; stacked inline on mobile.
- Counters: rendered server-side at final value (content exists without JS); springs enhance on view.
- **Remotion:** devDependency; loops rendered at build time via CI/script to `public/recordings/*.mp4` + poster JPGs. Never the runtime player in the page.
- **Guardrails:** `prefers-reduced-motion` → no pinning, trail fully drawn, counters static, loops show poster with a play button instead of autoplay. Content is 100% readable without motion (web.dev rule).
- Mobile: no pinned scenes; map collapses to a static vertical timeline with connecting line; media stacks; loops tap-to-play.

## 7. Components (new/changed)

| Component | Action | Purpose |
|---|---|---|
| `components/map/ExpeditionMap.tsx` | new | SVG map, waypoints, trail draw |
| `components/journey/JourneyChapter.tsx` | new | waypoint chapter (pin, counters, postcards) |
| `components/journey/MetricCounter.tsx` | new | spring counter, SSR final value |
| `components/journey/PressPostcard.tsx` | new | press clipping artifact |
| `components/camps/BaseCamp.tsx` | new | sticky media + steps + loop |
| `components/camps/AnnotationLayer.tsx` | new | Rough-Notation-style callouts |
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
