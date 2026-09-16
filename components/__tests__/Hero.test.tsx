// components/__tests__/Hero.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Hero from '../Hero';

const mockScrollTo = jest.fn();
jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  useMotionValue: (v: unknown) => ({ get: () => v, set: jest.fn(), on: jest.fn() }),
  useMotionValueEvent: jest.fn(),
  useTransform: (v: unknown) => v,
  animate: () => ({ stop: jest.fn() }),
  motion: { path: 'path', div: 'div', line: 'line' },
}));
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: mockScrollTo }) }));

describe('Hero', () => {
  it('renders the CTA that follows the trail to the first era', () => {
    render(<Hero />);
    const cta = screen.getByRole('button', { name: /follow the trail/i });
    fireEvent.click(cta);
    expect(mockScrollTo).toHaveBeenCalledWith('#era-origin');
  });
  it('states the role and headline metrics in visible text (5-second rule)', () => {
    render(<Hero />);
    // The full contracted role line (components/AGENTS.md), not just fragments.
    expect(screen.getByText('Product Manager · 9+ years · SaaS, mobility & AI')).toBeInTheDocument();
    expect(screen.getByText(/8× ARR · 70K\+ monthly users · 50\+ locations/)).toBeInTheDocument();
  });
  it('states availability as plain text, with no stat rows or stock placeholders', () => {
    const { container } = render(<Hero />);
    expect(screen.getByText(/open to new roles — dubai \/ remote/i)).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/10x/i);
    expect(container.innerHTML).not.toMatch(/pics?um/i);
  });
  it('hosts the expedition map', () => {
    render(<Hero />);
    expect(screen.getByTestId('expedition-map')).toBeInTheDocument();
  });
});
