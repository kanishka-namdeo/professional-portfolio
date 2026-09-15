require('@testing-library/jest-dom')

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// lenis ships ESM-only and next/jest (Next 16.3.5+) no longer transpiles it for
// jsdom. Unit tests never exercise real scrolling, so stub the React binding.
jest.mock('lenis/react', () => ({
  ReactLenis: () => null,
  useLenis: () => null,
}))

// jsdom does not implement SVGGeometryElement geometry APIs
if (typeof window !== 'undefined' && window.SVGElement && !window.SVGElement.prototype.getTotalLength) {
  window.SVGElement.prototype.getTotalLength = function () {
    return 100
  }
  window.SVGElement.prototype.getPointAtLength = function (len) {
    const t = Math.max(0, Math.min(1, len / 100))
    return { x: t * 100, y: t * 100 }
  }
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 0)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}
