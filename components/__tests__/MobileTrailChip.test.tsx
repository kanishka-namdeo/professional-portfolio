// components/__tests__/MobileTrailChip.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MobileTrailChip } from '../MobileTrailChip';
import { OPEN_PALETTE_EVENT } from '../WaypointPalette';

const mockUseMotionValueEvent = jest.fn();
jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  // Deferred through an arrow: jest.mock factories are hoisted above the
  // const's initializer, so the reference must wait until call time.
  useMotionValueEvent: (...args: unknown[]) => mockUseMotionValueEvent(...args),
}));

// Controllable active-era stand-in (jsdom's IntersectionObserver stub never
// fires, so the real hook would always report null).
let mockActiveId: string | null = null;
jest.mock('@/hooks/useActiveEra', () => ({
  useActiveEra: () => mockActiveId,
}));

describe('MobileTrailChip', () => {
  beforeEach(() => {
    mockUseMotionValueEvent.mockClear();
    mockActiveId = null;
  });

  function fireProgress(value: number) {
    // The chip registers (motionValue, event, handler); invoke the handler
    // the way motion would on a scroll change.
    const call = mockUseMotionValueEvent.mock.calls.find(([, event]) => event === 'change');
    expect(call).toBeDefined();
    act(() => {
      (call as unknown as [unknown, string, (v: number) => void])[2](value);
    });
  }

  it('renders the current era readout and whole-percent progress', () => {
    mockActiveId = 'language'; // 03 · Medulla.AI
    render(<MobileTrailChip />);
    const chip = screen.getByRole('button', { name: /open waypoint jumper/i });
    expect(chip).toHaveTextContent('03 · Medulla.AI');
    fireProgress(0.412);
    expect(chip).toHaveTextContent('41%');
    // Label in Name (WCAG 2.5.3): the accessible name carries the exact
    // visible readout so speech input ("click 03 · Medulla.AI · 41%") matches.
    expect(chip).toHaveAccessibleName('Open waypoint jumper — 03 · Medulla.AI · 41%');
  });

  it('reads "en route" before the first waypoint is reached', () => {
    render(<MobileTrailChip />);
    const chip = screen.getByRole('button', { name: /open waypoint jumper/i });
    expect(chip).toHaveTextContent('en route');
    expect(chip).toHaveAccessibleName('Open waypoint jumper — en route');
  });

  it('opens the palette by dispatching the same event the rail uses', () => {
    render(<MobileTrailChip />);
    const opened = jest.fn();
    window.addEventListener(OPEN_PALETTE_EVENT, opened);
    try {
      fireEvent.click(screen.getByRole('button', { name: /open waypoint jumper/i }));
      expect(opened).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(OPEN_PALETTE_EVENT, opened);
    }
  });

  it('is a ≥44px tap target and stays below the palette overlay', () => {
    render(<MobileTrailChip />);
    const chip = screen.getByRole('button', { name: /open waypoint jumper/i });
    expect(chip.className).toContain('min-h-[44px]');
    // Palette overlay is z-[70]; the chip must sit under it.
    expect(chip.className).toContain('z-40');
  });
});
