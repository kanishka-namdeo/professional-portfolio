# app/ AGENTS.md

## Purpose
Owns the Next.js App Router entry points: root layout with theme/font providers, the main page with scrollytelling experience, and global CSS design tokens.

## Ownership
- **Scope**: App-level routes, root layout, global CSS, SEO metadata, JSON-LD schemas
- **Parent**: Root AGENTS.md

## Local Contracts
- **Layout** (`layout.tsx`): Single root layout wrapping all pages. Handles:
  - Google Fonts (Crimson Pro, JetBrains Mono) via next/font
  - ReactLenis for smooth scroll
  - SEO metadata via Next.js `metadata` export (OpenGraph, Twitter, canonical) — no manual `<meta>` tags
  - Viewport config via separate `viewport` export (themeColor, width, initialScale)
  - JSON-LD structured data in single `@graph` (WebSite, Person with worksFor) — no ProfessionalService entry (job-seeker, not a consulting business); worksFor maps each era's compound `company` ("Medulla.AI · TekIP") to the first segment before '·'; Person/contactPoint email is the no-hyphen `kanishkanamdeo@hotmail.com` (plain address — schema.org `email` rejects `mailto:` URIs). The homepage `WebPage` node lives in `page.tsx` (a layout-level WebPage described every route as the homepage). All JSON-LD goes through a `serializeJsonLd` helper that escapes `<` as `\u003c` so a `</script>` sequence inside data can never terminate the block
  - Theme pre-paint script to prevent flash (reads `dispatches-theme` from localStorage)
  - Skip-to-content link targets `#main-content` (`<main>` carries `tabIndex={-1}`) so it works on every route — do not point it at a home-only anchor like `#journey`
  - Custom head links (sitemap/rss/llms.txt) AND the metadata-API `icons`/`manifest` use absolute `https://kanishkanamdeo.com/...` URLs — raw head HTML is not rewritten with basePath on the GitHub Pages mirror
  - `<Analytics />` renders only when `NEXT_BASE_PATH` is unset — on the Pages mirror build the script URL would 404 under the project basePath on every pageview
- **global-error.tsx**: root-layout crash boundary (app/error.tsx only catches segment errors below the layout). Must render its own `<html>/<body>` with the same theme pre-paint snippet; navigation is a raw `<a>` (next/link's router context is gone during a root-layout crash — eslint-disabled for that reason)
- **Page** (`page.tsx`): Single-page scrollytelling portfolio with:
  - Hero section
  - Journey timeline
  - Base Camps (projects)
  - Ledger (skills/tools)
  - End of Trail (contact)
  - Below-the-fold islands (BaseCamp, Ledger, EndOfTrail) load via `next/dynamic` with `ssr: true` — a JS-chunk split only: their HTML stays server-rendered, no `loading` fallback. Hero and Journey stay in the critical-path import graph.
  - Fixed UI: TrailProgress, ThemeToggle, WaypointPalette
  - Page-level JSON-LD in single `@graph` (WebPage for the homepage, FAQPage, SoftwareApplication per camp with full ISO `datePublished` (`${year}-01-01` — camp data pins only the year), BlogPosting per writing entry); BlogPosting `datePublished` converts ledger "Mon YYYY" display dates to ISO 8601 via `toISODate` in page.tsx. No BreadcrumbList: Google expects crawlable page URLs, and same-page hash fragments don't qualify
  - Crawler-friendly `<nav>` with explicit section links (each link is `sr-only-focusable`: clipped until keyboard focus reveals it as a chip — no invisible tab stops); the four section roots (`#journey`, `#camps`, `#ledger`, `#contact`) carry `tabIndex={-1}` so skip/anchor jumps land focus on the section
- **Styles** (`globals.css`): Tailwind v4 CSS-first config with:
  - Dispatches design tokens (parchment, ink, rust palette) plus AA-contrast tokens: `--color-ink-muted` (microcopy), `--color-on-rust` (text on rust fills), `--color-rust-text` (small rust text; light = rust, dark = lightened)
  - Day/night theming via `.dark` class
  - Film grain overlay
  - Accessibility utilities (`sr-only`, `sr-only-focusable` reveal-on-focus nav chips, `skip-link`, `[tabindex='-1']` anchor-target rules: outline suppressed + `scroll-margin-top: 80px`) plus `.theme-toggle-sun`/`.theme-toggle-moon` visibility rules — ThemeToggle renders both icons and CSS picks by `html.dark`, so the icon matches the theme on first paint
  - Reduced motion support
- **Case study route** (`case-study/rentlz/page.tsx`): standalone themed home for the RentLz case study, rendered from `data/caseStudy.ts` via the shared `CaseStudyArticle` (passed `titleAs="h1"` — the route's only h1) — the trail chapter opens the same document as an in-page `CaseStudyDossier` overlay instead of navigating here. Its content wrapper is a `<div>`, not `<main>` (the layout already provides the single main landmark on every route; nested mains are invalid HTML). Carries its own metadata (canonical `/case-study/rentlz`, OpenGraph — with `images` REDECLARED because a page-level openGraph replaces the layout's wholesale — `publishedTime`, Twitter card) and Article JSON-LD. The legacy `public/case-study-rentlz.html` is a meta-refresh redirect stub to this route (noindex) kept for old backlinks
- **Field log route** (`field-log/page.tsx`): print-first one-page digest (career log, base camps, field writing) derived from the same data modules, so it can't drift from the site. Carries its own canonical (`/field-log` — without the override it inherits the root layout's homepage canonical and would be indexed as a duplicate of `/`), OpenGraph and Twitter metadata

## Work Guidance
- Modify `layout.tsx` for site-wide SEO, fonts, or analytics changes
- Modify `page.tsx` for section ordering or page-level schema markup
- Modify `globals.css` for design token changes; component styles live in their own files
- Keep JSON-LD schemas in sync with content changes in `data/` or `components/`
- Theme preference persists to `localStorage` key `dispatches-theme`
- New routes: create folders with `page.tsx` (App Router convention)

## Verification
- Run `pnpm run build` to validate static export compiles
- Run `pnpm run lint` and `pnpm run type-check`
- Run `pnpm test` for the jest suite
- Run `npx playwright test` for the e2e suite (axe a11y gate over every route × theme × viewport, keyboard navigation); it also runs automatically on every push to main via `.github/workflows/e2e.yml`

## Child DOX Index
No child docs
