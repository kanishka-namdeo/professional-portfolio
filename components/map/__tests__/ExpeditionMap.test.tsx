// components/map/__tests__/ExpeditionMap.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpeditionMap, trailProgressAt, waypointFractions } from '../ExpeditionMap';
import type { TrailAnchor } from '../ExpeditionMap';

// useMotionValueEvent captures the per-frame change callback so a test can fire
// real frames at the handler (the plain jest.fn() stub never fires it).
const mockChangeHandlers: Array<(v: number) => void> = [];
jest.mock('motion/react', () => ({
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 },
    scrollY: { on: jest.fn(), get: () => 0 },
  }),
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

// The sync contract: the trail is a piecewise-linear function of page scroll
// anchored to the chapters, NOT of the journey section's viewport transit.
describe('trail sync mapping', () => {
  // Realistic shape: uneven chapter heights (press ledgers make chapters 1 and
  // 4 tall) and uneven waypoint spacing along the path.
  const anchors: TrailAnchor[] = [
    { y: 1000, f: 0 },
    { y: 2000, f: 0.27 },
    { y: 2600, f: 0.55 },
    { y: 4200, f: 0.81 },
    { y: 5000, f: 1 },
  ];

  it('waits at the trailhead until the first chapter centres', () => {
    expect(trailProgressAt(0, anchors)).toBe(0);
    expect(trailProgressAt(999, anchors)).toBe(0);
    expect(trailProgressAt(1000, anchors)).toBe(0);
  });

  it('lands exactly on each waypoint when its chapter centres', () => {
    expect(trailProgressAt(2000, anchors)).toBeCloseTo(0.27);
    expect(trailProgressAt(2600, anchors)).toBeCloseTo(0.55);
    expect(trailProgressAt(4200, anchors)).toBeCloseTo(0.81);
    expect(trailProgressAt(5000, anchors)).toBe(1);
  });

  it('interpolates between chapters proportionally to scroll', () => {
    // Halfway between chapters 1 and 2 in scroll → halfway in trail fraction.
    expect(trailProgressAt(1500, anchors)).toBeCloseTo(0.135);
    // Chapters 3→4 span 2600→4200; at 3400 the trail is halfway across segment 3→4.
    expect(trailProgressAt(3400, anchors)).toBeCloseTo(0.55 + (0.81 - 0.55) * 0.5);
  });

  it('rests at the destination once the last chapter has centred', () => {
    expect(trailProgressAt(9000, anchors)).toBe(1);
  });

  it('holds 0 outside the story (no anchors — e.g. the standalone map)', () => {
    expect(trailProgressAt(1234, [])).toBe(0);
  });

  it('never divides by zero when consecutive anchors share a scroll position', () => {
    const degenerate: TrailAnchor[] = [
      { y: 100, f: 0 },
      { y: 100, f: 0.5 },
      { y: 300, f: 1 },
    ];
    // At/below the first anchor the trailhead clamp wins.
    expect(trailProgressAt(100, degenerate)).toBe(0);
    // Just past the shared position it must stay finite (no 0-px division).
    expect(Number.isFinite(trailProgressAt(100.5, degenerate))).toBe(true);
    // Beyond the shared anchor it interpolates from f=0.5 toward the end.
    expect(trailProgressAt(200, degenerate)).toBeCloseTo(0.75);
  });
});

describe('waypointFractions', () => {
  it('places each waypoint at its sample index along the trail', () => {
    // A polyline through the five era coords, four samples per segment plus
    // the endpoint: waypoints land on indices 0, 4, 8, 12, 16 of 17.
    const waypoints = [
      { x: 7, y: 91 },
      { x: 26, y: 73 },
      { x: 46, y: 56 },
      { x: 66, y: 37 },
      { x: 91, y: 12 },
    ];
    const samples: { x: number; y: number }[] = [];
    for (let s = 0; s < waypoints.length - 1; s++) {
      const a = waypoints[s];
      const b = waypoints[s + 1];
      for (let k = 0; k < 4; k++) {
        const t = k / 4;
        samples.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    samples.push({ ...waypoints[waypoints.length - 1] });
    const fractions = waypointFractions(samples);
    expect(fractions).toHaveLength(5);
    expect(fractions[0]).toBe(0);
    expect(fractions[1]).toBeCloseTo(4 / 16);
    expect(fractions[2]).toBeCloseTo(8 / 16);
    expect(fractions[3]).toBeCloseTo(12 / 16);
    expect(fractions[4]).toBe(1);
  });

  it('degrades to even fractions without samples (jsdom / no geometry)', () => {
    expect(waypointFractions([])).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });
});
