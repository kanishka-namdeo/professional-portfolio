# ledger/ AGENTS.md

## Purpose
Ledger and dispatches components for tracking portfolio artifacts. Provides the Ledger component and dispatch cards that display project history and communications.

## Ownership
- **Scope**: Ledger UI and dispatch card displays
- **Parent**: components/ AGENTS.md

## Local Contracts
- Components follow the project component patterns
- Tests co-located in __tests__/
- Ledger components present chronological records and dispatches
- Repo rows: the one-liner grid column carries `min-w-0` so the row can shrink on narrow viewports (keeps 320px free of horizontal overflow); writing-strip card links use the rust inside-outline focus pattern (`-outline-offset` — the scroll strip clips outside outlines)

## Work Guidance
- Ledger components manage artifact presentation
- Dispatch cards should support rich content
- Maintain chronological ordering where applicable

## Verification
- Tests located in __tests__/ directory
- Run with `npm test` or `pnpm test`

## Child DOX Index
- __tests__/ - Component-specific tests
