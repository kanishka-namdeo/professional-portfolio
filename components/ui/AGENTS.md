# ui/ AGENTS.md

## Purpose
UI primitives and foundational components. Provides reusable building blocks like buttons, cards, and layout elements used across the portfolio.

## Ownership
- **Scope**: Base UI primitives and shared components
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- UI primitives are framework-agnostic where possible
- Components in this directory are shared across feature components

## Work Guidance
- Keep primitives simple, composable, and well-documented
- Export all public components from index file
- Follow consistent prop naming across primitives

## Verification
- Tests should be added when components are created
- Run with `npm test` or `pnpm test`

## Child DOX Index
- None
