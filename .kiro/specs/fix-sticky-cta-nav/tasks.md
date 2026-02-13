# Implementation Plan: Fix Sticky CTA and Navigation Issues

## Overview

This implementation plan addresses z-index stacking conflicts and scroll behavior issues in the sticky CTA and navigation components. The work is organized into discrete tasks that build incrementally, starting with CSS fixes, then component refactoring, and finally testing.

## Tasks

- [x] 1. Define z-index CSS custom properties
  - Add z-index custom properties to `:root` in `app/globals.css`
  - Define values: `--z-navigation: 1100`, `--z-mobile-menu: 1060`, `--z-backdrop: 1050`, `--z-sticky-widgets: 1000`
  - _Requirements: 1.1, 1.4_

- [x] 2. Update Navigation component z-index values
  - [x] 2.1 Update desktop navigation z-index in CSS
    - Change `.nav` z-index from `1000` to `var(--z-navigation)` in `app/globals.css`
    - _Requirements: 1.2, 1.4_
  
  - [x] 2.2 Update mobile navigation z-index values in CSS
    - Update `.nav` mobile z-index to `var(--z-navigation)` (was 1002)
    - Update `.mobile-nav` z-index to `var(--z-mobile-menu)` (was 1003)
    - Update `.nav-backdrop` z-index to `var(--z-backdrop)` (was 1001)
    - _Requirements: 1.3, 1.4, 1.5_
  
  - [x] 2.3 Write property test for navigation z-index dominance
    - **Property 1: Navigation Z-Index Dominance**
    - **Validates: Requirements 1.2**
  
  - [x] 2.4 Write property test for mobile menu z-index ordering
    - **Property 2: Mobile Menu Z-Index Ordering**
    - **Validates: Requirements 1.3**

- [x] 3. Update Sticky CTA component z-index values
  - [x] 3.1 Update sticky CTA z-index in CSS
    - Ensure `.sticky-cta-transformable` uses `var(--z-sticky-widgets)` (currently 1000)
    - Ensure `.mobile-fab` uses `var(--z-sticky-widgets)` (currently 1000)
    - _Requirements: 1.4_
  
  - [x] 3.2 Write property test for z-index consistency across breakpoints
    - **Property 3: Z-Index Consistency Across Breakpoints**
    - **Validates: Requirements 1.5**

- [x] 4. Checkpoint - Verify z-index hierarchy
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Refactor Navigation scroll behavior
  - [x] 5.1 Optimize scroll event handler with RAF
    - Ensure `rafRef` is properly checked before creating new RAF
    - Ensure `lastScrollYRef` is updated after each RAF callback
    - Add proper RAF cleanup in useEffect return
    - _Requirements: 4.1, 4.2, 4.4, 8.1, 8.4, 8.5_
  
  - [x] 5.2 Add mobile menu exception to scroll hiding
    - Update scroll handler to check `isOpen` state
    - Prevent hiding navigation when `isOpen === true`
    - _Requirements: 4.5_
  
  - [x] 5.3 Write property test for navigation scroll direction behavior
    - **Property 6: Navigation Scroll Direction Behavior**
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 5.4 Write property test for navigation visibility during mobile menu
    - **Property 7: Navigation Visibility During Mobile Menu**
    - **Validates: Requirements 4.5**
  
  - [x] 5.5 Write unit tests for scroll edge cases
    - Test scroll position exactly at 200px threshold
    - Test rapid scroll direction changes
    - Test scroll while mobile menu is open
    - _Requirements: 4.1, 4.2, 4.5_

- [x] 6. Refactor StickyCTA scroll behavior
  - [x] 6.1 Optimize scroll event handler with RAF
    - Add `rafRef` to track pending RAF callbacks
    - Update scroll handler to use RAF pattern
    - Add proper RAF cleanup in useEffect return
    - _Requirements: 2.1, 8.1, 8.4, 8.5_
  
  - [x] 6.2 Write property test for CTA visibility based on scroll
    - **Property 4: CTA Visibility Based on Scroll Position**
    - **Validates: Requirements 2.1, 3.2**
  
  - [x] 6.3 Write unit tests for CTA interactions
    - Test hover expand/collapse on desktop
    - Test dismiss button functionality
    - Test scroll position exactly at 300px threshold
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 7. Implement responsive CTA display logic
  - [x] 7.1 Verify responsive CSS for transformable CTA
    - Ensure `.sticky-cta-transformable` has `display: none` at max-width 768px
    - Verify positioning values match design (right: var(--space-md), top: 20%)
    - _Requirements: 2.5, 2.6_
  
  - [x] 7.2 Verify responsive CSS for mobile FAB
    - Ensure `.mobile-fab` has `display: flex` at max-width 768px
    - Verify positioning values match design (bottom/right: var(--space-lg))
    - Ensure safe area insets are applied
    - _Requirements: 3.1, 3.3, 3.4_
  
  - [x] 7.3 Write property test for responsive CTA display toggle
    - **Property 5: Responsive CTA Display Toggle**
    - **Validates: Requirements 2.6, 3.1, 3.4, 7.2, 7.3**

