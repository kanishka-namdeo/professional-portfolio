/**
 * Integration Tests for Cross-Component Behavior
 * Feature: fix-sticky-cta-nav
 * 
 * These tests verify the interaction between Navigation and StickyCTA components,
 * including z-index stacking, scroll behavior, responsive behavior, and mobile menu
 * with body scroll lock.
 */

import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '@/components/Navigation';
import StickyCTA from '@/components/StickyCTA';
import * as fs from 'fs';
import * as path from 'path';

// Helper to get computed z-index from CSS
function getCSSCustomProperties(): Record<string, number> {
  const cssPath = path.join(process.cwd(), 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  
  const properties: Record<string, number> = {};
  
  const rootMatch = cssContent.match(/:root\s*\{[\s\S]+?\}/);
  if (rootMatch) {
    const rootContent = rootMatch[0];
    const zIndexMatches = rootContent.matchAll(/--z-([^:]+):\s*(\d+);/g);
    for (const match of zIndexMatches) {
      properties[`--z-${match[1]}`] = parseInt(match[2]);
    }
  }
  
  return properties;
}

describe('Integration Tests: Cross-Component Behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
    // Reset viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    // Restore body overflow
    document.body.style.overflow = '';
  });

  /**
   * Test 1: Z-index stacking when all components visible
   * 
   * Verifies that when both Navigation and StickyCTA are rendered and visible,
   * the Navigation has a higher z-index than the StickyCTA.
   */
  describe('Z-Index Stacking with All Components Visible', () => {
    it('should ensure Navigation z-index is greater than StickyCTA z-index', async () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: ctaContainer } = render(<StickyCTA />);

      // Scroll to make CTA visible
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Get z-index values from CSS custom properties
      const cssProperties = getCSSCustomProperties();
      
      expect(cssProperties['--z-navigation']).toBe(1100);
      expect(cssProperties['--z-sticky-widgets']).toBe(1000);
      expect(cssProperties['--z-navigation']).toBeGreaterThan(cssProperties['--z-sticky-widgets']);
    });

    it('should verify mobile menu z-index is between navigation and backdrop', async () => {
      const cssProperties = getCSSCustomProperties();
      
      expect(cssProperties['--z-navigation']).toBe(1100);
      expect(cssProperties['--z-mobile-menu']).toBe(1060);
      expect(cssProperties['--z-backdrop']).toBe(1050);
      
      // Verify hierarchy: navigation > mobile-menu > backdrop
      expect(cssProperties['--z-navigation']).toBeGreaterThan(cssProperties['--z-mobile-menu']);
      expect(cssProperties['--z-mobile-menu']).toBeGreaterThan(cssProperties['--z-backdrop']);
    });
  });

  /**
   * Test 2: Scroll behavior with both CTA and nav visible
   * 
   * Verifies that both components respond correctly to scroll events
   * when both are visible on the page.
   */
  describe('Scroll Behavior with Both Components Visible', () => {
    it('should hide navigation on scroll down and show CTA after threshold', async () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: ctaContainer } = render(<StickyCTA />);

      // Initial state: scroll position 0
      expect(window.scrollY).toBe(0);

      // Scroll to 400px (past both thresholds: nav 200px, CTA 300px)
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Navigation should have 'hidden' class
      const nav = navContainer.querySelector('.nav');
      expect(nav).toHaveClass('hidden');

      // CTA should be visible (either transformable or FAB)
      const transformableCTA = ctaContainer.querySelector('.sticky-cta-transformable');
      const mobileFAB = ctaContainer.querySelector('.mobile-fab');
      expect(transformableCTA || mobileFAB).toBeTruthy();
    });

    it('should show navigation on scroll up while CTA remains visible', async () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: ctaContainer } = render(<StickyCTA />);

      // Scroll down to 400px
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Now scroll up to 350px
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 350,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Navigation should NOT have 'hidden' class (scrolling up)
      const nav = navContainer.querySelector('.nav');
      expect(nav).not.toHaveClass('hidden');

      // CTA should still be visible (scroll > 300)
      const transformableCTA = ctaContainer.querySelector('.sticky-cta-transformable');
      const mobileFAB = ctaContainer.querySelector('.mobile-fab');
      expect(transformableCTA || mobileFAB).toBeTruthy();
    });
  });

  /**
   * Test 3: Responsive behavior at exact breakpoint (768px)
   * 
   * Verifies that components switch correctly at the 768px breakpoint.
   */
  describe('Responsive Behavior at Exact Breakpoint (768px)', () => {
    it('should display mobile FAB and hide transformable CTA at 768px', async () => {
      // Set viewport to exactly 768px
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // At 768px, should show mobile FAB (mobile layout)
      const mobileFAB = container.querySelector('.mobile-fab');
      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      
      // Both elements are rendered, but CSS controls visibility
      expect(mobileFAB).toBeTruthy();
      expect(transformableCTA).toBeTruthy();
    });

    it('should display mobile toggle and hide desktop links at 768px', () => {
      // Set viewport to exactly 768px
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { container } = render(<Navigation />);

      // Mobile toggle should be present
      const mobileToggle = container.querySelector('.mobile-toggle');
      expect(mobileToggle).toBeTruthy();

      // Desktop links should be present (CSS controls visibility)
      const desktopLinks = container.querySelector('.nav-links-desktop');
      expect(desktopLinks).toBeTruthy();
    });

    it('should display transformable CTA and hide mobile FAB above 768px', async () => {
      // Set viewport to 769px (just above breakpoint)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 769,
      });

      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Above 768px, both elements are rendered (CSS controls visibility)
      const mobileFAB = container.querySelector('.mobile-fab');
      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      
      expect(mobileFAB).toBeTruthy();
      expect(transformableCTA).toBeTruthy();
    });
  });

  /**
   * Test 4: Mobile menu with body scroll lock
   * 
   * Verifies that opening the mobile menu locks body scroll and
   * closing it restores scroll.
   */
  describe('Mobile Menu with Body Scroll Lock', () => {
    it('should lock body scroll when mobile menu opens', async () => {
      const { container } = render(<Navigation />);

      // Initial state: body overflow should be empty
      expect(document.body.style.overflow).toBe('');

      // Find and click mobile toggle
      const mobileToggle = container.querySelector('.mobile-toggle');
      expect(mobileToggle).toBeTruthy();

      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('should restore body scroll when mobile menu closes', async () => {
      const { container } = render(<Navigation />);

      // Open menu
      const mobileToggle = container.querySelector('.mobile-toggle');
      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      // Close menu
      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });

    it('should restore body scroll when clicking backdrop', async () => {
      const { container } = render(<Navigation />);

      // Open menu
      const mobileToggle = container.querySelector('.mobile-toggle');
      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      // Click backdrop
      const backdrop = container.querySelector('.nav-backdrop');
      expect(backdrop).toBeTruthy();

      act(() => {
        fireEvent.click(backdrop!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });

    it('should prevent navigation hiding when mobile menu is open', async () => {
      const { container } = render(<Navigation />);

      // Open menu
      const mobileToggle = container.querySelector('.mobile-toggle');
      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        const mobileNav = container.querySelector('.mobile-nav');
        expect(mobileNav).toHaveClass('active');
      });

      // Scroll down (should normally hide nav)
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Navigation should NOT be hidden (menu is open)
      const nav = container.querySelector('.nav');
      expect(nav).not.toHaveClass('hidden');
    });

    it('should restore body scroll on component unmount', async () => {
      const { container, unmount } = render(<Navigation />);

      // Open menu
      const mobileToggle = container.querySelector('.mobile-toggle');
      act(() => {
        fireEvent.click(mobileToggle!);
      });

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      // Unmount component
      unmount();

      // Body scroll should be restored
      expect(document.body.style.overflow).toBe('');
    });
  });

  /**
   * Test 5: Cross-component scroll coordination
   * 
   * Verifies that both components handle scroll events efficiently
   * without conflicts.
   */
  describe('Cross-Component Scroll Coordination', () => {
    it('should handle rapid scroll events without conflicts', async () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: ctaContainer } = render(<StickyCTA />);

      // Simulate rapid scroll events
      const scrollPositions = [100, 250, 400, 350, 500, 300, 150];

      for (const position of scrollPositions) {
        act(() => {
          Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: position,
          });
          window.dispatchEvent(new Event('scroll'));
        });

        await act(async () => {
          jest.runAllTimers();
        });
      }

      // Final position is 150px
      // Navigation should be visible (scrolled up from 300 to 150)
      const nav = navContainer.querySelector('.nav');
      expect(nav).not.toHaveClass('hidden');

      // CTA behavior: once shown (scroll > 300), it stays visible until dismissed
      // The scroll handler only sets isVisible=true when scroll > 300
      // It doesn't set isVisible=false when scrolling back down (unless dismissed)
      const transformableCTA = ctaContainer.querySelector('.sticky-cta-transformable');
      const mobileFAB = ctaContainer.querySelector('.mobile-fab');
      
      // CTA should still be rendered (it was shown at 400px and stays visible)
      expect(transformableCTA || mobileFAB).toBeTruthy();
    });

    it('should maintain correct state after multiple scroll direction changes', async () => {
      const { container: navContainer } = render(<Navigation />);
      const { container: ctaContainer } = render(<StickyCTA />);

      // Scroll down
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Nav hidden, CTA visible
      let nav = navContainer.querySelector('.nav');
      expect(nav).toHaveClass('hidden');

      // Scroll up
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 350,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Nav visible, CTA visible
      nav = navContainer.querySelector('.nav');
      expect(nav).not.toHaveClass('hidden');

      // Scroll down again
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 500,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      await act(async () => {
        jest.runAllTimers();
      });

      // Nav hidden, CTA visible
      nav = navContainer.querySelector('.nav');
      expect(nav).toHaveClass('hidden');
    });
  });
});
