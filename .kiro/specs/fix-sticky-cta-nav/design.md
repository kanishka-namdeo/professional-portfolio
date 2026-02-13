# Design Document: Fix Sticky CTA and Navigation Issues

## Overview

This design addresses z-index stacking conflicts and scroll behavior inconsistencies in the sticky CTA and navigation components. The solution establishes a clear z-index hierarchy, refactors scroll event handling for optimal performance, and ensures consistent responsive behavior across all viewport sizes.

The core issues stem from:
1. Conflicting z-index values (both components use 1000, mobile nav uses 1002/1003)
2. Inconsistent z-index values between desktop and mobile breakpoints
3. Potential scroll event performance issues without proper debouncing

The fix will standardize z-index values, optimize scroll handlers with requestAnimationFrame, and ensure proper component visibility at all breakpoints.

## Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│ Navigation (z-index: 1100)              │
│ - Desktop: inline links + theme toggle  │
│ - Mobile: hamburger menu                │
└─────────────────────────────────────────┘
         ↓ (when mobile menu open)
┌─────────────────────────────────────────┐
│ Nav Backdrop (z-index: 1050)            │
│ - Semi-transparent overlay              │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Mobile Nav Menu (z-index: 1060)         │
│ - Slides in from right                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Sticky CTA (z-index: 1000)              │
│ - Desktop: Transformable CTA (right)    │
│ - Mobile: FAB (bottom-right)            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Scroll Nav (z-index: 1000)              │
│ - Left side navigation (desktop only)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Page Content (z-index: auto)            │
└─────────────────────────────────────────┘
```

### Stacking Context Strategy

The z-index hierarchy follows this principle: **Navigation controls > Overlays > Utility widgets > Content**

- **Layer 1100**: Primary navigation (always accessible)
- **Layer 1060**: Mobile navigation menu (slides over backdrop)
- **Layer 1050**: Modal overlays and backdrops
- **Layer 1000**: Utility widgets (CTA, scroll nav)
- **Layer auto**: Page content

This ensures navigation is always accessible while maintaining proper visual hierarchy.

## Components and Interfaces

### 1. StickyCTA Component

**Purpose**: Display a fixed-position call-to-action that appears after scrolling, with different presentations for desktop and mobile.

**State Management**:
```typescript
interface StickyCTAState {
  isVisible: boolean;      // Controls visibility based on scroll position
  hasDismissed: boolean;   // Tracks if user dismissed the CTA
  isExpanded: boolean;     // Controls hover expansion (desktop only)
}
```

**Scroll Behavior**:
- Visibility threshold: 300px scroll
- Shows when: `scrollY > 300 && !hasDismissed`
- Hides when: `hasDismissed === true`

**Desktop Presentation** (viewport > 768px):
- Transformable CTA: Compact icon that expands on hover
- Position: `fixed; right: var(--space-md); top: 20%`
- Z-index: `1000`
- Hover behavior: Expands to show message and button
- Dismissible: Yes (via X button)

**Mobile Presentation** (viewport ≤ 768px):
- FAB (Floating Action Button): Always visible when scroll threshold met
- Position: `fixed; bottom: var(--space-lg); right: var(--space-lg)`
- Z-index: `1000`
- Hover behavior: None (direct link)
- Dismissible: No

**CSS Changes Required**:
```css
/* Update z-index from 1000 to 1000 (no change, but document it) */
.sticky-cta-transformable {
  z-index: 1000; /* Below navigation (1100) */
}

.mobile-fab {
  z-index: 1000; /* Below navigation (1100) */
}
```

### 2. Navigation Component

**Purpose**: Provide primary site navigation with auto-hide on scroll down and show on scroll up.

**State Management**:
```typescript
interface NavigationState {
  isOpen: boolean;        // Mobile menu open/closed
  activeSection: string;  // Current active section ID
  isHidden: boolean;      // Hide/show based on scroll direction
}

