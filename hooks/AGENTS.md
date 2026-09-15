# hooks/ AGENTS.md

## Purpose
Custom React hooks for state management and side effects

## Ownership
- **Scope**: Reusable React hooks
- **Parent**: Root AGENTS.md

## Local Contracts
- Hooks must be pure functions starting with "use"
- Hooks must handle cleanup in useEffect return functions
- No direct DOM manipulation except through refs
- State initialization must support SSR (no window/document access during init)

## Work Guidance
- Keep hooks focused on single concerns
- Export types alongside hooks when interfaces are complex
- Document hook parameters and return values with JSDoc
- Prefer composition over complex internal state

## Verification
- Unit tests in __tests__/ subdirectory
- Test hook lifecycle (mount, update, unmount)
- Mock external dependencies (Rough.js, browser APIs)

## Child DOX Index
- __tests__/ - Hook unit tests
