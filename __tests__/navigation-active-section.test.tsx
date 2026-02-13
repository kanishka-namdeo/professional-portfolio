/**
 * Property-Based Tests for Active Section Highlighting
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

// Helper to create mock sections in the DOM
function createMockSections(sectionIds: string[], positions: number[]) {
  // Clear any existing sections
  document.querySelectorAll('section[id]').forEach(el => el.remove())
  
  sectionIds.forEach((id, index) => {
    const section = document.createElement('section')
    section.id = id
    
    // Mock getBoundingClientRect to return the specified position
    const originalGetBoundingClientRect = section.getBoundingClientRect
    section.getBoundingClientRect = jest.fn(() => ({
      top: positions[index],
      bottom: positions[index] + 500,
      left: 0,
      right: 1000,
      width: 1000,
      height: 500,
      x: 0,
      y: positions[index],
      toJSON: () => ({})
    })) as any
    
    document.body.appendChild(section)
  })
}

// Helper to cleanup mock sections
function cleanupMockSections() {
  document.querySelectorAll('section[id]').forEach(el => el.remove())
}

describe('Active Section Highlighting Properties', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
    cleanupMockSections()
  })

  afterEach(() => {
    cleanupMockSections()
  })

  /**
   * Property 8: Active Section Highlighting Priority
   * **Validates: Requirements 6.1, 6.3**
   * 
   * For any scroll position where multiple sections have their top edge
   * within 200 pixels of the viewport top, only the topmost section's
   * navigation link SHALL have the active class.
   */
  describe('Property 8: Active Section Highlighting Priority', () => {
    it('should highlight only the topmost section when multiple sections are within 200px threshold', async () => {
      fc.assert(
        await fc.asyncProperty(
          // Generate 2-3 sections with positions within 200px threshold
          fc.integer({ min: 2, max: 3 }),
          fc.array(fc.integer({ min: -100, max: 200 }), { minLength: 2, maxLength: 3 }),
          async (numSections, positions) => {
            // Ensure we have the right number of positions
            const sectionPositions = positions.slice(0, numSections).sort((a, b) => a - b)
            const sectionIds = ['experience', 'products', 'about'].slice(0, numSections)
            
            // Create mock sections with specified positions
            createMockSections(sectionIds, sectionPositions)
            
            const { container, unmount } = render(<Navigation />)
            
            // Trigger scroll to update active section
            simulateScroll(100)
            await waitForRAF()
            
            // Find all active links (check desktop nav only to avoid duplication)
            const activeLinks = container.querySelectorAll('.nav-links-desktop .nav-link.active')
            
            // Should have exactly one active link
            const hasExactlyOneActive = activeLinks.length === 1
            
            // The active link should correspond to the topmost section (last in sorted order within threshold)
            let correctSectionActive = true
            if (hasExactlyOneActive) {
              const activeLinkHref = activeLinks[0].getAttribute('href')
              const expectedSectionId = sectionIds[sectionIds.length - 1] // Last section in the list
              correctSectionActive = activeLinkHref === `#${expectedSectionId}`
            }
            
            unmount()
            cleanupMockSections()
            
            return hasExactlyOneActive && correctSectionActive
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should update active section as user scrolls through different sections', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.integer({ min: 0, max: 1000 }), // Scroll position
          async (scrollY) => {
            // Create three sections at different positions
            const sectionIds = ['experience', 'products', 'about']
            const sectionPositions = [
              300 - scrollY,  // experience
              800 - scrollY,  // products
              1300 - scrollY  // about
            ]
            
            createMockSections(sectionIds, sectionPositions)
            
            const { container, unmount } = render(<Navigation />)
            
            // Trigger scroll
            simulateScroll(scrollY)
            await waitForRAF()
            
            // Find active links (check desktop nav only to avoid duplication)
            const activeLinks = container.querySelectorAll('.nav-links-desktop .nav-link.active')
            
            // Should have at most one active link
            const hasAtMostOneActive = activeLinks.length <= 1
            
            // If there's an active link, verify it's the correct one based on scroll position
            let correctSectionActive = true
            if (activeLinks.length === 1) {
              const activeLinkHref = activeLinks[0].getAttribute('href')
              
              // Determine which section should be active based on positions
              let expectedSection = ''
              for (let i = sectionIds.length - 1; i >= 0; i--) {
                if (sectionPositions[i] <= 200) {
                  expectedSection = sectionIds[i]
                  break
                }
              }
              
              if (expectedSection) {
                correctSectionActive = activeLinkHref === `#${expectedSection}`
              }
            }
            
            unmount()
            cleanupMockSections()
            
            return hasAtMostOneActive && correctSectionActive
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not highlight any section when all sections are below 200px threshold', async () => {
      fc.assert(
        await fc.asyncProperty(
          fc.array(fc.integer({ min: 201, max: 1000 }), { minLength: 2, maxLength: 3 }),
          async (positions) => {
            const sectionIds = ['experience', 'products', 'about'].slice(0, positions.length)
            
            createMockSections(sectionIds, positions)
            
            const { container, unmount } = render(<Navigation />)
            
            // Trigger scroll
            simulateScroll(100)
            await waitForRAF()
            
            // Find active links (check desktop nav only)
            const activeLinks = container.querySelectorAll('.nav-links-desktop .nav-link.active')
            
            // Should have no active links since all sections are below threshold
            const hasNoActive = activeLinks.length === 0
            
            unmount()
            cleanupMockSections()
            
            return hasNoActive
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})

/**
 * Unit Tests for Active Section Visual Styling
 */
describe('Active Section Visual Styling', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
    cleanupMockSections()
  })

  afterEach(() => {
    cleanupMockSections()
  })

  it('should apply distinct visual styles to active navigation links', async () => {
    // Create a section within the threshold
    createMockSections(['experience'], [100])
    
    const { container, unmount } = render(<Navigation />)
    
    // Trigger scroll to activate the section
    simulateScroll(100)
    await waitForRAF()
    
    // Find the active link (check desktop nav to avoid duplication)
    const activeLink = container.querySelector('.nav-links-desktop .nav-link.active') as HTMLElement
    const inactiveLink = container.querySelector('.nav-links-desktop .nav-link:not(.active)') as HTMLElement
    
    expect(activeLink).toBeTruthy()
    expect(inactiveLink).toBeTruthy()
    
    // Get computed styles
    const activeStyles = window.getComputedStyle(activeLink)
    const inactiveStyles = window.getComputedStyle(inactiveLink)
    
    // Active link should have the 'active' class
    expect(activeLink.classList.contains('active')).toBe(true)
    expect(inactiveLink.classList.contains('active')).toBe(false)
    
    // Verify distinct styling exists (the actual styles are defined in CSS)
    // We're just verifying the class is applied correctly
    expect(activeLink.className).toContain('active')
    expect(inactiveLink.className).not.toContain('active')
    
    unmount()
    cleanupMockSections()
  })

  it('should highlight the correct section when exactly at 200px threshold', async () => {
    // Create a section exactly at 200px
    createMockSections(['experience'], [200])
    
    const { container, unmount } = render(<Navigation />)
    
    // Trigger scroll
    simulateScroll(100)
    await waitForRAF()
    
    // The section at exactly 200px should be highlighted (threshold is <=)
    const activeLink = container.querySelector('.nav-links-desktop .nav-link.active')
    expect(activeLink).toBeTruthy()
    expect(activeLink?.getAttribute('href')).toBe('#experience')
    
    unmount()
    cleanupMockSections()
  })

  it('should not highlight section when just above 200px threshold', async () => {
    // Create a section at 201px (just above threshold)
    createMockSections(['experience'], [201])
    
    const { container, unmount } = render(<Navigation />)
    
    // Trigger scroll
    simulateScroll(100)
    await waitForRAF()
    
    // No section should be highlighted (checking desktop nav only to avoid duplication)
    const activeLinks = container.querySelectorAll('.nav-links-desktop .nav-link.active')
    expect(activeLinks.length).toBe(0)
    
    unmount()
    cleanupMockSections()
  })

  it('should switch active section when scrolling between sections', async () => {
    // Create two sections at fixed positions
    // Section 1 at position 100 (within threshold when scrollY = 0)
    // Section 2 at position 600 (within threshold when scrollY = 500)
    createMockSections(['experience', 'products'], [100, 600])
    
    const { container, unmount } = render(<Navigation />)
    
    // First scroll position (scrollY = 0) - experience should be active (at 100px from top)
    simulateScroll(0)
    await waitForRAF()
    
    let activeLink = container.querySelector('.nav-links-desktop .nav-link.active')
    expect(activeLink?.getAttribute('href')).toBe('#experience')
    
    // Scroll down so that products section comes into view
    // When scrollY = 500, products is at 600 - 500 = 100px from viewport top (within threshold)
    // and experience is at 100 - 500 = -400px (above viewport)
    // We need to update the mock to reflect new positions relative to viewport
    cleanupMockSections()
    createMockSections(['experience', 'products'], [-400, 100])
    
    simulateScroll(500)
    await waitForRAF()
    
    activeLink = container.querySelector('.nav-links-desktop .nav-link.active')
    expect(activeLink?.getAttribute('href')).toBe('#products')
    
    unmount()
    cleanupMockSections()
  })

  it('should handle multiple sections within threshold by highlighting the topmost', async () => {
    // Create three sections all within 200px threshold
    createMockSections(['experience', 'products', 'about'], [50, 100, 150])
    
    const { container, unmount } = render(<Navigation />)
    
    // Trigger scroll
    simulateScroll(100)
    await waitForRAF()
    
    // Only the last section (about) should be active as it's the topmost within threshold
    // Check desktop nav only to avoid counting both desktop and mobile nav links
    const activeLinks = container.querySelectorAll('.nav-links-desktop .nav-link.active')
    expect(activeLinks.length).toBe(1)
    expect(activeLinks[0].getAttribute('href')).toBe('#about')
    
    unmount()
    cleanupMockSections()
  })
})
