// components/map/__tests__/ExpeditionMap.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpeditionMap } from '../ExpeditionMap';

jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  useMotionValue: (v: unknown) => ({ get: () => v, set: jest.fn(), on: jest.fn() }),
  useMotionValueEvent: jest.fn(),
  useTransform: (v: unknown) => v,
  animate: () => ({ stop: jest.fn() }),
  motion: { path: 'path', g: 'g', circle: 'circle', div: 'div', line: 'line' },
}));
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: jest.fn() }) }));

describe('ExpeditionMap', () => {
  it('renders a waypoint button per era', () => {
    render(<ExpeditionMap activeId={null} />);
    expect(screen.getByRole('button', { name: /travel to Sagar Defence Engineering/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /travel to /i })).toHaveLength(5);
  });
  it('announces the trail to screen readers as a list, not a mystery path', () => {
    render(<ExpeditionMap activeId={null} />);
    expect(screen.getByRole('list', { name: /career waypoints/i })).toBeInTheDocument();
  });
});
