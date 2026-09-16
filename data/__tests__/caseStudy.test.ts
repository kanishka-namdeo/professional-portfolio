// data/__tests__/caseStudy.test.ts
import { rentlzCaseStudy } from '../caseStudy';

const allText = JSON.stringify(rentlzCaseStudy);

describe('rentlz case study document', () => {
  it('has required framing fields', () => {
    expect(rentlzCaseStudy.slug).toBe('rentlz');
    expect(rentlzCaseStudy.title.length).toBeGreaterThan(20);
    expect(rentlzCaseStudy.subtitle.length).toBeGreaterThan(40);
    expect(rentlzCaseStudy.meta.length).toBeGreaterThanOrEqual(3);
    expect(rentlzCaseStudy.sections.length).toBeGreaterThanOrEqual(6);
    expect(rentlzCaseStudy.closing.length).toBeGreaterThan(40);
  });

  it('section headings are unique (renderer uses them for aria-labelledby ids)', () => {
    const headings = rentlzCaseStudy.sections.map((s) => s.heading);
    expect(new Set(headings).size).toBe(headings.length);
  });

  it('every section has at least one block and blocks are non-empty', () => {
    for (const section of rentlzCaseStudy.sections) {
      expect(section.blocks.length).toBeGreaterThan(0);
      for (const block of section.blocks) {
        if (block.kind === 'p') expect(block.text.trim().length).toBeGreaterThan(0);
        if (block.kind === 'metrics') expect(block.items.length).toBeGreaterThan(0);
        if (block.kind === 'features') expect(block.items.length).toBeGreaterThan(0);
        if (block.kind === 'steps') expect(block.items.length).toBeGreaterThan(0);
        if (block.kind === 'lessons') expect(block.items.length).toBeGreaterThan(0);
        if (block.kind === 'quote') {
          expect(block.quote.text.trim().length).toBeGreaterThan(0);
          expect(block.quote.name.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('keeps the canonical user numbers: 70K is total MAU, 30K is acquisition', () => {
    expect(allText).toMatch(/70,000\+ monthly active users/);
    expect(allText).toMatch(/30,000\+ new monthly users/);
    // 70K must never be framed as acquisition/onboarding
    expect(allText).not.toMatch(/70,?000\+ new/i);
    expect(allText).not.toMatch(/onboarded 70,?000/i);
  });

  it('headline metrics are present and consistent', () => {
    expect(allText).toMatch(/8×/);
    expect(allText).toMatch(/12×/);
    expect(allText).toMatch(/50\+ locations/);
  });

  it('carries both client testimonials', () => {
    expect(allText).toMatch(/Nittan Bhalla/);
    expect(allText).toMatch(/Subramani Raman/);
  });
});
