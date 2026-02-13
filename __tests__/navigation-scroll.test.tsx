/**
 * Property-Based Tests for Navigation Scroll Behavior
 * Feature: fix-sticky-cta-nav
 */

import { render } from '@testing-library/react'
import Navigation from '@/components/Navigation'
import * as fc from 'fast-check'

// Helper to simulate scroll events
function simulateScroll(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: scrollY,
  })
  window.dispatchEvent(new Event('scroll'))
}

// Helper to wait for RAF to complete
async function waitForRAF() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

describe('Navigation Scroll Behavior Properties', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  /**
   * Property 6: Navigation Scroll Direction Behavior
   * **Validates: Requirements 4.1, 4.2**
   * 
   * For any scroll event where the mobile menu is closed,
   * the Navigation SHALL hide when scrolling down past 200px
   * AND show when scrolling up, regardless of current scroll position.
   */
  describe('Property 6: Navigation Scroll Direction Behavior', () => {
    it('should hide navigation when scrolling down past 200px', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.integer({ min: 201, max: 2000 }), // Start position > 200px
          fc.integer({ min: 50, max: 500 }),   // Scroll down amount
          async (startY, scrollAmount) => {
            const { container, unmount } = render(<Navigation />)
            const nav = container.querySelector('.nav')
            
            // Scroll to start position
            simulateScroll(startY)
            await waitForRAF()
            
            // Scroll down
            simulateScroll(startY + scrollAmount)
            await waitForRAF()
            
            // Navigation should be hidden
            const isHidden = nav?.classList.contains('hidden')
            
            unmount()
            return isHidden === true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should show navigation when scrolling up from any position', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.integer({ min: 500, max: 2000 }), // Start position (high enough to ensure hiding)
          fc.integer({ min: 50, max: 500 }),   // Scroll up amount
          async (startY, scrollAmount) => {
            const { container, unmount } = render(<Navigation />)
            const nav = container.querySelector('.nav')
            
            // Start from 0 and scroll down to startY to ensure nav gets hidden
            simulateScroll(0)
            await waitForRAF()
            
            simulateScroll(startY)
            await waitForRAF()
            
            // Verify it's hidden after scrolling down
            const wasHidden = nav?.classList.contains('hidden')
            
            // Now scroll up
            simulateScroll(startY - scrollAmount)
            await waitForRAF()
            
            // Navigation should be visible
            const isHidden = nav?.classList.contains('hidden')
            
            unmount()
            // Return true if it was hidden before and is now visible
            return wasHidden === true && isHidden === false
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not hide navigation when scrolling down below 200px threshold', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.integer({ min: 0, max: 200 }),    // Position <= 200px
          fc.integer({ min: 10, max: 50 }),    // Small scroll amount
          async (startY, scrollAmount) => {
            const endY = Math.min(startY + scrollAmount, 200)
            
            const { container, unmount } = render(<Navigation />)
            const nav = container.querySelector('.nav')
            
            // Scroll to start position
            simulateScroll(startY)
            await waitForRAF()
            
            // Scroll down but stay below threshold
            simulateScroll(endY)
            await waitForRAF()
            
            // Navigation should remain visible
            const isHidden = nav?.classList.contains('hidden')
            
            unmount()
            return isHidden === false
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 7: Navigation Visibility During Mobile Menu
   * **Validates: Requirements 4.5**
   * 
   * For any scroll event when the mobile navigation menu is open (isOpen === true),
   * the Navigation SHALL remain visible (isHidden === false).
   */
  describe('Property 7: Navigation Visibility During Mobile Menu', () => {
    it('should keep navigation visible when mobile menu is open regardless of scroll direction', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.integer({ min: 0, max: 2000 }),   // Start position
          fc.integer({ min: 201, max: 2000 }), // End position (scrolling down past threshold)
          async (startY, endY) => {
            const { container, unmount } = render(<Navigation />)
            const nav = container.querySelector('.nav')
            const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement
            
            // Open mobile menu
            toggleButton.click()
            await waitForRAF()
            
            // Verify menu is open
            const isOpen = toggleButton.getAttribute('aria-expanded') === 'true'
            if (!isOpen) {
              unmount()
              return false
            }
            
            // Scroll from start to end
            simulateScroll(startY)
            await waitForRAF()
            
            simulateScroll(endY)
            await waitForRAF()
            
            // Navigation should remain visible (not hidden)
            const isHidden = nav?.classList.contains('hidden')
            
            unmount()
            return isHidden === false
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should prevent hiding when scrolling down with mobile menu open', async () => {
      const { container, unmount } = render(<Navigation />)
      const nav = container.querySelector('.nav')
      const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement
      
      // Open mobile menu
      toggleButton.click()
      await waitForRAF()
      
      // Verify menu is open
      expect(toggleButton.getAttribute('aria-expanded')).toBe('true')
      
      // Scroll down past threshold
      simulateScroll(0)
      await waitForRAF()
      
      simulateScroll(500)
      await waitForRAF()
      
      // Navigation should remain visible
      expect(nav?.classList.contains('hidden')).toBe(false)
      
      unmount()
    })
  })
})


/**
 * Unit Tests for Scroll Edge Cases
 */
describe('Navigation Scroll Edge Cases', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  it('should handle scroll position exactly at 200px threshold', async () => {
    const { container, unmount } = render(<Navigation />)
    const nav = container.querySelector('.nav')
    
    // Scroll to exactly 200px
    simulateScroll(200)
    await waitForRAF()
    
    // Navigation should NOT be hidden (threshold is > 200, not >= 200)
    expect(nav?.classList.contains('hidden')).toBe(false)
    
    // Scroll to 201px
    simulateScroll(201)
    await waitForRAF()
    
    // Now it should be hidden
    expect(nav?.classList.contains('hidden')).toBe(true)
    
    unmount()
  })

  it('should handle rapid scroll direction changes', async () => {
    const { container, unmount } = render(<Navigation />)
    const nav = container.querySelector('.nav')
    
    // Start at 0
    simulateScroll(0)
    await waitForRAF()
    
    // Scroll down to 300 (should hide)
    simulateScroll(300)
    await waitForRAF()
    
    // Should be hidden
    expect(nav?.classList.contains('hidden')).toBe(true)
    
    // Scroll up to 250 (should show)
    simulateScroll(250)
    await waitForRAF()
    
    // Should be visible
    expect(nav?.classList.contains('hidden')).toBe(false)
    
    // Scroll down to 400 (should hide again)
    simulateScroll(400)
    await waitForRAF()
    
    // Should be hidden again
    expect(nav?.classList.contains('hidden')).toBe(true)
    
    unmount()
  })

  it('should not hide navigation when scrolling while mobile menu is open', async () => {
    const { container, unmount } = render(<Navigation />)
    const nav = container.querySelector('.nav')
    const toggleButton = container.querySelector('#mobileToggle') as HTMLButtonElement
    
    // Open mobile menu
    toggleButton.click()
    await waitForRAF()
    
    // Verify menu is open
    expect(toggleButton.getAttribute('aria-expanded')).toBe('true')
    
    // Scroll down past threshold
    simulateScroll(0)
    await waitForRAF()
    
    simulateScroll(500)
    await waitForRAF()
    
    // Navigation should remain visible
    expect(nav?.classList.contains('hidden')).toBe(false)
    
    // Close menu
    toggleButton.click()
    await waitForRAF()
    
    // Start from a lower position and scroll down to trigger hiding
    simulateScroll(300)
    await waitForRAF()
    
    simulateScroll(600)
    await waitForRAF()
    
    // Now it should hide
    expect(nav?.classList.contains('hidden')).toBe(true)
    
    unmount()
  })

  it('should show navigation immediately when scrolling up from any position', async () => {
    const { container, unmount } = render(<Navigation />)
    const nav = container.querySelector('.nav')
    
    // Start at 0
    simulateScroll(0)
    await waitForRAF()
    
    // Scroll down to 1000 to hide navigation
    simulateScroll(1000)
    await waitForRAF()
    
    // Verify it's hidden
    expect(nav?.classList.contains('hidden')).toBe(true)
    
    // Scroll up by just 1 pixel
    simulateScroll(999)
    await waitForRAF()
    
    // Should immediately show
    expect(nav?.classList.contains('hidden')).toBe(false)
    
    unmount()
  })

  it('should not hide navigation when scrolling down below 200px', async () => {
    const { container, unmount } = render(<Navigation />)
    const nav = container.querySelector('.nav')
    
    // Scroll to various positions below 200px
    const positions = [0, 50, 100, 150, 199, 200]
    
    for (const pos of positions) {
      simulateScroll(pos)
      await waitForRAF()
      
      // Navigation should always be visible
      expect(nav?.classList.contains('hidden')).toBe(false)
    }
    
    unmount()
  })
})
