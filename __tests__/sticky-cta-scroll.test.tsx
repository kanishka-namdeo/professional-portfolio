import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { test, fc } from '@fast-check/jest';
import StickyCTA from '@/components/StickyCTA';

describe('StickyCTA Scroll Behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Feature: fix-sticky-cta-nav, Property 4: CTA Visibility Based on Scroll Position
  test.prop([
    fc.integer({ min: 0, max: 5000 }), // scroll position
  ])('Property 4: CTA should be visible when scrollY > 300 and not dismissed', async (scrollPosition) => {
    const { container } = render(<StickyCTA />);

    // Simulate scroll
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: scrollPosition,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Wait for RAF to complete
    await act(async () => {
      jest.runAllTimers();
    });

    const transformableCTA = container.querySelector('.sticky-cta-transformable');
    const mobileFAB = container.querySelector('.mobile-fab');

    if (scrollPosition > 300) {
      // At least one CTA element should be rendered when scroll > 300
      expect(transformableCTA || mobileFAB).toBeTruthy();
    } else {
      // Both should be null when scroll <= 300
      expect(transformableCTA).toBeNull();
      expect(mobileFAB).toBeNull();
    }
  });
});
