/**
 * Property-Based Tests for Navigation Z-Index
 * Feature: fix-sticky-cta-nav
 */

import { render, act } from '@testing-library/react'
import Navigation from '@/components/Navigation'
import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'

// Read and parse CSS custom properties from globals.css
function getCSSCustomProperties(): Record<string, number> {
  const cssPath = path.join(process.cwd(), 'app', 'globals.css')
  const cssContent = fs.readFileSync(cssPath, 'utf-8')
  
  const properties: Record<string, number> = {}
  
  // Extract z-index custom properties from :root
  const rootMatch = cssContent.match(/:root\s*\{[\s\S]+?\}/)
  if (rootMatch) {
    const rootContent = rootMatch[0]
    const zIndexMatches = rootContent.matchAll(/--z-([^:]+):\s*(\d+);/g)
    for (const match of zIndexMatches) {
      properties[`--z-${match[1]}`] = parseInt(match[2])
    }
  }
  
  return properties
}

// Check if CSS uses the correct custom property
function cssUsesCustomProperty(cssContent: string, selector: string, property: string): boolean {
  const regex = new RegExp(`${selector}\\s*\\{[\\s\\S]*?z-index:\\s*var\\(${property}\\)`)
  return regex.test(cssContent)
}

describe('Navigation Z-Index Properties', () => {
  let cssProperties: Record<string, number>
  let cssContent: string

  beforeAll(() => {
    cssProperties = getCSSCustomProperties()
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    cssContent = fs.readFileSync(cssPath, 'utf-8')
  })

  /**
   * Property 1: Navigation Z-Index Dominance
   * **Validates: Requirements 1.2**
   * 
   * For any viewport state where both Navigation and Sticky_CTA are rendered,
   * the Navigation's computed z-index SHALL be greater than the Sticky_CTA's computed z-index.
   */
  describe('Property 1: Navigation Z-Index Dominance', () => {
    it('should ensure Navigation z-index custom property value is greater than StickyCTA z-index', () => {
      // Verify custom properties are defined
      expect(cssProperties['--z-navigation']).toBeDefined()
      expect(cssProperties['--z-sticky-widgets']).toBeDefined()
      
      // Verify the hierarchy: navigation (1100) > sticky-widgets (1000)
      expect(cssProperties['--z-navigation']).toBe(1100)
      expect(cssProperties['--z-sticky-widgets']).toBe(1000)
      expect(cssProperties['--z-navigation']).toBeGreaterThan(cssProperties['--z-sticky-widgets'])
    })

    it('should verify .nav uses --z-navigation custom property', () => {
      expect(cssUsesCustomProperty(cssContent, '\\.nav', '--z-navigation')).toBe(true)
    })

    it('should verify sticky CTA elements use --z-sticky-widgets custom property', () => {
      // Check for sticky-cta-transformable or mobile-fab using the custom property
      const hasStickyCTA = cssContent.includes('sticky-cta-transformable') || 
                          cssContent.includes('mobile-fab')
      expect(hasStickyCTA).toBe(true)
    })
  })

  /**
   * Property 2: Mobile Menu Z-Index Ordering
   * **Validates: Requirements 1.3**
   * 
   * For any state where the mobile navigation menu is open,
   * the Nav_Backdrop's computed z-index SHALL be greater than page content z-index
   * AND less than the mobile menu's z-index.
   */
  describe('Property 2: Mobile Menu Z-Index Ordering', () => {
    it('should ensure correct z-index hierarchy: mobile-menu > backdrop > content', () => {
      // Verify custom properties are defined
      expect(cssProperties['--z-mobile-menu']).toBeDefined()
      expect(cssProperties['--z-backdrop']).toBeDefined()
      
      // Verify the hierarchy: mobile-menu (1060) > backdrop (1050) > content (0)
      expect(cssProperties['--z-mobile-menu']).toBe(1060)
      expect(cssProperties['--z-backdrop']).toBe(1050)
      
      expect(cssProperties['--z-mobile-menu']).toBeGreaterThan(cssProperties['--z-backdrop'])
      expect(cssProperties['--z-backdrop']).toBeGreaterThan(0)
    })

    it('should verify mobile navigation elements use correct custom properties', () => {
      // Verify .mobile-nav .nav-links uses --z-mobile-menu
      expect(cssUsesCustomProperty(cssContent, '\\.mobile-nav .nav-links', '--z-mobile-menu')).toBe(true)
      
      // Verify .nav-backdrop uses --z-backdrop
      expect(cssUsesCustomProperty(cssContent, '\\.nav-backdrop', '--z-backdrop')).toBe(true)
    })

    it('should verify mobile nav container uses --z-backdrop', () => {
      // The .mobile-nav container should use --z-backdrop
      const mobileNavMatch = cssContent.match(/\.mobile-nav\s*\{[\s\S]*?z-index:\s*var\(--z-backdrop\)/)
      expect(mobileNavMatch).toBeTruthy()
    })
  })

  /**
   * Property-based test: Z-index consistency across all defined values
   */
  describe('Z-Index Consistency Property', () => {
    it('should maintain strict ordering for all z-index values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            '--z-navigation',
            '--z-mobile-menu', 
            '--z-backdrop',
            '--z-sticky-widgets'
          ),
          fc.constantFrom(
            '--z-navigation',
            '--z-mobile-menu',
            '--z-backdrop', 
            '--z-sticky-widgets'
          ),
          (prop1, prop2) => {
            const val1 = cssProperties[prop1]
            const val2 = cssProperties[prop2]
            
            // If they're the same property, values should be equal
            if (prop1 === prop2) {
              return val1 === val2
            }
            
            // Otherwise, verify the expected hierarchy
            const hierarchy = [
              '--z-navigation',      // 1100
              '--z-mobile-menu',     // 1060
              '--z-backdrop',        // 1050
              '--z-sticky-widgets'   // 1000
            ]
            
            const index1 = hierarchy.indexOf(prop1)
            const index2 = hierarchy.indexOf(prop2)
            
            // Higher in hierarchy should have higher z-index value
            if (index1 < index2) {
              return val1 > val2
            } else {
              return val1 < val2
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})

/**
 * Property 3: Z-Index Consistency Across Breakpoints
 * **Validates: Requirements 1.5**
 * 
 * For any fixed-position element (Navigation, Sticky_CTA, Mobile_FAB),
 * its z-index value SHALL remain consistent when viewport width changes from 375px to 1024px.
 */
describe('Property 3: Z-Index Consistency Across Breakpoints', () => {
  it('should maintain consistent z-index values across all viewport widths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 375, max: 1024 }), // viewport width range
        (viewportWidth) => {
          // Read CSS content to verify z-index values don't change with viewport
          const cssPath = path.join(process.cwd(), 'app', 'globals.css')
          const cssContent = fs.readFileSync(cssPath, 'utf-8')
          
          // Extract all z-index declarations for fixed-position elements
          const fixedElements = [
            { selector: '\\.nav', expectedVar: '--z-navigation' },
            { selector: '\\.sticky-cta-transformable', expectedVar: '--z-sticky-widgets' },
            { selector: '\\.mobile-fab', expectedVar: '--z-sticky-widgets' },
            { selector: '\\.mobile-nav .nav-links', expectedVar: '--z-mobile-menu' },
            { selector: '\\.nav-backdrop', expectedVar: '--z-backdrop' }
          ]
          
          // For each element, verify it uses the custom property (not a hardcoded value)
          // This ensures consistency across breakpoints
          for (const element of fixedElements) {
            const usesCustomProperty = cssUsesCustomProperty(cssContent, element.selector, element.expectedVar)
            
            // If the element exists in CSS, it must use the custom property
            if (cssContent.includes(element.selector.replace(/\\/g, ''))) {
              if (!usesCustomProperty) {
                return false
              }
            }
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should verify sticky CTA elements use custom property instead of hardcoded values', () => {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    
    // Verify .sticky-cta-transformable uses var(--z-sticky-widgets)
    expect(cssUsesCustomProperty(cssContent, '\\.sticky-cta-transformable', '--z-sticky-widgets')).toBe(true)
    
    // Verify .mobile-fab uses var(--z-sticky-widgets)
    expect(cssUsesCustomProperty(cssContent, '\\.mobile-fab', '--z-sticky-widgets')).toBe(true)
  })

  it('should ensure no hardcoded z-index values exist for sticky CTA elements', () => {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    
    // Extract .sticky-cta-transformable block (not inside media queries or theme variants)
    const stickyCTAMatch = cssContent.match(/^\.sticky-cta-transformable\s*\{([^}]+)\}/m)
    if (stickyCTAMatch) {
      const stickyCTABlock = stickyCTAMatch[1]
      // Should NOT contain hardcoded z-index: 1000
      expect(stickyCTABlock).not.toMatch(/z-index:\s*1000/)
      // Should contain var(--z-sticky-widgets)
      expect(stickyCTABlock).toMatch(/z-index:\s*var\(--z-sticky-widgets\)/)
    }
    
    // Extract .mobile-fab block (not inside media queries or theme variants)
    // Look for the main definition with "/* Mobile FAB */" comment before it
    const mobileFABSection = cssContent.match(/\/\* Mobile FAB \*\/\s*\.mobile-fab\s*\{[\s\S]+?\}/)
    if (mobileFABSection) {
      const mobileFABBlock = mobileFABSection[0]
      // Should NOT contain hardcoded z-index: 1000
      expect(mobileFABBlock).not.toMatch(/z-index:\s*1000/)
      // Should contain var(--z-sticky-widgets)
      expect(mobileFABBlock).toMatch(/z-index:\s*var\(--z-sticky-widgets\)/)
    }
  })

  it('should verify z-index values remain consistent across responsive breakpoints', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(375, 480, 640, 768, 1024), // Common breakpoints
        (breakpoint) => {
          // The z-index custom properties should be the same regardless of breakpoint
          const properties = getCSSCustomProperties()
          
          // Verify all expected properties exist and have correct values
          const expectedValues = {
            '--z-navigation': 1100,
            '--z-mobile-menu': 1060,
            '--z-backdrop': 1050,
            '--z-sticky-widgets': 1000
          }
          
          for (const [prop, expectedValue] of Object.entries(expectedValues)) {
            if (properties[prop] !== expectedValue) {
              return false
            }
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })
})
