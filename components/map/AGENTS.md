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

## Work Guidance
- Map components handle visual navigation
- Markers should be interactive and accessible
- Coordinate with camps/ for waypoint positioning

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