interface ScrollTracking {
  lastScrollY: number;    // Previous scroll position
  rafPending: boolean;    // RequestAnimationFrame pending flag
}
```

**Scroll Behavior**:
- Hide threshold: 200px scroll down
- Logic:
  - Hide: `currentScrollY > lastScrollY && currentScrollY > 200`
  - Show: `currentScrollY < lastScrollY` (scrolling up)
- Exception: Never hide when mobile menu is open

**Desktop Presentation** (viewport > 768px):
- Inline navigation links
- Theme toggle button
- No hamburger menu
- Z-index: `1100`

**Mobile Presentation** (viewport ≤ 768px):
- Hamburger menu button
- Theme toggle button
- Slide-in menu from right
- Backdrop overlay when open
- Z-index: `1100` (nav bar), `1060` (menu), `1050` (backdrop)

**CSS Changes Required**:
```css
/* Desktop navigation - update z-index */
.nav {
  z-index: 1100; /* Above all other fixed elements */
}

/* Mobile navigation - update z-index values */
@media (max-width: 768px) {
  .nav {
    z-index: 1100; /* Consistent with desktop */
  }
  
  .mobile-nav {
    z-index: 1060; /* Above backdrop, below nav bar */
  }
  
  .nav-backdrop {
    z-index: 1050; /* Below menu, above other content */
  }
}
```

### 3. Scroll Event Optimization

**Current Issue**: Scroll events fire frequently and can cause performance issues if not properly debounced.

**Solution**: Use requestAnimationFrame to batch scroll updates and prevent excessive reflows.

**Implementation Pattern**:
```typescript
const rafRef = useRef<number | null>(null);
const lastScrollYRef = useRef(0);

const handleScroll = () => {
  // If RAF already pending, skip this event
  if (rafRef.current !== null) return;

  rafRef.current = requestAnimationFrame(() => {
    const currentScrollY = window.scrollY;
    
    // Perform scroll-based logic here
    // Update state based on scroll position
    
    lastScrollYRef.current = currentScrollY;
    rafRef.current = null; // Reset RAF flag
  });
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  };
}, []);
```

**Benefits**:
- Reduces reflows by batching updates
- Ensures smooth 60fps animations
- Prevents event handler backlog
- Properly cleans up on unmount

### 4. Mobile Menu Body Scroll Lock

**Purpose**: Prevent background scrolling when mobile menu is open.

**Implementation**:
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = ''; // Cleanup
  };
}, [isOpen]);
```

**Behavior**:
- When menu opens: Lock body scroll
- When menu closes: Restore body scroll
- On unmount: Always restore scroll

## Data Models

### Z-Index Constants

Define z-index values as CSS custom properties for maintainability:

```css
:root {
  --z-navigation: 1100;
  --z-mobile-menu: 1060;
  --z-backdrop: 1050;
  --z-sticky-widgets: 1000;
  --z-content: auto;
}
```

**Usage**:
```css
.nav {
  z-index: var(--z-navigation);
}

.mobile-nav {
  z-index: var(--z-mobile-menu);
}

.nav-backdrop {
  z-index: var(--z-backdrop);
}

.sticky-cta-transformable,
.mobile-fab,
.scroll-nav {
  z-index: var(--z-sticky-widgets);
}
```

### Breakpoint Constants

```typescript
const BREAKPOINTS = {
  mobile: 768,        // Max width for mobile layout
  scrollThreshold: {
    cta: 300,         // Scroll distance to show CTA
    navHide: 200,     // Scroll distance to enable nav hiding
    activeSection: 200 // Distance from top to mark section active
  }
} as const;
```

### Component State Types

