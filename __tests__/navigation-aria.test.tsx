/**
 * Property-Based and Unit Tests for Navigation ARIA Attributes
 * Feature: fix-sticky-cta-nav
 */

import { render, fireEvent } from '@testing-library/react'
import Navigation from '@/components/Navigation'
import * as fc from 'fast-check'

describe('Navigation ARIA Attributes', () => {
  /**
   * Property 9: Mobile Toggle ARIA State Synchronization
   * **Validates: Requirements 9.3**
   * 
   * For any state change of the mobile menu (isOpen), the mobile toggle button's
   * aria-expanded attribute SHALL match the isOpen boolean value.
   */
  describe('Property 9: Mobile Toggle ARIA State Synchronization', () => {
    it('should synchronize aria-expanded with isOpen state across multiple toggles', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }), // Number of toggle clicks
          (numToggles) => {
            const { container, unmount } = render(<Navigation />)
            
            const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
            expect(mobileToggle).toBeTruthy()
            
            let expectedState = false // Initial state is closed
            
            // Perform multiple toggles and verify aria-expanded matches state
            for (let i = 0; i < numToggles; i++) {
              expectedState = !expectedState
              fireEvent.click(mobileToggle)
              
              const ariaExpanded = mobileToggle.getAttribute('aria-expanded')
              const ariaExpandedBoolean = ariaExpanded === 'true'
              
              // aria-expanded should match the expected state
              if (ariaExpandedBoolean !== expectedState) {
                unmount()
                return false
              }
            }
            
            unmount()
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain aria-expanded synchronization after rapid toggles', () => {
      fc.assert(
        fc.property(
          fc.array(fc.boolean(), { minLength: 5, maxLength: 20 }), // Random sequence of open/close
          (toggleSequence) => {
            const { container, unmount } = render(<Navigation />)
            
            const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
            let currentState = false // Start closed
            
            for (const shouldBeOpen of toggleSequence) {
              // Toggle until we reach the desired state
              if (currentState !== shouldBeOpen) {
                fireEvent.click(mobileToggle)
                currentState = !currentState
              }
              
              const ariaExpanded = mobileToggle.getAttribute('aria-expanded')
              const ariaExpandedBoolean = ariaExpanded === 'true'
              
              if (ariaExpandedBoolean !== currentState) {
                unmount()
                return false
              }
            }
            
            unmount()
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have aria-expanded as string "true" or "false", never boolean', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 5 }), // Number of toggles
          (numToggles) => {
            const { container, unmount } = render(<Navigation />)
            
            const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
            
            for (let i = 0; i <= numToggles; i++) {
              const ariaExpanded = mobileToggle.getAttribute('aria-expanded')
              
              // Must be string "true" or "false", not boolean or other value
              if (ariaExpanded !== 'true' && ariaExpanded !== 'false') {
                unmount()
                return false
              }
              
              if (i < numToggles) {
                fireEvent.click(mobileToggle)
              }
            }
            
            unmount()
            return true
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Unit Tests for Navigation ARIA Attributes
   */
  describe('Unit Tests - Navigation ARIA Attributes', () => {
    it('should have role="navigation" on nav element', () => {
      const { container } = render(<Navigation />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeTruthy()
      expect(nav?.getAttribute('role')).toBe('navigation')
    })

    it('should have aria-label="Main navigation" on nav element', () => {
      const { container } = render(<Navigation />)
      
      const nav = container.querySelector('nav')
      expect(nav).toBeTruthy()
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation')
    })

    it('should have aria-expanded="false" initially on mobile toggle', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle')
      expect(mobileToggle).toBeTruthy()
      expect(mobileToggle?.getAttribute('aria-expanded')).toBe('false')
    })

    it('should have aria-controls="mobileNavLinks" on mobile toggle', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle')
      expect(mobileToggle).toBeTruthy()
      expect(mobileToggle?.getAttribute('aria-controls')).toBe('mobileNavLinks')
    })

    it('should update aria-expanded to "true" when mobile menu opens', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
      expect(mobileToggle.getAttribute('aria-expanded')).toBe('false')
      
      fireEvent.click(mobileToggle)
      
      expect(mobileToggle.getAttribute('aria-expanded')).toBe('true')
    })

    it('should update aria-expanded to "false" when mobile menu closes', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
      
      // Open menu
      fireEvent.click(mobileToggle)
      expect(mobileToggle.getAttribute('aria-expanded')).toBe('true')
      
      // Close menu
      fireEvent.click(mobileToggle)
      expect(mobileToggle.getAttribute('aria-expanded')).toBe('false')
    })

    it('should have descriptive aria-label on mobile toggle when closed', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle')
      const ariaLabel = mobileToggle?.getAttribute('aria-label')
      
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('Open')
      expect(ariaLabel).toContain('navigation menu')
    })

    it('should have descriptive aria-label on mobile toggle when open', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
      
      fireEvent.click(mobileToggle)
      
      const ariaLabel = mobileToggle.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('Close')
      expect(ariaLabel).toContain('navigation menu')
    })

    it('should have aria-hidden="true" on nav-backdrop when displayed', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
      
      // Open menu to display backdrop
      fireEvent.click(mobileToggle)
      
      const backdrop = container.querySelector('.nav-backdrop')
      expect(backdrop).toBeTruthy()
      expect(backdrop?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should not render nav-backdrop when menu is closed', () => {
      const { container } = render(<Navigation />)
      
      const backdrop = container.querySelector('.nav-backdrop')
      expect(backdrop).toBeNull()
    })

    it('should have aria-label on logo link', () => {
      const { container } = render(<Navigation />)
      
      const logoLink = container.querySelector('.nav-logo')
      expect(logoLink).toBeTruthy()
      expect(logoLink?.getAttribute('aria-label')).toBe('Go to homepage')
    })

    it('should have proper role attributes on navigation links', () => {
      const { container } = render(<Navigation />)
      
      const navLinks = container.querySelectorAll('.nav-link')
      expect(navLinks.length).toBeGreaterThan(0)
      
      navLinks.forEach(link => {
        expect(link.getAttribute('role')).toBe('menuitem')
      })
    })

    it('should have role="none" on list items containing nav links', () => {
      const { container } = render(<Navigation />)
      
      const listItems = container.querySelectorAll('.nav-links-desktop li, .nav-links li')
      expect(listItems.length).toBeGreaterThan(0)
      
      listItems.forEach(li => {
        expect(li.getAttribute('role')).toBe('none')
      })
    })

    it('should maintain ARIA attributes after multiple interactions', () => {
      const { container } = render(<Navigation />)
      
      const mobileToggle = container.querySelector('.mobile-toggle') as HTMLButtonElement
      const nav = container.querySelector('nav')
      
      // Verify initial state
      expect(nav?.getAttribute('role')).toBe('navigation')
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation')
      expect(mobileToggle.getAttribute('aria-controls')).toBe('mobileNavLinks')
      
      // Toggle multiple times
      fireEvent.click(mobileToggle)
      fireEvent.click(mobileToggle)
      fireEvent.click(mobileToggle)
      
      // ARIA attributes should remain consistent
      expect(nav?.getAttribute('role')).toBe('navigation')
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation')
      expect(mobileToggle.getAttribute('aria-controls')).toBe('mobileNavLinks')
      expect(mobileToggle.getAttribute('aria-expanded')).toBe('true')
    })
  })
})
