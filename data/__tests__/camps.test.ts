// data/__tests__/camps.test.ts
import { camps } from '../camps';
import { ledgerRepos, writing } from '../ledger';

describe('camps', () => {
  it('has 3 camps in order with local screenshots (no remote placeholders)', () => {
    expect(camps.map((c) => c.repo)).toEqual(['AgentCanvas', 'pi-dash', 'thetell']);
    for (const camp of camps) {
      expect(camp.screenshot).toMatch(/^\/projects\//);
      expect(camp.steps.length).toBeGreaterThanOrEqual(2);
      expect(camp.annotations.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('each camp declares a build-time recording with poster', () => {
    for (const camp of camps) {
      expect(camp.recording.src).toMatch(/^\/recordings\/.+\.mp4$/);
      expect(camp.recording.poster).toMatch(/^\/recordings\/.+\.jpg$/);
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
