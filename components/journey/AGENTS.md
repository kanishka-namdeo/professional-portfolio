# journey/ AGENTS.md

## Purpose
Journey chapter components for narrative progression. Provides JourneyChapter, chapter displays, metric counters, and the case-study dossier reader that guide users through the portfolio story.

## Ownership
- **Scope**: Journey progression UI and chapter displays
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Journey components handle narrative flow and chapter transitions
- `JourneyChapter.tsx` uses `<time>` elements for period dates (semantic HTML for SEO)
- `JourneyChapter.tsx` press block ("Receipts from the press"): the FIRST `era.press` entry renders as the featured postcard card; the rest render as one-line ledger rows on a single taped sheet. Tails longer than `TAIL_VISIBLE` (3) fold behind a `+N more clippings` toggle (`aria-expanded` + `aria-controls` → `#press-tail-{era.id}`, conditional rows). Row links carry an always-visible `↗` (never hover-only affordances) and `--color-rust-text`/`--color-ink-muted` for small text on the tinted ledger surface
- `JourneyChapter.tsx` renders optional era fields after the press row: `testimonial` as an ink-on-paper blockquote card (`figure` > `blockquote` + `figcaption`/`cite`, reuses the press-postcard classes) and `caseStudy` via `CaseStudyDossier` — no new design language
- `Journey.tsx` chapters-column grid item carries `min-w-0`: the press-ledger rows use `truncate` (nowrap) headlines, and without it the mobile grid track floors at the widest headline (~576px), forcing horizontal overflow (guarded by the `no horizontal overflow` e2e test at 320/390px)
- `CaseStudyArticle.tsx` is the shared presentational renderer for a `CaseStudyDoc` (data/caseStudy.ts); keep it hook-free so it works in server and client trees. It serves two surfaces that must stay identical: the `/case-study/rentlz` route (app/case-study/rentlz/page.tsx — passes `titleAs="h1"`, so sections are h2 and inner headings h3) and the `CaseStudyDossier` overlay (default `titleAs="h2"` → h3 sections, h4 inners — the trail page already has its own h1). Heading levels always derive from `titleAs`; never hardcode them
- `CaseStudyDossier.tsx` opens the full case study as an in-page dialog overlay instead of navigating away: the chapter stamp is a `next/link` anchor (basePath-rewritten for the Pages mirror's no-JS visitors; modifier-clicks like Cmd+new-tab fall through to the browser), a plain click is intercepted to open the overlay. The case-study document and renderer load LAZILY on first open (`import('@/data/caseStudy')` + `import('./CaseStudyArticle')`) — the ~25KB doc must not sit in the home page's critical chunk, so the component takes only `href`/`label`, never a `doc` prop. Scroll lock goes through the shared `useModalLock` (hooks/useModalLock.ts). Focus handling mirrors WaypointPalette — trap Tab, Esc/button closes and restores focus to the stamp; the trigger carries `aria-haspopup="dialog"` + `aria-expanded`; the dialog root carries `data-modal-dialog="dossier"` (the palette checks it and refuses to stack over an open dialog)
- `JourneyChapter.tsx` press ledger: the taped sheet is a wrapper `div` (positioning/tape/border classes live there) around a bare `<ul>` — a ul's content model allows only li children, so the decorative tape span must never sit inside it. Truncated row headlines carry `title={p.headline}` so sighted users can reach the full text

## Work Guidance
- Journey components drive the narrative structure
- Chapter displays should be self-contained and reusable
- MetricCounter provides animated statistics

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
