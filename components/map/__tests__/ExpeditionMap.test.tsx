// components/map/__tests__/ExpeditionMap.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpeditionMap } from '../ExpeditionMap';

// useMotionValueEvent captures the per-frame change callback so a test can fire
// real frames at the handler (the plain jest.fn() stub never fires it).
const mockChangeHandlers: Array<(v: number) => void> = [];
jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  useMotionValue: (v: unknown) => ({ get: () => v, set: jest.fn(), on: jest.fn() }),
  useMotionValueEvent: (_mv: unknown, _evt: string, cb: (v: number) => void) => {
    mockChangeHandlers.push(cb);
  },
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

  // Pins the hot-path contract: the trail is pre-sampled once per mount and the
  // per-frame driver handler interpolates between cached samples — zero SVG
  // geometry calls per frame — positioning the traveller via one transform.
  it('pre-samples the trail once and interpolates frames with no per-frame geometry calls', () => {
    mockChangeHandlers.length = 0;
    // jsdom's stub lives on SVGElement.prototype (jest.setup.cjs); the typed
    // lib only exposes getPointAtLength on SVGGeometryElement, so cast.
    const geometryProto = window.SVGElement.prototype as unknown as {
      getPointAtLength: (len: number) => { x: number; y: number };
    };
    const getPointAtLength = jest.spyOn(geometryProto, 'getPointAtLength');
    render(<ExpeditionMap activeId={null} />);
    // Mount samples the trail exactly once (200 points via the jsdom stub).
    expect(getPointAtLength).toHaveBeenCalledTimes(200);
    const fire = mockChangeHandlers[0];
    expect(typeof fire).toBe('function');

    fire(0.5);
    fire(0.75);
    // Frames interpolate from the cache: still exactly the 200 mount samples.
    expect(getPointAtLength).toHaveBeenCalledTimes(200);
    const marker = document.querySelector('span.z-10') as HTMLElement;
    expect(marker.style.opacity).toBe('1');
    expect(marker.style.transform).toMatch(/^translate\(calc\(/);
    getPointAtLength.mockRestore();
  });
});
