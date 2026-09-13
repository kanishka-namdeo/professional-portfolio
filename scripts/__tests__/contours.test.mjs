// scripts/__tests__/contours.test.mjs
import { buildContourPaths } from '../lib/contours.mjs';

describe('contour generation', () => {
  it('is deterministic for a fixed seed', () => {
    const a = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    const b = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    expect(a).toEqual(b);
  });
  it('returns multiple closed contour paths', () => {
    const paths = buildContourPaths({ width: 300, height: 200, bands: 12, seed: 'dispatches' });
    expect(paths.length).toBeGreaterThan(5);
    for (const d of paths) expect(d).toMatch(/^M/);
  });
});
