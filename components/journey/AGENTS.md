# journey/ AGENTS.md

## Purpose
Journey chapter components for narrative progression. Provides JourneyChapter, chapter displays, and metric counters that guide users through the portfolio story.

## Ownership
- **Scope**: Journey progression UI and chapter displays
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Journey components handle narrative flow and chapter transitions
- `JourneyChapter.tsx` uses `<time>` elements for period dates (semantic HTML for SEO)

## Work Guidance
- Journey components drive the narrative structure
- Chapter displays should be self-contained and reusable
- MetricCounter provides animated statistics

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
