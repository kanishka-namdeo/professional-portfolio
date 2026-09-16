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
- Hooks that paint with theme tokens (e.g. `useRoughAnnotation` reads `--color-rust`) must read the token live at creation time via `getComputedStyle` — never hardcode a day-theme hex — and must re-create their output when the `dark` class flips on `<html>` (MutationObserver on documentElement's class attribute, cleaned up on unmount)
- Any overlay that locks page scroll (stops Lenis / sets `body { overflow: hidden }`) must use the shared `useModalLock(open)` counter (hooks/useModalLock.ts) — never stop/start Lenis or toggle body overflow directly. Overlays can stack (⌘K palette over the case-study dossier — though the palette now refuses to open over another `data-modal-dialog`), and an independent `start()` on close would release the page while the other overlay is still open
- `useModalLock` captures the body's true overflow once at the FIRST lock and restores it when the count hits zero, so cleanup order (FIFO or LIFO) can never strand `overflow: hidden` on the body. Exports `modalLockCount()` — a component that must resume Lenis imperatively mid-close (the palette's `travel()`) may only do so when `modalLockCount() <= 1`, i.e. when it holds the page's last lock

## Verification
- Unit tests in __tests__/ subdirectory
- Test hook lifecycle (mount, update, unmount)
- Mock external dependencies (Rough.js, browser APIs)

## Child DOX Index
- __tests__/ - Hook unit tests
