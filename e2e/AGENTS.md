# e2e/ AGENTS.md

## Purpose
Playwright end-to-end tests for accessibility and user flows

## Ownership
- **Scope**: E2E test suites, browser automation
- **Parent**: Root AGENTS.md

## Local Contracts
- Tests must cover critical user journeys and accessibility features
- Page objects pattern preferred for maintainable selectors
- Tests run against local dev server or staging environment
- Snapshots and screenshots must be reviewed before committing

## Work Guidance
- Add tests for new user flows in `{feature}.spec.ts`
- Use `keyboard.spec.ts` for a11y keyboard navigation coverage
- Use `dispatches.spec.ts` as reference for page interaction patterns
- Run `npx playwright test` to execute suite
- Run `npx playwright test --ui` for interactive debugging
- Update snapshots with `npx playwright test --update-snapshots`

## Verification
- Playwright test suite must pass before merge
- Accessibility tests validate WCAG 2.2 AA compliance (keyboard order, skip-link focus landing, visible focus chips, no-horizontal-overflow at 390px and 320px)
- CI runs full E2E suite on PR and main branch

## Child DOX Index
- No child docs
