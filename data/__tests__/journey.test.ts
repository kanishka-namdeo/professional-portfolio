// data/__tests__/journey.test.ts
import { eras } from '../journey';

describe('journey eras', () => {
  it('has exactly 5 eras in chronological order', () => {
    expect(eras).toHaveLength(5);
    expect(eras.map((e) => e.id)).toEqual(['origin', 'logistics', 'language', 'mobility', 'agents']);
  });
  it('every era has story beats and at least one metric', () => {
    for (const era of eras) {
      expect(era.terrain.length).toBeGreaterThan(40);
      expect(era.crossing.length).toBeGreaterThan(40);
      expect(era.summit.length).toBeGreaterThan(40);
      expect(era.metrics.length).toBeGreaterThan(0);
      expect(era.coords.x).toBeGreaterThanOrEqual(0);
      expect(era.coords.x).toBeLessThanOrEqual(100);
      expect(era.coords.y).toBeGreaterThanOrEqual(0);
      expect(era.coords.y).toBeLessThanOrEqual(100);
    }
  });
  it('every press mention has a real url', () => {
    for (const era of eras) {
      for (const p of era.press ?? []) {
        expect(p.url).toMatch(/^https?:\/\//);
      }
    }
  });
  it('metrics are numeric with labels (no template stat rows)', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    expect(mobility.metrics).toContainEqual(expect.objectContaining({ value: 8, suffix: '×', label: 'ARR' }));
  });
});