```typescript
// StickyCTA.tsx
interface StickyCTAState {
  isVisible: boolean;
  hasDismissed: boolean;
  isExpanded: boolean;
}

// Navigation.tsx
interface NavigationState {
  isOpen: boolean;
  activeSection: string;
  isHidden: boolean;
}

interface ScrollRefs {
  lastScrollY: React.MutableRefObject<number>;
  rafPending: React.MutableRefObject<number | null>;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Properties 2.6, 3.1, 3.4, 7.2, 7.3 all test responsive visibility behavior and can be consolidated into comprehensive responsive properties
- Properties 4.1 and 4.2 both test scroll direction behavior and can be combined
- Properties 1.2 and 1.3 both test z-index stacking and can be verified together

The following properties represent the minimal set needed for comprehensive validation:

### Property 1: Navigation Z-Index Dominance
*For any* viewport state where both Navigation and Sticky_CTA are rendered, the Navigation's computed z-index SHALL be greater than the Sticky_CTA's computed z-index.
**Validates: Requirements 1.2**

### Property 2: Mobile Menu Z-Index Ordering
*For any* state where the mobile navigation menu is open, the Nav_Backdrop's computed z-index SHALL be greater than page content z-index AND less than the mobile menu's z-index.
**Validates: Requirements 1.3**

### Property 3: Z-Index Consistency Across Breakpoints
*For any* fixed-position element (Navigation, Sticky_CTA, Mobile_FAB), its z-index value SHALL remain consistent when viewport width changes from 375px to 1024px.
**Validates: Requirements 1.5**

### Property 4: CTA Visibility Based on Scroll Position
*For any* scroll position greater than 300 pixels where the CTA has not been dismissed, the Sticky_CTA component SHALL be visible (isVisible === true).
**Validates: Requirements 2.1, 3.2**

### Property 5: Responsive CTA Display Toggle
*For any* viewport width, exactly one CTA presentation SHALL be displayed: Transformable_CTA when width > 768px, OR Mobile_FAB when width ≤ 768px, but never both simultaneously.
**Validates: Requirements 2.6, 3.1, 3.4, 7.2, 7.3**

### Property 6: Navigation Scroll Direction Behavior
*For any* scroll event where the mobile menu is closed, the Navigation SHALL hide when scrolling down past 200px AND show when scrolling up, regardless of current scroll position.
**Validates: Requirements 4.1, 4.2**

### Property 7: Navigation Visibility During Mobile Menu
*For any* scroll event when the mobile navigation menu is open (isOpen === true), the Navigation SHALL remain visible (isHidden === false).
**Validates: Requirements 4.5**

### Property 8: Active Section Highlighting Priority
*For any* scroll position where multiple sections have their top edge within 200 pixels of the viewport top, only the topmost section's navigation link SHALL have the active class.
**Validates: Requirements 6.1, 6.3**

### Property 9: Mobile Toggle ARIA State Synchronization
*For any* state change of the mobile menu (isOpen), the mobile toggle button's aria-expanded attribute SHALL match the isOpen boolean value.
**Validates: Requirements 9.3**

### Property 10: Responsive Navigation Display Toggle
*For any* viewport width, the appropriate navigation controls SHALL be displayed: mobile toggle button when width ≤ 768px, OR desktop inline links when width > 768px.
**Validates: Requirements 7.4, 7.5**

## Critical CSS Fix: Global Perspective Property

### Issue: Fixed Positioning Broken by Stacking Context

**Problem**: The global CSS rule `*:not(script) { perspective: 1000; }` was creating a new stacking context on every element in the DOM. When an element has a `perspective` property, it creates a new stacking context, which causes `position: fixed` children to be positioned relative to that element instead of the viewport.

**Impact**: Both `StickyCTA` and `ScrollNav` components use `position: fixed` to stay in the same position on screen while scrolling. The global `perspective` property broke this behavior, causing the components to not appear or behave incorrectly.

**Solution**: Removed the `perspective` property from the global `*:not(script)` selector. The `perspective` property should only be applied to specific elements that actually need 3D transforms, not globally.

**CSS Change**:
```css
/* BEFORE - BROKEN */
*:not(script) {
  -webkit-perspective: 1000;
  perspective: 1000;
}

