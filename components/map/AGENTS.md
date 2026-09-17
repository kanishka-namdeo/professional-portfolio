# map/ AGENTS.md

## Purpose
Map components for visual expedition navigation. Provides ExpeditionMap and map markers that give users a spatial overview of the portfolio structure.

## Ownership
- **Scope**: Map visualization components and markers
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Map components provide spatial navigation and waypoint visualization
- Waypoint chip list (`ExpeditionMap.tsx`) is `overflow-clip` with `[overflow-clip-margin:36px]`: chips are centered by `translate(-50%, …)`, and Blink counts their pre-transform layout boxes in scrollable overflow, which pushed documents 10-16px past narrow viewports. The margin must stay below the hero's px-10 (40px) viewport slack — raising it re-introduces horizontal overflow at 320-390px. Chip `<li>` anchors are `h-0 w-0` for the same reason.
- Trail marker hot path (`ExpeditionMap.tsx`): the trail is pre-sampled once per mount (~200 `getPointAtLength` points, jsdom-guarded) into a ref cache; the per-frame `useMotionValueEvent` handler only interpolates between samples — zero SVG geometry calls per frame. The marker is anchored `left:0/top:0` and moved with a single `transform: translate(calc(Xpx - 50%), calc(Ypx - 50%))`, where px come from a container clientWidth/Height cache kept fresh by a ResizeObserver (jsdom-guarded). Do not reintroduce per-frame `getPointAtLength` or `left/top` writes.
- Journey stroke writes are EPSILON-GATED (`STROKE_EPSILON` = 0.001 of path length ≈ 2px): the spring (170/26) emits sub-pixel tail deltas forever, and every delta repainted the whole trail path — a constant per-frame main-thread paint for the rest of the session. The writer skips deltas below the epsilon (terminal values 0/1 always write, so trailhead/destination anchor hits stay exact), letting the paint idle once the draw settles. The traveller marker is separate and stays per-frame (transform-only writes, compositor-friendly). Do not subscribe un-gated writers to `pathProgress`.
- Journey trail story sync (`ExpeditionMap.tsx`): the trail draw and traveller are a smoothstep-eased piecewise function of page scrollY pinned to the chapters — each waypoint's path fraction (`waypointFractions` over the sample cache, monotonic nearest-sample search) is anchored (`TrailAnchor`) to the scrollY at which its chapter centres, the same moment `useActiveEra`'s centre band highlights the pin. `buildTrailAnchors` prepends a set-off lead-in anchor (fraction 0, `LEAD_IN_VIEWPORTS` = 0.75 viewports before chapter 01 centres) so the traveller fades in and walks to the origin pin as the journey scrolls into view; the marker's opacity flip is a 300ms `transition-opacity` (reduced-motion suppressed). The per-segment smoothstep makes the traveller dwell at the waypoint while its chapter is centred (zero velocity at anchors) and glide between chapters — station-to-station, not a conveyor belt; anchor hits stay exact. It clamps at the trailhead before set-off and rests at the destination after the last chapter; anchors recompute on window resize and per-chapter ResizeObserver (press-ledger fold). The spring must stay near-critical (stiffness 170 / damping 26, ζ ≈ 1.0, ~0.3s settle) so it smooths without trailing the story. The hero keeps its one-shot load draw and the contour parallax is hero-only. Never drive the journey trail from section-transit scroll progress (`useScroll` on the section with `offset: ['start end','end start']`) — that window includes the section's enter/exit phases and desyncs the draw from the active chapter (the bug this contract replaced).

## Work Guidance
- Map components handle visual navigation
- Markers should be interactive and accessible
- Coordinate with camps/ for waypoint positioning

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
