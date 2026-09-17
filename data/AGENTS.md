# data/ AGENTS.md

## Purpose
Static data layer - TypeScript data files for camps (project showcases), journey chapters (career eras), dispatches/artifacts (repos, writings), and the RentLz case study document.

## Ownership
- **Scope**: Data structures, content constants, type definitions
- **Parent**: Root AGENTS.md

## Local Contracts
- All data exports must be typed with explicit interfaces
- Arrays must be `readonly` or use `as const` where immutability is required
- IDs must be unique within their collections
- Image paths must reference `/projects/` or `/recordings/` as appropriate
- Camps carry a `media` archive per camp: the PLATE (product screenshot from `/projects/`) first, FR-xx still frames pulled from the recording (`/recordings/<camp>-fr-XX.webp`, extracted by `scripts/extract-camp-stills.mjs`) in between, and the recording LAST — the stage rests on it before and after the story (guarded by camps.test.ts)
- Every media item declares intrinsic `width`/`height` pixels — the stage's letterbox mat and the CLS-free box derive from them. If you re-encode an artifact, update these numbers
- Each `CampStep` carries a `mediaIndex` into `camp.media`; the LAST step must point at the recording. Annotation `selector` names (`data-anno="…"`) must be unique across the WHOLE camp, not just one media item, or rough-notation can anchor to a dying crossfade layer (guarded by camps.test.ts)
- The recording media carries `poster`, `duration` (whole seconds, slate shows MM:SS) and a `chapter: [start, end)` loop window — the money moment that loops while the last step is active; keep it inside the film length (guarded by camps.test.ts)
- Camp screenshots ship pre-optimized (WebP, ≤2560w) — the GitHub Pages static export serves them unoptimized, so source files must be dieted via `scripts/optimize-images.mjs`, not committed raw. The same diet applies to extracted FR-xx frames (extract-camp-stills.mjs writes 1280×720 WebP q82 directly)
- External URLs must be valid, reachable, and https-only (guarded by journey.test.ts)
- Press dates use "Mon YYYY" or "YYYY" (guarded by journey.test.ts)
- Coordinates in journey data are percentages (0-100) for map positioning
- Year fields use string format (e.g., '2025', '2026')
- Era entries may carry optional `testimonial` (quote/name/title) and `caseStudy` (`href: '/case-study/rentlz'` + label); `JourneyChapter` renders the case study via `CaseStudyDossier` (in-page overlay, anchor href kept for no-JS/crawlers)
- The Wipro testimonial (Nittan Bhalla) appears in BOTH `journey.ts` and `caseStudy.ts` and must stay byte-identical in wording and punctuation: em dash in the title ("Senior VP & Global Head — Workplace Operations, Wipro"), typographic apostrophes in the quote
- The case study's GTM steps timeline starts at Q2 2022: the tenure stated in meta is "Apr 2022 — Oct 2024", so no step may predate April 2022
- The full RentLz case study text lives in `caseStudy.ts` as a structured `CaseStudyDoc` (blocks: p/metrics/features/quote/steps/lessons; `**bold**`/`*italic*` inline markers parsed by the renderer). It renders in two places that must stay identical — the `CaseStudyDossier` overlay (loads this module lazily on first open) and the `/case-study/rentlz` route — so edit the data, never one surface
- Growth figures use the canonical pair: "70K+ monthly users" is total MAU (never call 70K "acquisition"); "30K+ new users onboarded" is the acquisition figure. Families figure is "2,000+ families" — never "thousands". The same canon applies inside `caseStudy.ts` (guarded by caseStudy.test.ts) and inside journey.ts's mobility era (guarded by journey.test.ts: 70K+/monthly users metric and the summit's "70,000+ monthly users" string, with an explicit no-30K assertion)

## Work Guidance
- Add new entries by appending to the appropriate array
- Update existing entries in-place; do not duplicate IDs
- When adding press mentions, include full URL and date in format "Mon YYYY" or "YYYY"; array ORDER matters — the first entry is the featured clipping (rendered as a full card, the strongest/most credible mention), the rest become compact ledger rows
- When adding camp annotations, ensure CSS selectors are unique across the camp and positions are percentages of that media's box (edge-aware anchoring: x < 50 pins left, else right)
- Keep metrics concrete and verifiable; avoid vague claims
- Era 05 ("agents") spans 2024 — present across three consulting engagements (Flipr, Cognium, AvloAI); the crossing text must name all three
- Test data changes by running the Jest test suite

## Verification
- Run `npm test data` or `npx jest data/` to validate data integrity
- Tests verify: unique IDs, required fields, valid URL formats, coordinate bounds

## Child DOX Index
- __tests__/ - Data validation tests (camps.test.ts, journey.test.ts, caseStudy.test.ts)
