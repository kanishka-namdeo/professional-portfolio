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
- `optimize-images.mjs` exists because the GitHub Pages static export serves `public/` files unoptimized: oversized sources (e.g. project screenshots) must be resized/re-encoded (WebP q82, ≤2560w) before commit
- `lib/contours.mjs` keeps `contours.svg` (the LCP image) on a byte diet: Douglas-Peucker ring simplification (`DP_TOLERANCE` 0.4 viewBox units), integer coordinate rounding, relative `l` deltas, `MIN_POINT_STEP` 0.4 — regenerate with `pnpm run map`; do not ship the raw marching-squares output

## Verification
- Tests in `__tests__/` run with `node --test` or project test runner
- Each exported `lib/` function should have corresponding test coverage
- Manual verification: run script and inspect output artifacts

## Child DOX Index
- `lib/` - Script utilities (brand-mark.mjs, contours.mjs)
- `__tests__/` - Script tests (contours.test.mjs)
- `optimize-images.mjs` - sharp-based image diet for unoptimized static export
