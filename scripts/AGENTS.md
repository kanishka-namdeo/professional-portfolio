# scripts/ AGENTS.md

## Purpose
Build and generation scripts for brand assets, map generation, and video rendering. Node.js utilities that run at build time to generate static assets and content derivatives.

## Ownership
- **Scope**: Node.js scripts for build-time operations
- **Parent**: Root AGENTS.md

## Local Contracts
- Scripts must be executable as ES modules (`.mjs`) or CommonJS (`.cjs`) where required
- Generated assets write to `../public/` or project-defined output directories
- Scripts read source data from `../data/` and `../src/assets/`
- `lib/` contains shared script utilities; imports use relative paths
- Build scripts must exit with non-zero code on failure

## Work Guidance
- Run scripts via `node scripts/<script-name>.mjs` from project root
- Add new shared utilities to `lib/` with descriptive names
- Keep scripts focused: one primary responsibility per file
- Use `console.error()` for errors; `console.log()` for progress output
- Update corresponding tests in `__tests__/` when modifying script behavior
- Dependencies: Node.js built-ins preferred; external deps require parent approval (`sharp` is approved for `optimize-images.mjs` — already in the dependency graph, runs offline only)
- `optimize-images.mjs` exists because the GitHub Pages static export serves `public/` files unoptimized: oversized sources (e.g. project screenshots) must be resized/re-encoded (WebP q82, ≤2560w) before commit. Its `TARGETS` list is empty today (committed screenshots are already dieted; the old raw sources were one-shot optimized and deleted) — add an entry when committing a new raw shot
- `copy-headers.cjs` (run by `pnpm run build:github`) serializes `next.config.mjs` `headers()` into `out/_headers` at build time — it reads the config dynamically, translates every rule's source to `_headers` glob syntax (`/projects/:path*` → `/projects/*`), and defaults `NODE_ENV` to production before importing the config (the HSTS entry is env-gated; `next build`'s internal NODE_ENV does not reach this sibling process — without the default, `_headers` silently dropped HSTS). Never hand-maintain the header list
- `lib/contours.mjs` keeps `contours.svg` (the LCP image) on a byte diet: Douglas-Peucker ring simplification (`DP_TOLERANCE` 0.4 viewBox units), integer coordinate rounding, relative `l` deltas, `MIN_POINT_STEP` 0.4 — regenerate with `pnpm run map`; do not ship the raw marching-squares output
- `generate-brand-assets.mjs` renders the og social card + icons via Playwright Chromium + sharp; its proof line MUST match the number canon (8× ARR, see data/AGENTS.md) — regenerate with `node scripts/generate-brand-assets.mjs` after any change and eyeball `public/og-image.jpg` (the committed card had shipped with a stale "10× ARR" once; Read tool renders JPGs, so verify visually)
- `extract-camp-stills.mjs` pulls the FR-xx archive frames from the base-camp recordings: `node scripts/extract-camp-stills.mjs sheet` writes timecoded contact sheets to `.stills-tmp/` for visual review, then set `CHOICES` and run `final` to write 1280×720 WebP q82 stills into `public/recordings/`. Candidates avoid the parchment title/end cards (~0-2.5s, last ~3s). After re-recording a camp, re-pick frames AND re-check the `chapter` windows in `data/camps.ts` against the new timeline (chapters are timestamps, not content anchors)

## Verification
- Tests in `__tests__/` run with `node --test` or project test runner
- Each exported `lib/` function should have corresponding test coverage
- Manual verification: run script and inspect output artifacts

## Child DOX Index
- `lib/` - Script utilities (brand-mark.mjs, contours.mjs)
- `__tests__/` - Script tests (contours.test.mjs)
- `optimize-images.mjs` - sharp-based image diet for unoptimized static export
