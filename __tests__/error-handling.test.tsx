/**
 * Unit Tests for Error Handling and Cleanup
 * Feature: fix-sticky-cta-nav
 * Task 12.4: Write unit tests for error handling
 */

import { render, act, waitFor } from '@testing-library/react';
import StickyCTA from '@/components/StickyCTA';
import Navigation from '@/components/Navigation';

// Helper to simulate scroll events
function simulateScroll(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: scrollY,
  });
  window.dispatchEvent(new Event('scroll'));
}

// Helper to wait for RAF to complete
async function waitForRAF() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

describe('StickyCTA Error Handling', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    // Restore scrollY to normal
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('should handle scroll handler errors gracefully', async () => {
    const { unmount } = render(<StickyCTA />);

    // Mock window.scrollY to throw an error
    Object.defineProperty(window, 'scrollY', {
      get() {
        throw new Error('scrollY access error');
      },
      configurable: true,
    });

    // Trigger scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    // Should log error to console
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'StickyCTA scroll handler error:',
      expect.any(Error)
    );

    unmount();
  });

  it('should cleanup RAF on unmount during animation', async () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');
    
    const { unmount } = render(<StickyCTA />);

    // Trigger scroll to start RAF
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Unmount before RAF completes
    unmount();

    // Should have called cancelAnimationFrame
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();

    cancelAnimationFrameSpy.mockRestore();
  });

  it('should reset RAF flag even when error occurs', async () => {
    const { unmount } = render(<StickyCTA />);
    let rafCallCount = 0;
    const originalRAF = window.requestAnimationFrame;
    
    // Mock RAF to count calls
    window.requestAnimationFrame = jest.fn((cb) => {
      rafCallCount++;
      return originalRAF(cb);
    });

    // Mock window.scrollY to throw an error
    Object.defineProperty(window, 'scrollY', {
      get() {
        throw new Error('scrollY access error');
      },
      configurable: true,
    });

    // Trigger first scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    const rafCountAfterFirst = rafCallCount;
    expect(rafCountAfterFirst).toBeGreaterThanOrEqual(1);

    // Trigger second scroll event immediately - should create new RAF if flag was reset
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    // RAF should have been called again (flag was properly reset)
    expect(rafCallCount).toBeGreaterThan(rafCountAfterFirst);

    // Restore
    window.requestAnimationFrame = originalRAF;
    unmount();
  });
});

describe('Navigation Error Handling', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    // Restore scrollY to normal
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('should handle scroll handler errors gracefully', async () => {
    const { unmount } = render(<Navigation />);

    // Mock window.scrollY to throw an error
    Object.defineProperty(window, 'scrollY', {
      get() {
        throw new Error('scrollY access error');
      },
      configurable: true,
    });

    // Trigger scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    // Should log error to console
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Navigation scroll handler error:',
      expect.any(Error)
    );

    unmount();
  });

  it('should handle missing DOM elements in navigation click', async () => {
    const { container, unmount } = render(<Navigation />);

    // Find a navigation link
    const navLink = container.querySelector('a[href="#experience"]') as HTMLAnchorElement;
    expect(navLink).toBeTruthy();

    // Mock querySelector to return null (section doesn't exist)
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn().mockReturnValue(null);

    // Click the navigation link
    act(() => {
      navLink.click();
    });

    await waitForRAF();

    // Should log warning about missing target
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Navigation target not found: #experience'
    );

    // Restore querySelector
    document.querySelector = originalQuerySelector;

    unmount();
  });

  it('should handle navigation click with invalid href', async () => {
    const { container, unmount } = render(<Navigation />);

    // Mock querySelector to return null
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn().mockReturnValue(null);

    // Find a navigation link and simulate click
    const navLink = container.querySelector('a[href="#products"]') as HTMLAnchorElement;
    
    if (navLink) {
      act(() => {
        navLink.click();
      });

      await waitForRAF();

      // Should log warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Navigation target not found: #products'
      );
    }

    // Restore querySelector
    document.querySelector = originalQuerySelector;

    unmount();
  });

  it('should cleanup RAF on unmount during animation', async () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');
    
    const { unmount } = render(<Navigation />);

    // Trigger scroll to start RAF
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Unmount before RAF completes
    unmount();

    // Should have called cancelAnimationFrame
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();

    cancelAnimationFrameSpy.mockRestore();
  });

  it('should reset RAF flag even when error occurs', async () => {
    const { unmount } = render(<Navigation />);
    let rafCallCount = 0;
    const originalRAF = window.requestAnimationFrame;
    
    // Mock RAF to count calls
    window.requestAnimationFrame = jest.fn((cb) => {
      rafCallCount++;
      return originalRAF(cb);
    });

    // Mock window.scrollY to throw an error
    Object.defineProperty(window, 'scrollY', {
      get() {
        throw new Error('scrollY access error');
      },
      configurable: true,
    });

    // Trigger first scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    const rafCountAfterFirst = rafCallCount;
    expect(rafCountAfterFirst).toBeGreaterThanOrEqual(1);

    // Trigger second scroll event immediately - should create new RAF if flag was reset
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitForRAF();

    // RAF should have been called again (flag was properly reset)
    expect(rafCallCount).toBeGreaterThan(rafCountAfterFirst);

    // Restore
    window.requestAnimationFrame = originalRAF;
    unmount();
  });
});

