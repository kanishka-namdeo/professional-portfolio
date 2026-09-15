// scripts/__tests__/contours.test.mjs
import {
  buildContourPaths,
  simplifyOpen,
  simplifyRing,
  formatCoord,
} from '../lib/contours.mjs';

describe('contour generation', () => {
  it('is deterministic for a fixed seed', () => {
    const a = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    const b = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    expect(a).toEqual(b);
  });
  it('returns multiple closed contour paths', () => {
    const paths = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    expect(paths.length).toBeGreaterThan(5);
    for (const d of paths) {
      expect(d).toMatch(/^M/);
      expect(d).not.toContain('NaN');
    }
  });
  it('keeps the path diet: rings are simplified and every subpath closes with Z', () => {
    const paths = buildContourPaths({ width: 1200, height: 800, bands: 25, seed: 'dispatches-2026' });
    for (const d of paths) {
      for (const sub of d.split(/(?=M)/)) {
        expect(sub.endsWith('Z')).toBe(true);
      }
    }
    // The simplification must stay active: a dense wavy polyline collapses hard.
    const dense = Array.from({ length: 400 }, (_, i) => [i, 10 * Math.sin(i / 6)]);
    const simplified = simplifyRing(dense, 0.4);
    expect(simplified.length).toBeLessThan(150);
    expect(simplified.length).toBeGreaterThan(3);
  });
});

describe('simplifyOpen (Douglas-Peucker)', () => {
  it('collapses collinear points to the endpoints', () => {
    const line = [[0, 0], [1, 0], [2, 0], [3, 0], [10, 0]];
    expect(simplifyOpen(line, 0.4)).toEqual([[0, 0], [10, 0]]);
  });
  it('keeps a point that deviates more than the tolerance', () => {
    const bend = [[0, 0], [5, 5], [10, 0]];
    const kept = simplifyOpen(bend, 0.4);
    expect(kept).toContainEqual([5, 5]);
  });
  it('keeps first and last points of an open polyline', () => {
    const zigzag = [[0, 0], [1, 3], [2, -3], [3, 3], [4, 0]];
    const kept = simplifyOpen(zigzag, 100);
    expect(kept[0]).toEqual([0, 0]);
    expect(kept[kept.length - 1]).toEqual([4, 0]);
  });
});

describe('simplifyRing', () => {
  it('drops the duplicate closing vertex and returns ring points', () => {
    const ring = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
    const kept = simplifyRing(ring, 0.4);
    // A square is all corners: every vertex survives, the duplicate does not.
    expect(kept).toEqual([[0, 0], [10, 0], [10, 10], [0, 10]]);
  });
  it('never returns fewer than 3 points for a ring with real curvature', () => {
    // 24 points on a circle; a 1-unit tolerance cannot collapse curvature.
    const ring = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 2 * Math.PI;
      return [50 * Math.cos(a), 50 * Math.sin(a)];
    });
    ring.push(ring[0].slice()); // closed: last == first
    expect(simplifyRing(ring, 1).length).toBeGreaterThanOrEqual(3);
  });
});

describe('formatCoord', () => {
  it('rounds to an integer string', () => {
    expect(formatCoord(836.4)).toBe('836');
    expect(formatCoord(271.6)).toBe('272');
    expect(formatCoord(-3.5)).toBe('-3');
    expect(formatCoord(0)).toBe('0');
  });
});