/* AFTER - FIXED */
*:not(script) {
  /* perspective property removed - it creates stacking contexts that break position: fixed */
}
```

**Note**: The `backface-visibility: hidden` property is safe to keep globally as it doesn't create stacking contexts and helps with animation performance.

## Error Handling

### Scroll Event Errors

**Issue**: Scroll event handlers can throw errors if DOM elements are not yet mounted or have been unmounted.

**Solution**:
```typescript
const handleScroll = () => {
  if (rafRef.current !== null) return;

  rafRef.current = requestAnimationFrame(() => {
    try {
      const currentScrollY = window.scrollY;
      // Scroll logic here
    } catch (error) {
      console.error('Scroll handler error:', error);
    } finally {
      rafRef.current = null;
    }
  });
};
```

### Missing DOM Elements

**Issue**: `querySelector` calls may return null if sections are not yet rendered.

**Solution**:
```typescript
const handleNavClick = (href: string) => {
  closeMenu();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.warn(`Navigation target not found: ${href}`);
  }
};
```

### Cleanup on Unmount

**Issue**: Event listeners and RAF callbacks must be cleaned up to prevent memory leaks.

**Solution**:
```typescript
useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
}, [dependencies]);
```

### Body Scroll Lock Cleanup

**Issue**: If component unmounts while mobile menu is open, body scroll may remain locked.

**Solution**:
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  // Always restore on unmount
  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many randomized inputs.

### Unit Testing Focus

Unit tests should focus on:
- Specific user interactions (click dismiss button, hover CTA, toggle mobile menu)
- Edge cases (scroll position exactly at threshold, viewport exactly at breakpoint)
- Error conditions (missing DOM elements, unmount during animation)
- Integration points (body scroll lock, RAF cleanup)

Avoid writing too many unit tests for scenarios that property tests will cover through randomization.

### Property-Based Testing Configuration

**Library Selection**: Use `@fast-check/jest` for TypeScript/React property-based testing

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: fix-sticky-cta-nav, Property {number}: {property_text}`

**Example Property Test Structure**:
```typescript
import fc from 'fast-check';

describe('Property 5: Responsive CTA Display Toggle', () => {
  // Feature: fix-sticky-cta-nav, Property 5: Responsive CTA Display Toggle
  it('should display exactly one CTA presentation at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // viewport width
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          // Render component
          const { container } = render(<StickyCTA />);
          
          // Check visibility
          const transformableCTA = container.querySelector('.sticky-cta-transformable');
          const mobileFAB = container.querySelector('.mobile-fab');
          
          const transformableVisible = transformableCTA && 
            window.getComputedStyle(transformableCTA).display !== 'none';
          const fabVisible = mobileFAB && 
            window.getComputedStyle(mobileFAB).display !== 'none';
          
          // Exactly one should be visible
          return (transformableVisible && !fabVisible) || 
                 (!transformableVisible && fabVisible);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Requirements

**Component Tests**:
- `StickyCTA.test.tsx`: Properties 4, 5, unit tests for hover/dismiss
- `Navigation.test.tsx`: Properties 1, 6, 7, 8, 9, 10, unit tests for menu interactions
- `integration.test.tsx`: Properties 2, 3, cross-component z-index tests

**CSS Tests**:
- Verify z-index custom properties are defined
- Verify computed z-index values match specifications
- Verify responsive breakpoint behavior

**Accessibility Tests**:
- ARIA attributes present and correct
- Keyboard navigation works
- Screen reader announcements appropriate

### Manual Testing Checklist

After automated tests pass, manually verify:
1. Desktop: CTA appears after scroll, expands on hover, dismisses correctly
2. Mobile: FAB appears after scroll, links to LinkedIn
3. Desktop: Navigation hides on scroll down, shows on scroll up
4. Mobile: Menu opens/closes, backdrop works, body scroll locks
5. Both: Active section highlighting updates correctly
6. Both: Z-index stacking is correct (nav above CTA)
7. Both: Theme toggle works in all states
8. Both: Smooth animations without jank
9. Accessibility: Keyboard navigation, screen reader testing
10. Edge cases: Exactly at breakpoint (768px), exactly at scroll threshold (200px, 300px)