describe('Body Scroll Lock Cleanup', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Ensure cleanup
    document.body.style.overflow = '';
  });

  it('should restore body scroll on unmount when menu is open', async () => {
    const { container, unmount } = render(<Navigation />);

    // Open mobile menu
    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement;
    
    act(() => {
      toggleButton.click();
    });

    await waitForRAF();

    // Verify body scroll is locked
    expect(document.body.style.overflow).toBe('hidden');

    // Unmount component while menu is open
    unmount();

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('');
  });

  it('should restore body scroll when menu closes', async () => {
    const { container, unmount } = render(<Navigation />);

    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement;
    
    // Open menu
    act(() => {
      toggleButton.click();
    });

    await waitForRAF();

    // Verify body scroll is locked
    expect(document.body.style.overflow).toBe('hidden');

    // Close menu
    act(() => {
      toggleButton.click();
    });

    await waitForRAF();

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('');

    unmount();
  });

  it('should handle multiple open/close cycles correctly', async () => {
    const { container, unmount } = render(<Navigation />);

    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement;
    
    // Cycle 1: Open
    act(() => {
      toggleButton.click();
    });
    await waitForRAF();
    expect(document.body.style.overflow).toBe('hidden');

    // Cycle 1: Close
    act(() => {
      toggleButton.click();
    });
    await waitForRAF();
    expect(document.body.style.overflow).toBe('');

    // Cycle 2: Open
    act(() => {
      toggleButton.click();
    });
    await waitForRAF();
    expect(document.body.style.overflow).toBe('hidden');

    // Cycle 2: Close
    act(() => {
      toggleButton.click();
    });
    await waitForRAF();
    expect(document.body.style.overflow).toBe('');

    unmount();
  });

  it('should restore body scroll when clicking backdrop', async () => {
    const { container, unmount } = render(<Navigation />);

    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement;
    
    // Open menu
    act(() => {
      toggleButton.click();
    });

    await waitForRAF();

    // Verify body scroll is locked
    expect(document.body.style.overflow).toBe('hidden');

    // Click backdrop
    const backdrop = container.querySelector('.nav-backdrop') as HTMLElement;
    expect(backdrop).toBeTruthy();

    act(() => {
      backdrop.click();
    });

    await waitForRAF();

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('');

    unmount();
  });

  it('should restore body scroll when clicking navigation link', async () => {
    const { container, unmount } = render(<Navigation />);

    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement;
    
    // Open menu
    act(() => {
      toggleButton.click();
    });

    await waitForRAF();

    // Verify body scroll is locked
    expect(document.body.style.overflow).toBe('hidden');

    // Click a navigation link in mobile menu
    const mobileNav = container.querySelector('.mobile-nav');
    const navLink = mobileNav?.querySelector('a[href="#experience"]') as HTMLAnchorElement;
    expect(navLink).toBeTruthy();

    act(() => {
      navLink.click();
    });

    await waitForRAF();

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('');

    unmount();
  });
});
