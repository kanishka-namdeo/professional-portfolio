import React from 'react';
import { render } from '@testing-library/react';
import ParticleMesh from '@/components/ParticleMesh';

describe('ParticleMesh Accessibility', () => {
  beforeEach(() => {
    // Mock matchMedia
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
    });
  });

  test('renders Canvas element when reduced motion is not preferred', () => {
    const { container } = render(<ParticleMesh />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  test('returns null when prefers-reduced-motion is set', () => {
    // Override matchMedia for this test
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(<ParticleMesh />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeNull();
  });
});