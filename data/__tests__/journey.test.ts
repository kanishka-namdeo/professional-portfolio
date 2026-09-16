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
  it('every press mention has a real https url', () => {
    for (const era of eras) {
      for (const p of era.press ?? []) {
        // data/AGENTS.md: external URLs must be valid — and https-only (no
        // mixed-content or downgrade-prone http links on an https site).
        expect(p.url).toMatch(/^https:\/\//);
      }
    }
  });
  it('every press date uses the canonical "Mon YYYY" or "YYYY" format', () => {
    for (const era of eras) {
      for (const p of era.press ?? []) {
        expect(p.date).toMatch(/^((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}|\d{4})$/);
      }
    }
  });
  it('metrics are numeric with labels (no template stat rows)', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    expect(mobility.metrics).toContainEqual(expect.objectContaining({ value: 8, suffix: '×', label: 'ARR' }));
    // Canonical MAU figure: 70K+ is the monthly-users number everywhere; 30K
    // is reserved for new users onboarded (see caseStudy.test.ts). Locked here
    // so a 70K→30K regression on the journey era can't pass.
    expect(mobility.metrics).toContainEqual(
      expect.objectContaining({ value: 70, suffix: 'K+', label: 'monthly users' }),
    );
    expect(mobility.summit).toMatch(/70,000\+ monthly users/);
    expect(mobility.summit).not.toMatch(/30[,.]?000/);
  });
  it('agents era covers all three consulting engagements (2024 — present)', () => {
    const agents = eras.find((e) => e.id === 'agents')!;
    expect(agents.period).toBe('2024 — present');
    expect(agents.crossing).toMatch(/Flipr/);
    expect(agents.crossing).toMatch(/Cognium/);
    expect(agents.crossing).toMatch(/AvloAI/);
    expect(agents.metrics).toContainEqual(expect.objectContaining({ value: 50, suffix: 'K' }));
  });
  it('states the families figure precisely, never "Thousands"', () => {
    const agents = eras.find((e) => e.id === 'agents')!;
    expect(agents.summit).toMatch(/2,000\+ families/);
    expect(agents.summit).not.toMatch(/thousands/i);
  });
  it('mobility era carries the Wipro testimonial and the RentLz case-study link', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    expect(mobility.testimonial).toMatchObject({
      name: 'Nittan Bhalla',
      title: expect.stringMatching(/Wipro/),
    });
    expect(mobility.testimonial!.quote).toMatch(/employee transportation across 8 cities/);
    expect(mobility.caseStudy).toEqual({
      href: '/case-study/rentlz',
      label: 'Read the full RentLz case study',
    });
  });
});
