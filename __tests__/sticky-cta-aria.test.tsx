/**
 * Unit Tests for StickyCTA ARIA Attributes
 * Feature: fix-sticky-cta-nav
 */

import { render, fireEvent, waitFor } from '@testing-library/react'
import StickyCTA from '@/components/StickyCTA'
import { act } from 'react'

describe('StickyCTA ARIA Attributes', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  describe('Unit Tests - Dismiss Button ARIA', () => {
    it('should have aria-label="Dismiss" on dismiss button', async () => {
      const { container } = render(<StickyCTA />)
      
      // Scroll to make CTA visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const dismissButton = container.querySelector('.cta-dismiss')
        expect(dismissButton).toBeTruthy()
        expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss')
      })
    })

    it('should maintain aria-label after hover interactions', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const ctaContainer = container.querySelector('.sticky-cta-transformable') as HTMLElement
        const dismissButton = container.querySelector('.cta-dismiss')
        
        expect(ctaContainer).toBeTruthy()
        expect(dismissButton).toBeTruthy()
        
        // Hover over CTA
        fireEvent.mouseEnter(ctaContainer)
        expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss')
        
        // Hover out
        fireEvent.mouseLeave(ctaContainer)
        expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss')
      })
    })

    it('should have accessible button element for dismiss', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const dismissButton = container.querySelector('.cta-dismiss')
        expect(dismissButton?.tagName).toBe('BUTTON')
      })
    })

    it('should be keyboard accessible for dismiss button', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const dismissButton = container.querySelector('.cta-dismiss') as HTMLButtonElement
        expect(dismissButton.tabIndex).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Unit Tests - Mobile FAB ARIA', () => {
    beforeEach(() => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
    })

    it('should have aria-label="Connect on LinkedIn" on Mobile FAB', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const mobileFAB = container.querySelector('.mobile-fab')
        expect(mobileFAB).toBeTruthy()
        expect(mobileFAB?.getAttribute('aria-label')).toBe('Connect on LinkedIn')
      })
    })

    it('should be a link element with proper attributes', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const mobileFAB = container.querySelector('.mobile-fab')
        expect(mobileFAB?.tagName).toBe('A')
        expect(mobileFAB?.getAttribute('href')).toBe('https://www.linkedin.com/in/kanishkanamdeo/')
        expect(mobileFAB?.getAttribute('target')).toBe('_blank')
        expect(mobileFAB?.getAttribute('rel')).toBe('noopener noreferrer')
      })
    })
  })

  describe('Unit Tests - Desktop CTA Link ARIA', () => {
    beforeEach(() => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
    })

    it('should have proper link attributes on CTA button', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const ctaButton = container.querySelector('.cta-button')
        expect(ctaButton?.tagName).toBe('A')
        expect(ctaButton?.getAttribute('href')).toBe('https://www.linkedin.com/in/kanishkanamdeo/')
        expect(ctaButton?.getAttribute('target')).toBe('_blank')
        expect(ctaButton?.getAttribute('rel')).toBe('noopener noreferrer')
      })
    })
  })

  describe('Unit Tests - Component Visibility and ARIA', () => {
    it('should not render ARIA attributes when component is not visible', async () => {
      const { container } = render(<StickyCTA />)
      
      // Don't scroll - component should not be visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      const dismissButton = container.querySelector('.cta-dismiss')
      const mobileFAB = container.querySelector('.mobile-fab')
      
      // Component should not be rendered
      expect(dismissButton).toBeNull()
      expect(mobileFAB).toBeNull()
    })

    it('should render ARIA attributes when component becomes visible', async () => {
      const { container } = render(<StickyCTA />)
      
      // Scroll to make visible
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const dismissButton = container.querySelector('.cta-dismiss')
        expect(dismissButton).toBeTruthy()
        expect(dismissButton?.getAttribute('aria-label')).toBe('Dismiss')
      })
    })

    it('should maintain ARIA attributes after dismiss', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const dismissButton = container.querySelector('.cta-dismiss') as HTMLButtonElement
        expect(dismissButton).toBeTruthy()
        expect(dismissButton.getAttribute('aria-label')).toBe('Dismiss')
        
        // Dismiss the CTA
        fireEvent.click(dismissButton)
      })
      
      // Component should be removed from DOM after dismiss
      await waitFor(() => {
        const dismissButtonAfter = container.querySelector('.cta-dismiss')
        expect(dismissButtonAfter).toBeNull()
      })
    })
  })

  describe('Unit Tests - External Link Security', () => {
    it('should have rel="noopener noreferrer" on all external links', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const externalLinks = container.querySelectorAll('a[target="_blank"]')
        expect(externalLinks.length).toBeGreaterThan(0)
        
        externalLinks.forEach(link => {
          const rel = link.getAttribute('rel')
          expect(rel).toContain('noopener')
          expect(rel).toContain('noreferrer')
        })
      })
    })

    it('should open external links in new tab', async () => {
      const { container } = render(<StickyCTA />)
      
      await act(async () => {
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
        window.dispatchEvent(new Event('scroll'))
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      
      await waitFor(() => {
        const externalLinks = container.querySelectorAll('a[href*="linkedin.com"]')
        expect(externalLinks.length).toBeGreaterThan(0)
        
        externalLinks.forEach(link => {
          expect(link.getAttribute('target')).toBe('_blank')
        })
      })
    })
  })
})
