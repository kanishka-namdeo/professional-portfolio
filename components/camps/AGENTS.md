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

## Work Guidance
- Keep camp components focused on waypoint presentation
- Use shared UI primitives from ui/ for buttons and cards
- Maintain expedition theme consistency

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
