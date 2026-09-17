// components/__tests__/TrailProgress.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TrailProgress } from '../TrailProgress';
import { eras } from '@/data/journey';

const mockScrollTo = jest.fn();
jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v: unknown) => v,
  // The rail fill bypasses the spring under reduced motion; jsdom default is off.
  useReducedMotion: () => false,
  useMotionValueEvent: jest.fn(),
  motion: { path: 'path', line: 'line' },
}));
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: mockScrollTo }) }));
// The rail imports OPEN_PALETTE_EVENT from the palette; keep that module light
// and side-effect free in this test by stubbing the event name.
jest.mock('../WaypointPalette', () => ({ OPEN_PALETTE_EVENT: 'open-waypoint-palette' }));

describe('TrailProgress', () => {
  it('renders the mini map and one number button per era', () => {
    render(<TrailProgress />);
    const nav = screen.getByRole('navigation', { name: /trail progress/i });
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('svg')).toBeInTheDocument();
    eras.forEach((era) => {
      const button = screen.getByRole('button', { name: `Travel to ${era.company} (${era.number})` });
      expect(button).toHaveTextContent(era.number);
    });
    expect(screen.getAllByRole('button', { name: /^Travel to / })).toHaveLength(5);
    expect(screen.getByRole('button', { name: /open the waypoint jumper/i })).toBeInTheDocument();
  });
  it('scrolls to the matching era when a waypoint number is clicked', () => {
    render(<TrailProgress />);
    fireEvent.click(screen.getByRole('button', { name: `Travel to ${eras[1].company} (${eras[1].number})` }));
    // offset -80 matches the anchor-click offset configured in layout.tsx.
    expect(mockScrollTo).toHaveBeenCalledWith('#era-logistics', { offset: -80 });
  });
});
