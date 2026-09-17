// components/journey/__tests__/Journey.test.tsx
import { render, screen } from '@testing-library/react';
import { Journey } from '../Journey';

jest.mock('motion/react', () => ({
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 },
    scrollY: { on: jest.fn(), get: () => 0 },
  }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  useInView: () => true,
  animate: () => ({ stop: jest.fn() }),
  useMotionValue: (v: unknown) => ({ get: () => v, set: jest.fn(), on: jest.fn() }),
  useMotionValueEvent: jest.fn(),
  useTransform: (v: unknown) => v,
  motion: new Proxy(
    {},
    {
      get: (_, tag) =>
        tag === 'path'
          ? 'path'
          : ({ ...rest }: Record<string, unknown>) => (
              <div {...rest} />
            ),
    }
  ),
}));
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: jest.fn() }) }));

describe('Journey', () => {
  it('renders all five era chapters as attached sections', () => {
    const { container } = render(<Journey />);
    const chapters = container.querySelectorAll('section[data-era]');
    expect(chapters).toHaveLength(5);
    chapters.forEach((chapter) => {
      expect(chapter).toBeInTheDocument();
      expect(chapter.id).toMatch(/^era-/);
    });
  });
  it('hosts the expedition map beside the chapters', () => {
    render(<Journey />);
    expect(screen.getByTestId('expedition-map')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /the journey/i })).toBeInTheDocument();
  });
});