- [x] 8. Checkpoint - Verify scroll and responsive behavior
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement active section highlighting
  - [x] 9.1 Verify active section detection logic
    - Ensure sections are detected within 200px threshold
    - Ensure topmost section is prioritized when multiple qualify
    - Ensure RAF is used for scroll-based updates
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 9.2 Write property test for active section highlighting priority
    - **Property 8: Active Section Highlighting Priority**
    - **Validates: Requirements 6.1, 6.3**
  
  - [x] 9.3 Write unit test for active section visual styling
    - Test that active links have distinct computed styles
    - _Requirements: 6.4_

- [x] 10. Implement responsive navigation display
  - [x] 10.1 Verify responsive navigation CSS
    - Ensure mobile toggle displays at max-width 768px
    - Ensure desktop links display above 768px
    - Verify breakpoint consistency
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [x] 10.2 Write property test for responsive navigation display toggle
    - **Property 10: Responsive Navigation Display Toggle**
    - **Validates: Requirements 7.4, 7.5**

- [x] 11. Enhance accessibility attributes
  - [x] 11.1 Add ARIA labels to StickyCTA component
    - Add aria-label="Dismiss" to dismiss button
    - Add aria-label="Connect on LinkedIn" to Mobile_FAB
    - _Requirements: 9.1, 9.2_
  
  - [x] 11.2 Enhance Navigation ARIA attributes
    - Ensure mobile toggle has aria-expanded reflecting isOpen state
    - Ensure mobile toggle has aria-controls="mobileNavLinks"
    - Ensure nav has role="navigation" and aria-label="Main navigation"
    - Add aria-hidden="true" to nav-backdrop when displayed
    - _Requirements: 9.3, 9.4, 9.5, 9.6_
  
  - [x] 11.3 Write property test for mobile toggle ARIA state synchronization
    - **Property 9: Mobile Toggle ARIA State Synchronization**
    - **Validates: Requirements 9.3**
  
  - [x] 11.4 Write unit tests for accessibility attributes
    - Test all ARIA labels are present
    - Test aria-expanded updates with state
    - Test aria-controls references correct element
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6_

- [x] 12. Add error handling and cleanup
  - [x] 12.1 Add try-catch to scroll handlers
    - Wrap scroll logic in try-catch blocks
    - Log errors to console for debugging
    - Ensure RAF flag is reset in finally block
    - _Requirements: 8.5_
  
  - [x] 12.2 Add null checks for DOM queries
    - Add null check before calling scrollIntoView
    - Log warning if navigation target not found
    - _Requirements: 5.6_
  
  - [x] 12.3 Ensure body scroll lock cleanup
    - Verify body overflow is restored on unmount
    - Verify body overflow is restored when menu closes
    - _Requirements: 5.4, 5.5_
  
  - [x] 12.4 Write unit tests for error handling
    - Test scroll handler with missing DOM elements
    - Test navigation click with invalid href
    - Test component unmount during animation
    - Test body scroll lock cleanup on unmount

- [x] 13. Add CSS performance optimizations
  - [x] 13.1 Add will-change hints to animated elements
    - Add `will-change: transform` to `.nav` for scroll hiding
    - Add `will-change: transform, box-shadow` to hover elements
    - _Requirements: 8.3_
  
  - [x] 13.2 Verify transform usage for animations
    - Ensure navigation hiding uses `transform: translate3d(0, -100%, 0)`
    - Ensure all animations use transform instead of position
    - _Requirements: 4.3, 8.2_
  
  - [x] 13.3 Write unit test for CSS performance optimizations
    - Test that hidden nav has correct transform value
    - Test that animated elements have will-change property

- [x] 14. Final checkpoint - Integration testing
  - [x] 14.1 Write integration tests for cross-component behavior
    - Test z-index stacking when all components visible
    - Test scroll behavior with both CTA and nav visible
    - Test responsive behavior at exact breakpoint (768px)
    - Test mobile menu with body scroll lock
  
  - [x] 14.2 Manual testing verification
    - Test on desktop: CTA hover, nav scroll hide/show
    - Test on mobile: FAB display, menu open/close, backdrop
    - Test at breakpoint: 768px exact width
    - Test accessibility: keyboard navigation, screen reader
    - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Diagnose and fix fixed positioning issue
  - [x] 15.1 Verify components are rendering in DOM
    - Check that StickyCTA and ScrollNav components are mounting
    - Verify scroll thresholds are being reached (300px for CTA, 400px for ScrollNav)
    - Check browser console for any JavaScript errors
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 15.2 Verify CSS is being applied
    - Check computed styles for `.sticky-cta-transformable` and `.scroll-nav`
    - Verify `position: fixed` is applied
    - Check z-index values are correct (var(--z-sticky-widgets) = 1000)
    - Verify positioning values (top, left, right, bottom) are applied
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6_
  
  - [x] 15.3 Check for CSS conflicts or overrides
    - Search for any CSS rules that might override fixed positioning
    - Check for parent elements with `transform`, `perspective`, or `filter` properties (these create new stacking contexts)
    - Verify no conflicting media queries
    - _Requirements: 10.7_
  
  - [x] 15.4 Test scroll behavior and visibility
    - Manually scroll page to trigger visibility (>300px for CTA, >400px for ScrollNav)
    - Verify `isVisible` state is updating correctly in components
    - Check that components remain fixed while scrolling
    - Test on different browsers (Chrome, Firefox, Safari, Edge)
    - _Requirements: 10.3, 10.7_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and error conditions
- RAF (requestAnimationFrame) optimization is critical for smooth scroll performance
- Z-index custom properties ensure maintainability and consistency
