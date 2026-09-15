# camps/ AGENTS.md

## Purpose
Base camp components for expedition waypoints. Provides the BaseCamp component and camp navigation elements that mark key locations in the portfolio journey.

## Ownership
- **Scope**: Base camp UI components and camp navigation
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Camp components are themed around expedition/base camp metaphor
- `BaseCamp.tsx` renders the camp eyebrow (`BASE CAMP — TITLE · YEAR`) as the camp's `h2` with unchanged styling, so camps appear in the heading outline (h1 → section h2s)
- Step "dim" state switches text to `--color-ink-muted`; the step `<li>` must never take `opacity` (stacked opacity drops text below 4.5:1 in both themes)
- The `<video>` carries `width={1280} height={720}` (poster size) plus `h-auto w-full` so the browser reserves the 16:9 box before metadata loads — do not remove (CLS)
- The camp container's `useInView` uses `once: true`: rough annotations are created on first entry and then only shown/hidden per step (`useRoughAnnotation`'s step effect). Without `once`, every scroll re-entry tore the marks down and re-animated them.

## Work Guidance
- Keep camp components focused on waypoint presentation
- Use shared UI primitives from ui/ for buttons and cards
- Maintain expedition theme consistency

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
