// components/__tests__/Hero.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Hero from '../Hero';

const mockScrollTo = jest.fn();
jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  motion: { path: 'path' },
}));
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: mockScrollTo }) }));

describe('Hero', () => {
  it('renders the CTA that follows the trail to the first era', () => {
    render(<Hero />);
    const cta = screen.getByRole('button', { name: /follow the trail/i });
    fireEvent.click(cta);
    expect(mockScrollTo).toHaveBeenCalledWith('#era-origin');
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
