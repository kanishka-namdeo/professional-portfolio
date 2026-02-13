# Requirements Document: Fix Sticky CTA and Navigation Issues

## Introduction

This specification addresses critical z-index stacking and scroll behavior issues affecting the sticky CTA (Call-to-Action) and navigation components in the portfolio website. The current implementation has conflicting z-index values and inconsistent behavior across desktop and mobile viewports, resulting in improper element layering and unreliable scroll-based visibility controls.

## Glossary

- **Sticky_CTA**: A fixed-position call-to-action component that appears on the right side of the viewport after scrolling, with hover-to-expand functionality on desktop and a floating action button (FAB) on mobile
- **Navigation**: The main navigation bar fixed at the top of the viewport with auto-hide behavior on scroll down and show on scroll up
- **Z_Index**: CSS property controlling the stacking order of positioned elements along the z-axis
- **Stacking_Context**: A three-dimensional conceptualization of HTML elements along an imaginary z-axis relative to the user
- **Mobile_FAB**: Floating Action Button displayed on mobile devices as an alternative to the desktop transformable CTA
- **Transformable_CTA**: Desktop version of the sticky CTA that expands from a compact icon to show full content on hover
- **Nav_Backdrop**: Semi-transparent overlay displayed behind the mobile navigation menu
- **Scroll_Threshold**: The scroll position (in pixels) that triggers visibility changes for components

## Requirements

### Requirement 1: Z-Index Hierarchy Management

**User Story:** As a user, I want all interactive elements to appear in the correct visual order, so that I can interact with the intended element without obstruction.

#### Acceptance Criteria

1. THE System SHALL establish a consistent z-index hierarchy across all viewport sizes
2. WHEN both Navigation and Sticky_CTA are visible, THE Navigation SHALL appear above the Sticky_CTA
3. WHEN the mobile navigation menu is open, THE Nav_Backdrop SHALL appear below the mobile menu but above all other content
4. THE System SHALL use z-index values that maintain proper stacking order: Navigation (1100) > Nav_Backdrop (1050) > Sticky_CTA (1000) > Scroll_Nav (1000) > Page_Content (auto)
5. THE System SHALL ensure no z-index conflicts exist between desktop and mobile breakpoints

### Requirement 2: Desktop Sticky CTA Functionality

**User Story:** As a desktop user, I want the sticky CTA to appear after scrolling and expand on hover, so that I can easily connect without cluttering the initial viewport.

#### Acceptance Criteria

1. WHEN the user scrolls beyond 300 pixels, THE Sticky_CTA SHALL become visible with a fade-in animation
2. WHEN the user hovers over the Sticky_CTA, THE Transformable_CTA SHALL expand to reveal the full message and action button
3. WHEN the user moves the cursor away from the Sticky_CTA, THE Transformable_CTA SHALL collapse back to the compact icon state
4. WHEN the user clicks the dismiss button, THE Sticky_CTA SHALL hide and remain hidden for the session
5. THE Sticky_CTA SHALL be positioned at right: var(--space-md) and top: 20% of the viewport
6. WHEN the viewport width is 768 pixels or less, THE Transformable_CTA SHALL be hidden

### Requirement 3: Mobile FAB Functionality

**User Story:** As a mobile user, I want a floating action button for quick access to contact, so that I can connect easily on smaller screens.

#### Acceptance Criteria

1. WHEN the viewport width is 768 pixels or less, THE Mobile_FAB SHALL be displayed
2. WHEN the user scrolls beyond 300 pixels on mobile, THE Mobile_FAB SHALL become visible with a pop-in animation
3. THE Mobile_FAB SHALL be positioned at bottom: var(--space-lg) and right: var(--space-lg) with safe area insets
4. WHEN the viewport width is greater than 768 pixels, THE Mobile_FAB SHALL be hidden
5. THE Mobile_FAB SHALL link directly to the LinkedIn profile without requiring expansion

### Requirement 4: Navigation Scroll Behavior

**User Story:** As a user, I want the navigation to hide when scrolling down and reappear when scrolling up, so that I have maximum screen space while reading but can easily access navigation.

#### Acceptance Criteria

1. WHEN the user scrolls down beyond 200 pixels, THE Navigation SHALL slide up and hide with a smooth transform animation
2. WHEN the user scrolls up at any position, THE Navigation SHALL slide down and become visible
3. THE Navigation SHALL use transform: translate3d(0, -100%, 0) for hiding to ensure hardware acceleration
4. THE Navigation SHALL use requestAnimationFrame for scroll event handling to optimize performance
5. WHEN the mobile navigation menu is open, THE Navigation SHALL remain visible regardless of scroll direction

