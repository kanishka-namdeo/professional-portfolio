// data/__tests__/camps.test.ts
import { camps } from '../camps';
import { ledgerRepos, writing } from '../ledger';

describe('camps', () => {
  it('has 3 camps in order', () => {
    expect(camps.map((c) => c.repo)).toEqual(['AgentCanvas', 'pi-dash', 'thetell']);
    for (const camp of camps) {
      expect(camp.steps.length).toBeGreaterThanOrEqual(2);
      expect(camp.media.length).toBeGreaterThanOrEqual(3);
    }
  });
  it('files every camp as an archive: plate first, recording last, frames between', () => {
    for (const camp of camps) {
      const first = camp.media[0];
      const middle = camp.media.slice(1, -1);
      const recording = camp.media[camp.media.length - 1];
      expect(first.kind).toBe('still');
      expect(first.frame).toBe('PLATE');
      expect(first.src).toMatch(/^\/projects\//);
      expect(recording.kind).toBe('recording');
      expect(recording.frame).toBe('REC');
      expect(recording.src).toMatch(/^\/recordings\/.+\.mp4$/);
      expect(recording.poster).toMatch(/^\/recordings\/.+\.jpg$/);
      expect(typeof recording.duration).toBe('number');
      for (const m of middle) {
        expect(m.kind).toBe('still');
        expect(m.src).toMatch(/^\/recordings\/.+\.webp$/);
      }
    }
  });
  it('uses unique artifact labels and annotation names per camp', () => {
    for (const camp of camps) {
      const frames = camp.media.map((m) => m.frame);
      expect(new Set(frames).size).toBe(frames.length);
      // Annotation selectors must be unique across the WHOLE camp — a repeated
      // name can anchor a rough-notation mark to a dying crossfade layer.
      const annos = camp.media.flatMap((m) => m.annotations.map((a) => a.selector));
      expect(new Set(annos).size).toBe(annos.length);
      for (const a of camp.media.flatMap((m) => m.annotations)) {
        expect(a.pos.x).toBeGreaterThanOrEqual(0);
        expect(a.pos.x).toBeLessThanOrEqual(100);
        expect(a.pos.y).toBeGreaterThanOrEqual(0);
        expect(a.pos.y).toBeLessThanOrEqual(100);
      }
    }
  });
  it('maps every step to a valid media index, and the last step to the recording', () => {
    for (const camp of camps) {
      const last = camp.media.length - 1;
      for (const step of camp.steps) {
        expect(step.mediaIndex).toBeGreaterThanOrEqual(0);
        expect(step.mediaIndex).toBeLessThanOrEqual(last);
      }
      expect(camp.steps[camp.steps.length - 1].mediaIndex).toBe(last);
    }
  });
  it('keeps recording chapters inside the film length', () => {
    for (const camp of camps) {
      const rec = camp.media[camp.media.length - 1];
      expect(rec.kind).toBe('recording');
      const [start, end] = rec.chapter ?? [0, 0];
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeGreaterThan(start);
      expect(end).toBeLessThanOrEqual((rec.duration ?? 0) + 0.5);
    }
  });
  it('declares intrinsic pixel sizes for every artifact (CLS)', () => {
    for (const camp of camps) {
      for (const m of camp.media) {
        expect(m.width).toBeGreaterThan(0);
        expect(m.height).toBeGreaterThan(0);
      }
    }
  });
});

describe('ledger', () => {
  it('lists remaining repos with github links and no picsum', () => {
    expect(ledgerRepos.length).toBeGreaterThanOrEqual(8);
    for (const repo of ledgerRepos) {
      expect(repo.url).toMatch(/^https:\/\/github\.com\/kanishka-namdeo\//);
      expect(JSON.stringify(repo)).not.toContain('picsum');
    }
  });
  it('has writing entries', () => {
    expect(writing.length).toBeGreaterThanOrEqual(4);
  });
});
