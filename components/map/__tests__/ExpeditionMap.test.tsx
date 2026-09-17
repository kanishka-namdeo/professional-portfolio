// components/map/__tests__/ExpeditionMap.test.tsx
import { render, screen } from '@testing-library/react';
import { ExpeditionMap, buildTrailAnchors, trailDasharray, trailDashoffset, trailProgressAt, waypointFractions } from '../ExpeditionMap';
import type { TrailAnchor } from '../ExpeditionMap';

// useMotionValueEvent captures the per-frame change callback so a test can fire
// real frames at the handler (the plain jest.fn() stub never fires it).
const mockChangeHandlers: Array<(v: number) => void> = [];
// useMotionValue(.on) captures raw motion-value subscriptions the same way —
// for the journey instance that is the epsilon-gated stroke writer itself.
// The returned unsubscribe really removes the handler so effect re-runs
// (e.g. when totalLength arrives) leave exactly the live writer captured.
const mockMotionValueHandlers: Array<(v: number) => void> = [];
jest.mock('motion/react', () => ({
  useScroll: () => ({
    scrollYProgress: { on: jest.fn(), get: () => 0 },
    scrollY: { on: jest.fn(), get: () => 0 },
  }),
  useSpring: (v: unknown) => v,
  useReducedMotion: () => false,
  useMotionValue: (v: unknown) => ({
    get: () => v,
    set: jest.fn(),
    on: (_evt: string, cb: (v: number) => void) => {
      mockMotionValueHandlers.push(cb);
      return () => {
        const i = mockMotionValueHandlers.indexOf(cb);
        if (i !== -1) mockMotionValueHandlers.splice(i, 1);
      };
    },
  }),
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

// The sync contract: the trail is a smoothstep-eased piecewise function of
// page scroll anchored to the chapters (with a set-off lead-in), NOT of the
// journey section's viewport transit.
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

  it('eases across segments — dwells at waypoints, glides between (smoothstep)', () => {
    // Segment 1→2 spans 1000→2000 with f 0→0.27. Quarter-scroll sits near the
    // waypoint (dwell), three-quarter near the next: smoothstep(0.25)=0.15625,
    // smoothstep(0.75)=0.84375. The midpoint is an invariant: 0.5 maps to 0.5.
    expect(trailProgressAt(1250, anchors)).toBeCloseTo(0.27 * 0.15625, 5);
    expect(trailProgressAt(1500, anchors)).toBeCloseTo(0.135);
    expect(trailProgressAt(1750, anchors)).toBeCloseTo(0.27 * 0.84375, 5);
    // Chapters 3→4 span 2600→4200: midpoint still halfway in fraction.
    expect(trailProgressAt(3400, anchors)).toBeCloseTo(0.68);
  });

  it('stays monotonic across a dense sweep — no backtracking mid-story', () => {
    let prev = -1;
    for (let y = 800; y <= 5200; y += 50) {
      const v = trailProgressAt(y, anchors);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
    expect(prev).toBe(1);
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

// The drawn line must track the traveller: the stroke uses the classic
// draw-on pair — a constant full-length dash revealed by its offset — so at
// progress f the painted arc is exactly [0, f·L]. (The bug this pins: a
// shrinking dash paired with the same offset paints [2f, 3f) below f=0.5,
// nothing at f=0.5 and [0, 2f−1) above it, desyncing line from marker.)
describe('trail draw stroke', () => {
  // jsdom's getTotalLength stub measures the path at exactly 100.
  const L = 100;

  const strokeWriter = () => mockMotionValueHandlers[mockMotionValueHandlers.length - 1];
  const readDash = () => {
    const path = document.querySelector('path') as SVGPathElement;
    const [d1, d2] = (path.style.strokeDasharray || '').split(/[ ,]+/).map(Number);
    return { d1, d2, offset: Number(path.style.strokeDashoffset) };
  };

  it('paints [0, f·L] at every fraction — the drawn tip rides the traveller', () => {
    mockMotionValueHandlers.length = 0;
    render(<ExpeditionMap activeId={null} />);
    const write = strokeWriter();
    expect(typeof write).toBe('function');
    for (const f of [0, 0.001, 0.035, 0.12, 0.2412, 0.4623, 0.5, 0.527, 0.6985, 0.9, 0.999, 1]) {
      write(f);
      const { d1, d2, offset } = readDash();
      // The dash pattern is constant and full-length — never a zero-length
      // dash (a round linecap would paint it as a dot at the trailhead).
      expect(d1).toBeCloseTo(L, 5);
      expect(d2).toBeCloseTo(L, 5);
      // SVG dash model: pattern position at arc-length s is (s + offset) mod
      // (d1 + d2); s is painted iff that is < d1. Sample mid-cell so the
      // assertion never sits on the reveal tip itself.
      const patternLength = d1 + d2;
      for (let k = 0; k < 200; k++) {
        const s = ((k + 0.5) * L) / 200;
        if (Math.abs(s - f * L) < L / 400) continue; // skip the tip boundary
        const painted = (s + offset) % patternLength < d1;
        expect(painted).toBe(s < f * L);
      }
    }
  });

  it('writes the canonical pair: dasharray `${L} ${L}`, offset (1−f)·L', () => {
    mockMotionValueHandlers.length = 0;
    render(<ExpeditionMap activeId={null} />);
    const write = strokeWriter();
    const path = document.querySelector('path') as SVGPathElement;
    write(0.25);
    expect(path.style.strokeDasharray).toBe(`${L} ${L}`);
    expect(parseFloat(path.style.strokeDashoffset)).toBeCloseTo(75, 5);
    write(1);
    expect(path.style.strokeDasharray).toBe(`${L} ${L}`);
    expect(parseFloat(path.style.strokeDashoffset)).toBeCloseTo(0, 5);
    write(0);
    expect(path.style.strokeDasharray).toBe(`${L} ${L}`);
    expect(parseFloat(path.style.strokeDashoffset)).toBeCloseTo(L, 5);
  });

  it('hides the trail completely at f=0 without a trailhead dot', () => {
    mockMotionValueHandlers.length = 0;
    render(<ExpeditionMap activeId={null} />);
    strokeWriter()(0);
    const { d1, d2, offset } = readDash();
    // Non-zero dash (no round-cap dot) + full offset (nothing on the path).
    expect(d1).toBeGreaterThan(0);
    const patternLength = d1 + d2;
    for (let k = 0; k < 100; k++) {
      const s = ((k + 0.5) * L) / 100;
      expect((s + offset) % patternLength < d1).toBe(false);
    }
  });

  it('skips sub-epsilon stroke writes but always writes at the ends', () => {
    mockMotionValueHandlers.length = 0;
    render(<ExpeditionMap activeId={null} />);
    const write = strokeWriter();
    write(0.5);
    const mid = readDash().offset;
    expect(mid).toBeCloseTo(50, 5);
    // 0.0005 progress ≈ 0.05px of draw head — skipped.
    write(0.5005);
    expect(readDash().offset).toBe(mid);
    // 0.002 progress ≈ 0.2px — repainted.
    write(0.502);
    expect(readDash().offset).not.toBe(mid);
    // The ends always write, even from an epsilon away.
    write(1);
    expect(readDash().offset).toBeCloseTo(0, 5);
    write(0.9995); // sub-epsilon from 1, but not an end — skipped
    expect(readDash().offset).toBeCloseTo(0, 5);
    write(0);
    expect(readDash().offset).toBeCloseTo(L, 5);
  });

  it('hero instance never writes dash styles before its load draw fires', () => {
    mockMotionValueHandlers.length = 0;
    render(<ExpeditionMap priority activeId={null} />);
    const path = document.querySelector('path') as SVGPathElement;
    // Subscription-only until the draw animates: the '0 0' pre-measure
    // sentinel (which would render SOLID) must never reach the DOM.
    expect(path.style.strokeDasharray).toBe('');
    expect(path.style.strokeDashoffset).toBe('');
  });
});

describe('trailDasharray / trailDashoffset', () => {
  it('trailDasharray is the constant full-length pair', () => {
    expect(trailDasharray(118.237)).toBe('118.237 118.237');
    expect(trailDasharray(0)).toBe('0 0');
  });
  it('trailDashoffset reveals [0, f] and clamps the story range', () => {
    expect(trailDashoffset(0, 100)).toBeCloseTo(100, 5);
    expect(trailDashoffset(0.25, 100)).toBeCloseTo(75, 5);
    expect(trailDashoffset(1, 100)).toBeCloseTo(0, 5);
    expect(trailDashoffset(1.5, 100)).toBeCloseTo(0, 5);
    expect(trailDashoffset(-0.5, 100)).toBeCloseTo(100, 5);
  });
});

describe('buildTrailAnchors', () => {
  it('prepends the set-off lead-in: fraction 0, 0.75 viewports before chapter 01', () => {
    const anchors = buildTrailAnchors([1000, 2000, 3000], [0.1, 0.5, 1], 0.75, 800);
    expect(anchors).toEqual([
      { y: 1000 - 600, f: 0 },
      { y: 1000, f: 0.1 },
      { y: 2000, f: 0.5 },
      { y: 3000, f: 1 },
    ]);
  });

  it('returns empty for no chapters (standalone map — no story to sync to)', () => {
    expect(buildTrailAnchors([], [], 0.75, 800)).toEqual([]);
  });

  it('never places the lead-in after the first chapter (short-page clamp)', () => {
    // A lead-in longer than the approach distance just moves the set-off
    // earlier — the anchor stays ordered because only the first y shifts down.
    const anchors = buildTrailAnchors([100], [0.2], 2, 800);
    expect(anchors[0]).toEqual({ y: 100 - 1600, f: 0 });
    expect(anchors[1]).toEqual({ y: 100, f: 0.2 });
    // Fraction stays clamped at the trailhead until the set-off point.
    expect(trailProgressAt(-2000, anchors)).toBe(0);
  });
});