### Requirement 5: Mobile Navigation Menu

**User Story:** As a mobile user, I want to open a slide-in navigation menu, so that I can access all navigation links on smaller screens.

#### Acceptance Criteria

1. WHEN the user clicks the mobile toggle button, THE mobile navigation menu SHALL slide in from the right
2. WHEN the mobile navigation menu is open, THE Nav_Backdrop SHALL be displayed with 50% opacity
3. WHEN the user clicks the Nav_Backdrop, THE mobile navigation menu SHALL close
4. WHEN the mobile navigation menu is open, THE System SHALL prevent body scrolling by setting overflow: hidden
5. WHEN the mobile navigation menu closes, THE System SHALL restore body scrolling
6. WHEN the user clicks a navigation link, THE mobile navigation menu SHALL close and scroll to the target section

### Requirement 6: Active Section Highlighting

**User Story:** As a user, I want to see which section I'm currently viewing highlighted in the navigation, so that I have visual context of my position on the page.

#### Acceptance Criteria

1. WHEN a section enters the viewport within 200 pixels of the top, THE corresponding navigation link SHALL receive the active class
2. THE System SHALL update the active section indicator during scroll events using requestAnimationFrame
3. WHEN multiple sections are within the threshold, THE System SHALL highlight the topmost section's navigation link
4. THE active navigation link SHALL have distinct visual styling to differentiate it from inactive links

### Requirement 7: Responsive Breakpoint Consistency

**User Story:** As a user switching between devices, I want consistent behavior at each screen size, so that the interface behaves predictably.

#### Acceptance Criteria

1. THE System SHALL use 768 pixels as the breakpoint between mobile and desktop layouts
2. WHEN the viewport width is greater than 768 pixels, THE System SHALL display the Transformable_CTA and hide the Mobile_FAB
3. WHEN the viewport width is 768 pixels or less, THE System SHALL display the Mobile_FAB and hide the Transformable_CTA
4. WHEN the viewport width is 768 pixels or less, THE System SHALL display the mobile toggle button
5. WHEN the viewport width is greater than 768 pixels, THE System SHALL display desktop navigation links inline

### Requirement 8: Performance Optimization

**User Story:** As a user, I want smooth scrolling and animations without jank, so that the website feels responsive and professional.

#### Acceptance Criteria

1. THE System SHALL use requestAnimationFrame for all scroll event handlers to prevent excessive reflows
2. THE System SHALL use CSS transform properties instead of position properties for animations
3. THE System SHALL use will-change hints on elements that will be animated
4. THE System SHALL debounce scroll events by checking if a requestAnimationFrame is already pending
5. THE System SHALL clean up event listeners and cancel pending animation frames on component unmount

### Requirement 9: Accessibility Compliance

**User Story:** As a user relying on assistive technology, I want all interactive elements to be properly labeled and keyboard accessible, so that I can navigate the site effectively.

#### Acceptance Criteria

1. THE Sticky_CTA dismiss button SHALL have an aria-label describing its function
2. THE Mobile_FAB SHALL have an aria-label describing its purpose
3. THE mobile toggle button SHALL have aria-expanded attribute reflecting the menu state
4. THE mobile toggle button SHALL have aria-controls attribute referencing the mobile menu ID
5. THE Navigation SHALL have role="navigation" and aria-label="Main navigation"
6. WHEN the Nav_Backdrop is displayed, THE System SHALL set aria-hidden="true" on the backdrop element

### Requirement 10: Fixed Positioning Verification

**User Story:** As a user, I want the sticky CTA and scroll navigation to remain in a fixed position on my screen while I scroll, so that I can easily access these features at any time.

#### Acceptance Criteria

1. THE Sticky_CTA SHALL use `position: fixed` to remain in the same viewport position while scrolling
2. THE Scroll_Nav SHALL use `position: fixed` to remain in the same viewport position while scrolling
3. WHEN the user scrolls beyond the visibility threshold, THE components SHALL appear and remain fixed in their designated positions
4. THE Sticky_CTA SHALL be positioned at `right: var(--space-md)` and `top: 20%` on desktop
5. THE Scroll_Nav SHALL be positioned at `left: var(--space-md)` and `top: 50%` on desktop
6. THE Mobile_FAB SHALL be positioned at `bottom: var(--space-lg)` and `right: var(--space-lg)` on mobile
7. THE fixed positioning SHALL work correctly across all modern browsers
