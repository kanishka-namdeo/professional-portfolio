import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import StickyCTA from '@/components/StickyCTA';

describe('StickyCTA Interactions', () => {
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

  describe('Hover expand/collapse on desktop', () => {
    it('should expand CTA on mouse enter', async () => {
      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      expect(transformableCTA).toBeTruthy();

      // Hover over CTA
      act(() => {
        fireEvent.mouseEnter(transformableCTA!);
      });

      expect(transformableCTA).toHaveClass('expanded');
    });

    it('should collapse CTA on mouse leave', async () => {
      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      
      // Hover and then leave
      act(() => {
        fireEvent.mouseEnter(transformableCTA!);
      });
      expect(transformableCTA).toHaveClass('expanded');

      act(() => {
        fireEvent.mouseLeave(transformableCTA!);
      });
      expect(transformableCTA).not.toHaveClass('expanded');
    });
  });

  describe('Dismiss button functionality', () => {
    it('should hide CTA when dismiss button is clicked', async () => {
      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      let transformableCTA = container.querySelector('.sticky-cta-transformable');
      expect(transformableCTA).toBeTruthy();

      // Expand to access dismiss button
      act(() => {
        fireEvent.mouseEnter(transformableCTA!);
      });

      const dismissButton = container.querySelector('.cta-dismiss');
      expect(dismissButton).toBeTruthy();

      // Click dismiss
      act(() => {
        fireEvent.click(dismissButton!);
      });

      // CTA should be hidden
      transformableCTA = container.querySelector('.sticky-cta-transformable');
      expect(transformableCTA).toBeNull();
    });

    it('should keep CTA hidden after dismiss even when scrolling', async () => {
      const { container } = render(<StickyCTA />);

      // Scroll to make CTA visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 400,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      // Dismiss CTA
      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      act(() => {
        fireEvent.mouseEnter(transformableCTA!);
      });
      const dismissButton = container.querySelector('.cta-dismiss');
      act(() => {
        fireEvent.click(dismissButton!);
      });

      // Scroll more
      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 1000,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      // CTA should still be hidden
      expect(container.querySelector('.sticky-cta-transformable')).toBeNull();
      expect(container.querySelector('.mobile-fab')).toBeNull();
    });
  });

  describe('Scroll position threshold (300px)', () => {
    it('should not show CTA at exactly 300px', async () => {
      const { container } = render(<StickyCTA />);

      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 300,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      expect(container.querySelector('.sticky-cta-transformable')).toBeNull();
      expect(container.querySelector('.mobile-fab')).toBeNull();
    });

    it('should show CTA at 301px', async () => {
      const { container } = render(<StickyCTA />);

      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 301,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      const transformableCTA = container.querySelector('.sticky-cta-transformable');
      const mobileFAB = container.querySelector('.mobile-fab');
      
      // At least one should be visible
      expect(transformableCTA || mobileFAB).toBeTruthy();
    });

    it('should not show CTA at 299px', async () => {
      const { container } = render(<StickyCTA />);

      await act(async () => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 299,
        });
        window.dispatchEvent(new Event('scroll'));
        jest.runAllTimers();
      });

      expect(container.querySelector('.sticky-cta-transformable')).toBeNull();
      expect(container.querySelector('.mobile-fab')).toBeNull();
    });
  });
});
