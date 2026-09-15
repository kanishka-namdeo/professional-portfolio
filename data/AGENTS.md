# data/ AGENTS.md

## Purpose
Static data layer - TypeScript data files for camps (project showcases), journey chapters (career eras), and dispatches/artifacts (repos, writings).

## Ownership
- **Scope**: Data structures, content constants, type definitions
- **Parent**: Root AGENTS.md

## Local Contracts
- All data exports must be typed with explicit interfaces
- Arrays must be `readonly` or use `as const` where immutability is required
- IDs must be unique within their collections
- Image paths must reference `/projects/` or `/recordings/` as appropriate
- External URLs must be valid and reachable
- Coordinates in journey data are percentages (0-100) for map positioning
- Year fields use string format (e.g., '2025', '2026')
- Era entries may carry optional `testimonial` (quote/name/title) and `caseStudy` (`href: '/case-study-rentlz.html'` + label); `JourneyChapter` renders both
- Growth figures use the canonical pair: "70K+ monthly users" is total MAU (never call 70K "acquisition"); "30K+ new users onboarded" is the acquisition figure. Families figure is "2,000+ families" — never "thousands"

## Work Guidance
- Add new entries by appending to the appropriate array
- Update existing entries in-place; do not duplicate IDs
- When adding press mentions, include full URL and date in format "Mon YYYY" or "YYYY"
- When adding camp annotations, ensure CSS selectors match the screenshot container
- Keep metrics concrete and verifiable; avoid vague claims
- Era 05 ("agents") spans 2024 — present across three consulting engagements (Flipr, Cognium, AvloAI); the crossing text must name all three
- Test data changes by running the Jest test suite

## Verification
- Run `npm test data` or `npx jest data/` to validate data integrity
- Tests verify: unique IDs, required fields, valid URL formats, coordinate bounds

## Child DOX Index
- __tests__/ - Data validation tests (camps.test.ts, journey.test.ts)
