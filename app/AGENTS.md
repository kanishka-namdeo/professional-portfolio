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
  - JSON-LD structured data in single `@graph` (WebSite, WebPage, Person with worksFor) — no ProfessionalService entry (job-seeker, not a consulting business); worksFor maps each era's compound `company` ("Medulla.AI · TekIP") to the first segment before '·'; Person/contactPoint email is the no-hyphen `kanishkanamdeo@hotmail.com`
  - Theme pre-paint script to prevent flash (reads `dispatches-theme` from localStorage)
  - Skip-to-content link for a11y
- **Page** (`page.tsx`): Single-page scrollytelling portfolio with:
  - Hero section
  - Journey timeline
  - Base Camps (projects)
  - Ledger (skills/tools)
  - End of Trail (contact)
  - Fixed UI: TrailProgress, ThemeToggle, WaypointPalette
  - Page-level JSON-LD in single `@graph` (FAQPage, BreadcrumbList, SoftwareApplication per camp, BlogPosting per writing entry); BlogPosting `datePublished` converts ledger "Mon YYYY" display dates to ISO 8601 via `toISODate` in page.tsx
  - Crawler-friendly `<nav>` with explicit section links (each link is `sr-only-focusable`: clipped until keyboard focus reveals it as a chip — no invisible tab stops); the four section roots (`#journey`, `#camps`, `#ledger`, `#contact`) carry `tabIndex={-1}` so skip/anchor jumps land focus on the section
- **Styles** (`globals.css`): Tailwind v4 CSS-first config with:
  - Dispatches design tokens (parchment, ink, rust palette) plus AA-contrast tokens: `--color-ink-muted` (microcopy), `--color-on-rust` (text on rust fills), `--color-rust-text` (small rust text; light = rust, dark = lightened)
  - Day/night theming via `.dark` class
  - Film grain overlay
  - Accessibility utilities (`sr-only`, `sr-only-focusable` reveal-on-focus nav chips, `skip-link`, `[tabindex='-1']` anchor-target rules: outline suppressed + `scroll-margin-top: 80px`)
  - Reduced motion support

## Work Guidance
- Modify `layout.tsx` for site-wide SEO, fonts, or analytics changes
- Modify `page.tsx` for section ordering or page-level schema markup
- Modify `globals.css` for design token changes; component styles live in their own files
- Keep JSON-LD schemas in sync with content changes in `data/` or `components/`
- Theme preference persists to `localStorage` key `dispatches-theme`
- New routes: create folders with `page.tsx` (App Router convention)

## Verification
- Run `npm run build` to validate static export compiles
- Run `npm run test:e2e` for Playwright smoke tests covering navigation and theme toggle

## Child DOX Index
No child docs
