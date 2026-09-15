# components/ AGENTS.md

## Purpose
React component library for the portfolio. Organized by feature domain (camps, journey, ledger, map) plus shared UI primitives and tests.

## Ownership
- **Scope**: React components, feature-specific UI, component-level tests
- **Parent**: Root AGENTS.md (`/d/test_misc/professional-portfolio/AGENTS.md`)

## Local Contracts

### File Naming
- Components use PascalCase: `Hero.tsx`, `BaseCamp.tsx`, `ExpeditionMap.tsx`
- Test files: `ComponentName.test.tsx` in `__tests__/` directories
- Co-locate tests with components or in `__tests__/` subdirectories per domain

### Component Structure
- Use `'use client'` directive for client components
- Export default for page-level components; named exports for reusable parts
- Props typed inline or via imported types from `@/types` or `@/data/*`
- Keep components focused: single responsibility per file

### Styling
- Tailwind CSS utility classes only
- Theme tokens via CSS variables: `var(--color-parchment)`, `var(--color-ink)`, `var(--color-rust)`
- AA-contrast tokens (WCAG 2.2, computed in `app/globals.css` comments):
  - `--color-ink-muted` for dimmed microcopy (captions, readouts, hints, placeholders) — never alpha-fade ink to /65 or lower, and never put `opacity` on a container holding text
  - `--color-on-rust` for text/icons sitting on a `bg-[var(--color-rust)]` fill (e.g. active options/chips)
  - `--color-rust-text` for small (≤12px) rust text on tinted surfaces (e.g. FieldNote on notepaper)
- Typography via font variables: `var(--font-voice)` (headings), `var(--font-data)` (metrics/labels)

### Motion/Animation
- Use `motion/react` for animations
- Respect `useReducedMotion()` for accessibility
- Lazy-load heavy motion components when possible

## Work Guidance

### Adding New Components
1. Place in appropriate domain folder (`camps/`, `journey/`, `ledger/`, `map/`) or root for shared
2. Create matching test file in `__tests__/` (or co-located `__tests__/` subdirectory)
3. Use existing components as templates (see `Hero.tsx`, `BaseCamp.tsx`)

### Hero Contract
- `Hero.tsx` must state role, years, and headline metrics in visible text directly under the name (5-second rule): "Product Manager · 9+ years · SaaS, mobility & AI" plus the mono metrics line "8× ARR · 70K+ monthly users · 50+ locations"
- Keep the "Follow the trail ↓" CTA and the availability line; no badges/gradients

### Feature Domains
- `camps/` - Base camp components (portfolio project showcases)
- `journey/` - Journey chapter components (career timeline)
- `ledger/` - Ledger/dispatches components (blog/writing)
- `map/` - Expedition map components (interactive navigation)
- `ui/` - UI primitives (buttons, inputs, etc. - currently minimal)

### Accessibility Requirements
- All interactive elements need `aria-label` or visible text
- Video elements must have pause controls (WCAG 2.2.2)
- Respect `prefers-reduced-motion` for animations (including scroll-driven springs)
- Keyboard navigation must work for all interactive elements
- Section anchor roots (`#journey`, `#camps`, `#ledger`, `#contact`) carry `tabIndex={-1}` so fragment jumps land focus there; the `[tabindex='-1']` CSS in `globals.css` suppresses the container outline and sets the scroll margin
- Visible focus-visible outlines in rust on every interactive element; tap targets ≥ 24×24px (padding/flex hit area, not type size)
- Heading outline stays logical: h1 (sr-only) → section h2s → subsection h3s (e.g. ContactFAQ under EndOfTrail)

## Verification

### Test Pattern
```typescript
// components/__tests__/ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  it('renders expected content', () => {
    render(<ComponentName />);
    expect(screen.getByText(/expected/i)).toBeInTheDocument();
  });
});
```

### Running Tests
```bash
npm test -- components/__tests__
npm test -- components/camps/__tests__
```

### Coverage Areas
- Component rendering
- User interactions (clicks, inputs)
- Accessibility attributes
- Motion behavior (mocked)

## Child DOX Index

- `camps/` - Base camp showcase components (project deep-dives)
  - `__tests__/` - Camp component tests
- `journey/` - Career journey/timeline components
  - `__tests__/` - Journey component tests
- `ledger/` - Writing/dispatches components
  - `__tests__/` - Ledger component tests
- `map/` - Interactive expedition map
  - `__tests__/` - Map component tests
- `ui/` - Shared UI primitives (buttons, inputs, etc.)
- `__tests__/` - Root-level component tests (Hero, TrailProgress, etc.)

---

**DOX Compliance**: Read parent AGENTS.md before editing. Update this file when adding/removing domains or changing component conventions.
