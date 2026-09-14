# Dispatches Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kanishkanamdeo.com as a single-page "Dispatches" scrollytelling experience — career-as-map, scroll-driven journey chapters, project base camps with real media — replacing the current card-based sections.

**Architecture:** One Next.js 16 App Router page composed of five movements (Map hero → Journey → Base Camps → Ledger → End of Trail). All scroll choreography runs on `motion` + CSS sticky; Lenis provides desktop smooth scroll; the contour map is generated once by a build script into a static SVG; Remotion loops are rendered to MP4 files at build time. Content lives in typed data modules consumed by Server Components.

**Tech Stack:** Next.js 16, React 19, Tailwind 4 (`@theme` tokens), `motion` ^13, `lenis` 1.x, `rough-notation` 0.5.1, Remotion 4.x (build-time), simplex-noise + d3-contour (build script only), Jest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-13-dispatches-portfolio-redesign-design.md` — executors read both.

## Global Constraints

- Anti-AI rules (from spec §2 + memory): no Inter-only type, no purple/blue gradients, no gradient text, no glassmorphism/glow, no stock/AI/placeholder imagery (picsum is banned), no pill eyebrows, no hero stat-row template, no pulsing status dots, no identical fade-ins, no auto-marquees, no blinking cursors.
- Palette (exact): parchment `#F3EDE2`, ink `#2E281E`, ink-blue linework `rgba(90,110,140,0.25)`, rust accent `#8C4A2F` (only for "you are here"/active states). Light theme only in v1.
- Type: Crimson Pro (voice) + JetBrains Mono (metadata) via `next/font/google` only.
- One animation engine: `motion` only (no GSAP, no Scrollama). Animate `transform`/`opacity`/SVG `pathLength` only — never layout properties.
- `prefers-reduced-motion`: no pinning, trail fully drawn, counters static, video posters instead of autoplay. Content readable without motion.
- Mobile (≤768px): no pinned scenes; vertical timeline; native touch scroll (Lenis `syncTouch: false`).
- Every metric keeps a receipt (press link or repo link). First-person copy; banned words: delve, foster, leverage, utilize, facilitate, empower, streamline, robust, cutting-edge, game changer, elevate, embark, supercharge, harness.
- Content reconciliation: use **70+ locations** (from MoveInSync achievements) everywhere; the old hero said 50+.
- Remotion license: individual use — free. Renders at build time only; never ship the runtime player.

---

### Task 1: Dependencies — add new, drop the carousel

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `lenis`, `rough-notation` at runtime; `remotion`, `@remotion/renderer`, `simplex-noise`, `d3-contour` as devDependencies. Later tasks import these exact names.

- [ ] **Step 1: Install runtime deps**

```bash
pnpm remove embla-carousel-react
pnpm add lenis rough-notation
pnpm add -D remotion @remotion/renderer simplex-noise d3-contour
```

- [ ] **Step 2: Verify**

Run: `pnpm type-check && pnpm build`
Expected: build passes (nothing imports embla in remaining code yet — if `Showcase.tsx` errors on its embla import, that is fine and fixed in Task 16; for now run `pnpm type-check` only and note any embla errors as expected).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add lenis, rough-notation, remotion, contour toolchain; drop embla"
```

---

### Task 2: Design tokens, fonts, Lenis root

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (add tokens at top of `:root`)

**Interfaces:**
- Produces: CSS custom properties `--color-parchment`, `--color-ink`, `--color-inkline`, `--color-rust`; font CSS vars `--font-crimson-pro`, `--font-jetbrains-mono`; `<ReactLenis root>` wrapping the app.

- [ ] **Step 1: Fonts + Lenis in layout**

```tsx
// app/layout.tsx — replace font/theme wiring, keep existing metadata structure
import { Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const crimsonPro = Crimson_Pro({ subsets: ['latin'], variable: '--font-crimson-pro', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ReactLenis root options={{ lerp: 0.1, syncTouch: false, anchors: { offset: -80 } }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
```

Preserve existing `<head>` metadata, analytics, and manifest wiring already in `app/layout.tsx`. Remove the `ThemeToggle` import/usage (v1 is light-only; component deleted in Task 16).

- [ ] **Step 2: Tokens in globals.css**

```css
:root {
  /* Dispatches tokens */
  --color-parchment: #F3EDE2;
  --color-ink: #2E281E;
  --color-inkline: rgba(90, 110, 140, 0.25);
  --color-rust: #8C4A2F;
  --font-voice: var(--font-crimson-pro), Georgia, 'Times New Roman', serif;
  --font-data: var(--font-jetbrains-mono), ui-monospace, monospace;
  /* grain overlay, applied once on body::after */
  --grain-opacity: 0.04;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
}
```

- [ ] **Step 3: Verify**

Run: `pnpm dev` and open http://localhost:3457 — page still renders (old sections intact), fonts load (DevTools → Network shows Crimson Pro woff2 self-hosted), subtle grain overlay visible.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: Dispatches tokens, self-hosted fonts, Lenis root, grain overlay"
```

---

### Task 3: Journey data module (5 eras)

**Files:**
- Create: `data/journey.ts`
- Test: `data/__tests__/journey.test.ts`

**Interfaces:**
- Produces: `Era` interface + `eras: Era[]` (exactly 5, ordered oldest → newest). Later tasks (6, 9, 10) consume `eras`.

- [ ] **Step 1: Write the failing test**

```ts
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
    expect(mobility.metrics).toContainEqual(expect.objectContaining({ value: 10, suffix: '×', label: 'ARR' }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- data/__tests__/journey.test.ts`
Expected: FAIL — cannot find module `../journey`

- [ ] **Step 3: Write the data module**

```ts
// data/journey.ts
export interface EraMetric {
  value: number;
  suffix?: string;
  label: string;
}
export interface PressMention {
  source: string;
  headline: string;
  url: string;
  date: string;
}
export interface Era {
  id: 'origin' | 'logistics' | 'language' | 'mobility' | 'agents';
  number: string;
  company: string;
  role: string;
  period: string;
  coords: { x: number; y: number }; // % position on the map, origin bottom-left → agents top-right
  terrain: string; // the challenge
  crossing: string; // what I did
  summit: string; // the impact
  metrics: EraMetric[];
  press?: PressMention[];
}

export const eras: Era[] = [
  {
    id: 'origin',
    number: '01',
    company: 'Sagar Defence Engineering',
    role: 'Co-founding member & CTO',
    period: '2016 — 2020',
    coords: { x: 12, y: 88 },
    terrain:
      'Defence and paramilitary agencies needed unmanned surface vehicles that could hold a course in real sea conditions — no operator, no second chances.',
    crossing:
      'I co-founded the engineering effort: autonomous navigation with multi-sensor fusion, obstacle avoidance, simulation environments to rehearse missions before launch, and field trials with defence and industrial partners.',
    summit:
      'Our USVs completed successful field trials — systems I architected were deployed for wildlife surveillance and water-body cleaning pilots covered by The Hindu and Mumbai Mirror.',
    metrics: [
      { value: 4, suffix: ' yrs', label: 'at sea' },
      { value: 6, label: 'sensor streams fused' },
    ],
    press: [
      { source: 'The Hindu', headline: 'State Embraces Startups, Signs Pacts for Works Worth 15 Lakh', url: 'https://www.thehindu.com/news/cities/mumbai/state-embraces-startups-signs-pacts-for-works-worth-15-lakh/article24301791.ece', date: '2018' },
      { source: 'Mumbai Mirror', headline: 'Welcome TrashFin — The Water Bodies Cleaner', url: 'https://mumbaimirror.indiatimes.com/mumbai/civic/welcome-trashfin-the-water-bodies-cleaner/articleshow/64891123.html', date: '2018' },
      { source: 'Naya Rajasthan', headline: 'Wildlife Surveillance and Anti-Poaching System Installed by Rajasthan Government', url: 'https://nayarajasthan.wordpress.com/2018/06/06/wildlife-surveillance-and-anti-poaching-system-installed-by-rajasthan-government/', date: 'Jun 2018' },
    ],
  },
  {
    id: 'logistics',
    number: '02',
    company: 'Intugine Technologies',
    role: 'Technical Consultant',
    period: '2020',
    coords: { x: 30, y: 72 },
    terrain:
      'Enterprise logistics teams flew blind across road, rail and air — three transport modes, three fragmented views, decisions made late.',
    crossing:
      'I led the multimodal visibility platform: sharper tracking accuracy across all modes, real-time dashboards and alerting, and the requirements discipline that got enterprise clients to actually adopt it.',
    summit:
      'Enterprise teams could finally decide in real time across every transport mode — adoption grew because the platform fit their workflows instead of adding one.',
    metrics: [
      { value: 3, label: 'transport modes unified' },
      { value: 24, suffix: '/7', label: 'real-time visibility' },
    ],
  },
  {
    id: 'language',
    number: '03',
    company: 'Medulla.AI · TekIP',
    role: 'Senior Technical Consultant · Software Team Lead',
    period: '2020 — 2022',
    coords: { x: 45, y: 58 },
    terrain:
      'Patent analysts spent hours in databases; loan officers reviewed pay stubs and tax returns by hand. Two industries, one disease: unstructured language at scale.',
    crossing:
      'I led a 6-developer team across 5 enterprise projects, shipped 40+ features, launched an NLP patent-analysis product on LLMs, and built an automated loan pipeline on Amazon Textract with confidence scoring, Celery async processing and Airflow orchestration.',
    summit:
      'Patent analysis productivity rose 10×. Loan document analysis dropped to a fifth of manual time — with audit logging, PII encryption and fallback workflows that regulators accept.',
    metrics: [
      { value: 10, suffix: '×', label: 'analysis productivity' },
      { value: 5, suffix: '×', label: 'faster document review' },
      { value: 40, suffix: '+', label: 'features shipped' },
    ],
  },
  {
    id: 'mobility',
    number: '04',
    company: 'MoveInSync',
    role: 'Senior Product Manager',
    period: '2022 — 2024',
    coords: { x: 62, y: 40 },
    terrain:
      'The world’s largest enterprise transport platform needed to grow from a regional success into a global one — without breaking product quality along the way.',
    crossing:
      'I owned product vision and roadmap: 70+ new locations across 3 countries, a rebuilt mobile experience, native payments and invoicing, ERP integrations that cut implementation time 40%, and an 8-person sprint team run on ruthless prioritization.',
    summit:
      '~10× ARR growth. 70,000+ monthly users. 15+ enterprise clients onboarded. The platform became the market leader in enterprise transport management.',
    metrics: [
      { value: 10, suffix: '×', label: 'ARR' },
      { value: 70, suffix: 'K+', label: 'monthly users' },
      { value: 70, suffix: '+', label: 'locations' },
      { value: 3, label: 'countries' },
    ],
    press: [
      { source: 'Impakter', headline: 'Indian Startup MoveInSync Pioneers Intelligent Commutes Across the Globe', url: 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/', date: '2024' },
      { source: 'MoveInSync', headline: 'Business RentLZ — Enterprise Vehicle Management Solution', url: 'https://moveinsync.com/business-rentlz', date: '2024' },
    ],
  },
  {
    id: 'agents',
    number: '05',
    company: 'AvloAI · Independent consulting',
    role: 'Product & AI Consultant',
    period: '2025 — present',
    coords: { x: 84, y: 16 },
    terrain:
      'Founders keep building AI products users don’t need. The gap is not models — it is product judgment: what to build, for whom, and what to verify before writing code.',
    crossing:
      'I architected a 5-agent children’s storytelling pipeline (22 natively-written languages, 30-second ElevenLabs voice cloning, COPPA 2.0 data architecture). At Cognium I ran 20+ user interviews and secured the first beta customer before the prototype existed. In the open, I build the MCP tooling this site documents.',
    summit:
      'Thousands of families generate personalized stories in their own languages. A wealth-management platform found product-market signal before writing production code. The base camps below are the receipts.',
    metrics: [
      { value: 22, label: 'languages' },
      { value: 30, suffix: 's', label: 'voice cloning' },
      { value: 5, label: 'agent pipeline' },
      { value: 20, suffix: '+', label: 'user interviews' },
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- data/__tests__/journey.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add data/journey.ts data/__tests__/journey.test.ts
git commit -m "feat: journey data module with 5 career eras and press receipts"
```

---

### Task 4: Base camps + ledger data modules

**Files:**
- Create: `data/camps.ts`
- Create: `data/ledger.ts`
- Test: `data/__tests__/camps.test.ts`

**Interfaces:**
- Produces: `camps: Camp[]` (exactly 3: AgentCanvas, pi-dash, thetell) and `ledgerRepos: LedgerRepo[]`, `writing: WritingEntry[]`. Consumed by Tasks 12 and 13.

- [ ] **Step 1: Write the failing test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- data/__tests__/camps.test.ts`
Expected: FAIL — cannot find module

- [ ] **Step 3: Write the data modules**

```ts
// data/camps.ts
export interface CampStep {
  heading: string;
  body: string;
}
export interface CampAnnotation {
  /** CSS selector inside the screenshot container, e.g. '[data-anno="nodes"]' */
  selector: string;
  note: string;
}
export interface Camp {
  id: string;
  repo: string;
  title: string;
  tagline: string;
  screenshot: string;
  repoUrl: string;
  stack: string[];
  year: string;
  steps: CampStep[];
  annotations: CampAnnotation[];
  recording: { src: string; poster: string; caption: string };
}

export const camps: Camp[] = [
  {
    id: 'agent-canvas',
    repo: 'AgentCanvas',
    title: 'AgentCanvas',
    tagline: 'Your agentic designer — build agent workflows visually.',
    screenshot: '/projects/agent-canvas.png',
    repoUrl: 'https://github.com/kanishka-namdeo/AgentCanvas',
    stack: ['TypeScript', 'HTML', 'AI Agents', 'Visual Builder'],
    year: '2026',
    steps: [
      { heading: 'The problem', body: 'Agent workflows live in YAML files nobody can read. AgentCanvas makes the pipeline a drawing: nodes, edges, and joins you can point at.' },
      { heading: 'The decision', body: 'Agents connect through typed ports instead of stringly-typed prompts — a join is visible, so a broken handoff is visible too.' },
      { heading: 'The result', body: 'Design an agentic workflow the way you’d sketch it on a whiteboard — then run it.' },
    ],
    annotations: [
      { selector: '[data-anno="canvas"]', note: 'the design surface — agents are nodes' },
      { selector: '[data-anno="inspector"]', note: 'typed ports: every join is checked' },
    ],
    recording: { src: '/recordings/agent-canvas.mp4', poster: '/recordings/agent-canvas.jpg', caption: 'Field recording — an agent run, end to end.' },
  },
  {
    id: 'pi-dash',
    repo: 'pi-dash',
    title: 'pi-dash',
    tagline: 'Many agents, one surface.',
    screenshot: '/projects/pi-dash.webp',
    repoUrl: 'https://github.com/kanishka-namdeo/pi-dash',
    stack: ['TypeScript', 'React', 'Next.js', 'Orchestration'],
    year: '2026',
    steps: [
      { heading: 'The problem', body: 'Running five agents means five terminals, five logs, five places to lose the thread.' },
      { heading: 'The decision', body: 'One dashboard owns state and monitoring; agents stay disposable, the surface stays put.' },
      { heading: 'The result', body: 'Spawn, watch and steer every agent from a single pane of glass.' },
    ],
    annotations: [
      { selector: '[data-anno="agents"]', note: 'live agents at a glance' },
      { selector: '[data-anno="timeline"]', note: 'run history — what happened, when, and why' },
    ],
    recording: { src: '/recordings/pi-dash.mp4', poster: '/recordings/pi-dash.jpg', caption: 'Field recording — a dashboard sweep.' },
  },
  {
    id: 'thetell',
    repo: 'thetell',
    title: 'thetell',
    tagline: 'AI-powered corporate intelligence: dual-agent debate over 25+ signal sources.',
    screenshot: '/projects/thetell.png',
    repoUrl: 'https://github.com/kanishka-namdeo/thetell',
    stack: ['TypeScript', 'Next.js', 'Neo4j', 'LlamaIndex'],
    year: '2025',
    steps: [
      { heading: 'The problem', body: 'A single model reading the news is a single point of failure — confident and wrong.' },
      { heading: 'The decision', body: 'Two agents argue. A graph database (Neo4j) holds the claims, LlamaIndex retrieves the signals, and every conclusion carries a confidence score.' },
      { heading: 'The result', body: 'Corporate intelligence where you can see the argument, not just the answer.' },
    ],
    annotations: [
      { selector: '[data-anno="debate"]', note: 'the debate: two agents, one verdict' },
      { selector: '[data-anno="graph"]', note: 'claims live in Neo4j, scored' },
    ],
    recording: { src: '/recordings/thetell.mp4', poster: '/recordings/thetell.jpg', caption: 'Field recording — signal debate visualization.' },
  },
];
```

```ts
// data/ledger.ts
export interface LedgerRepo {
  name: string;
  oneLiner: string;
  language: string;
  year: string;
  url: string;
}
export interface WritingEntry {
  title: string;
  date: string;
  readTime: string;
  url: string;
}

export const ledgerRepos: LedgerRepo[] = [
  { name: 'Unown', oneLiner: 'The self-improving coding agent.', language: 'TypeScript', year: '2026', url: 'https://github.com/kanishka-namdeo/Unown' },
  { name: 'the-pokemon-journey', oneLiner: 'A tribute to the franchise that shaped my childhood.', language: 'HTML', year: '2026', url: 'https://github.com/kanishka-namdeo/the-pokemon-journey' },
  { name: 'coding-plan-proxy', oneLiner: 'HTTP proxy for AI coding APIs — rate limiting, circuit breaker, TUI dashboard.', language: 'Python', year: '2026', url: 'https://github.com/kanishka-namdeo/coding-plan-proxy' },
  { name: 'everything-search-mcp', oneLiner: 'MCP server: instant file search on Windows/macOS/Linux.', language: 'TypeScript', year: '2026', url: 'https://github.com/kanishka-namdeo/everything-search-mcp' },
  { name: 'electron-mcp', oneLiner: 'MCP server for Electron testing and automation.', language: 'TypeScript', year: '2026', url: 'https://github.com/kanishka-namdeo/electron-mcp' },
  { name: 'cursor-learning-harness', oneLiner: 'Records AI coding sessions and improves agent behavior over time.', language: 'Python', year: '2025', url: 'https://github.com/kanishka-namdeo/cursor-learning-harness' },
  { name: 'instructify', oneLiner: 'Research-backed Cursor IDE configuration for smarter agents.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/instructify' },
  { name: 'Twin', oneLiner: 'Privacy-first AI meeting assistant in Rust — local processing.', language: 'Rust', year: '2025', url: 'https://github.com/kanishka-namdeo/Twin' },
  { name: 'rust-sim', oneLiner: 'Simulation framework for high-performance experiments.', language: 'Rust', year: '2026', url: 'https://github.com/kanishka-namdeo/rust-sim' },
  { name: 'social-beam', oneLiner: 'Full-stack social platform with AI agents and real-time aggregation.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/social-beam' },
];

export const writing: WritingEntry[] = [
  { title: 'MCP File Search That Actually Works (Everywhere)', date: 'Jan 2026', readTime: '8 min', url: 'https://kanishkanamdeo.medium.com/mcp-file-search-that-actually-works-everywhere-d139a33dfcb1' },
  { title: 'Vibe Coding (and not losing my mind)', date: 'Dec 2025', readTime: '10 min', url: 'https://kanishkanamdeo.medium.com/vibe-coding-and-not-losing-my-mind-ac175f123155' },
  { title: 'Writing A Simple Kivy-based CPU-Monitoring App in Python!', date: 'Apr 2020', readTime: '7 min', url: 'https://kanishkanamdeo.medium.com/writing-a-simple-kivy-based-cpu-monitoring-app-in-python-74e1a7e872' },
  { title: 'My Experiments with Elementary OS: Part 1', date: 'Apr 2020', readTime: '6 min', url: 'https://kanishkanamdeo.medium.com/my-experiments-with-elementary-os-part-1-4a2e81777101' },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- data/__tests__/camps.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add data/camps.ts data/ledger.ts data/__tests__/camps.test.ts
git commit -m "feat: base camps and ledger data modules"
```

---

### Task 5: Contour map generation script

**Files:**
- Create: `scripts/generate-map.mjs`
- Create: `scripts/lib/contours.mjs`
- Test: `scripts/__tests__/contours.test.mjs` (jest, run via existing config — add `.mjs` to jest `moduleFileExtensions` if needed)
- Generated: `public/map/contours.svg` (committed)

**Interfaces:**
- Produces: `public/map/contours.svg` (static contours; Task 6 overlays interactivity). Exports `buildContourPaths({ width, height, bands, seed }) → string[]` (SVG path `d` strings) for testing.

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- contours`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the contour library**

```js
// scripts/lib/contours.mjs
import { createNoise2D } from 'simplex-noise';
import { contours } from 'd3-contour';

function mulberry32(seedStr) {
  let a = 0;
  for (let i = 0; i < seedStr.length; i++) a = (a * 31 + seedStr.charCodeAt(i)) >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildContourPaths({ width, height, bands, seed }) {
  const rand = mulberry32(seed);
  const noise2D = createNoise2D(rand);
  const cols = 96, rows = 64;
  const values = new Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // gentle large-scale terrain: two octaves
      values[y * cols + x] =
        0.7 * noise2D(x / 22, y / 22) + 0.3 * noise2D(x / 8 + 40, y / 8 + 40);
    }
  }
  const c = contours().size([cols, rows]).thresholds(bands).smooth(true);
  const polys = c(values);
  const sx = width / cols, sy = height / rows;
  const paths = [];
  for (const poly of polys) {
    let d = '';
    for (const ring of poly.coordinates) {
      ring.forEach(([x, y], i) => {
        d += (i === 0 ? 'M' : 'L') + `${(x * sx).toFixed(1)} ${(y * sy).toFixed(1)}`;
      });
      d += 'Z';
    }
    paths.push(d);
  }
  return paths;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- contours`
Expected: PASS

- [ ] **Step 5: Write the generator script and run it**

```js
// scripts/generate-map.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildContourPaths } from './lib/contours.mjs';

const WIDTH = 1200, HEIGHT = 800;
const paths = buildContourPaths({ width: WIDTH, height: HEIGHT, bands: 25, seed: 'dispatches-2026' });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" stroke="rgba(90,110,140,0.25)" stroke-width="1">\n${paths.map((d) => `  <path d="${d}"/>`).join('\n')}\n</svg>\n`;
mkdirSync('public/map', { recursive: true });
writeFileSync('public/map/contours.svg', svg);
console.log(`wrote public/map/contours.svg with ${paths.length} contour paths`);
```

Run: `node scripts/generate-map.mjs && ls -la public/map/contours.svg`
Expected: file exists; size < 200 KB (if over, reduce `bands` to 18 and/or round coordinates to 1 decimal — already done above).

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-map.mjs scripts/lib/contours.mjs scripts/__tests__/contours.test.mjs public/map/contours.svg
git commit -m "feat: deterministic contour map generator, static contours.svg"
```

---

### Task 6: ExpeditionMap overlay component

**Files:**
- Create: `components/map/ExpeditionMap.tsx`
- Test: `components/map/__tests__/ExpeditionMap.test.tsx`

**Interfaces:**
- Consumes: `eras` from `data/journey.ts`; `useLenis` from `lenis/react`; `motion/react` (`useScroll`, `useSpring`).
- Produces: `<ExpeditionMap activeId={string | null} />` — renders waypoints as buttons (`aria-label="Travel to <company>"`), trail path drawn by scroll. Also `ExpeditionMapMini` export (static mini-map for the progress rail, Task 15).

- [ ] **Step 1: Write the failing test**

```tsx
// components/map/__tests__/ExpeditionMap.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpeditionMap } from '../ExpeditionMap';

jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollYProgress: { on: jest.fn(), get: () => 0 } }),
  useSpring: (v) => v,
  motion: { path: 'path', g: 'g', circle: 'circle' },
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- ExpeditionMap`
Expected: FAIL — module not found

- [ ] **Step 3: Implement**

```tsx
// components/map/ExpeditionMap.tsx
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';

/** Trail polyline through era coords (in % of the map box). */
function trailD() {
  const pts = eras.map((e) => e.coords);
  // hand-wobble: offset alternate points slightly
  return pts
    .map(([x, y], i) => {
      const jx = i % 2 === 0 ? -1.2 : 1.4;
      const jy = i % 3 === 0 ? 1.6 : -1.1;
      const px = `${x + jx}`, py = `${y + jy}`;
      return `${i === 0 ? 'M' : 'Q'} ${px} ${py}`;
    })
    .join(' ');
}
// (note: coords are {x,y} objects — destructure as ({x, y}, i) in practice; keep types honest)

export function ExpeditionMap({ activeId }: { activeId: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={ref} className="relative aspect-[3/2] w-full" data-testid="expedition-map">
      <Image src="/map/contours.svg" alt="" fill className="object-cover" aria-hidden />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <motion.path
          d={trailD()}
          fill="none"
          stroke="var(--color-rust)"
          strokeWidth="0.5"
          strokeLinecap="round"
          style={reduceMotion ? { pathLength: 1 } : { pathLength }}
        />
      </svg>
      <ul role="list" aria-label="Career waypoints" className="absolute inset-0">
        {eras.map((era) => (
          <li key={era.id} className="absolute" style={{ left: `${era.coords.x}%`, top: `${era.coords.y}%` }}>
            <button
              type="button"
              onClick={() => lenis?.scrollTo(`#era-${era.id}`)}
              aria-label={`Travel to ${era.company}`}
              className={`-translate-x-1/2 -translate-y-1/2 rounded-none border px-2 py-1 font-[family-name:var(--font-data)] text-[11px] transition-transform ${
                activeId === era.id
                  ? 'border-[var(--color-rust)] bg-[var(--color-rust)] text-[var(--color-parchment)]'
                  : 'border-[var(--color-ink)] bg-[var(--color-parchment)] text-[var(--color-ink)] hover:-rotate-2'
              }`}
              style={{ transform: `translate(-50%, -50%) rotate(${era.coords.x % 2 ? 1.5 : -1.5}deg)` }}
            >
              {era.company}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExpeditionMapMini({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden>
      <path d={trailD()} fill="none" stroke="var(--color-inkline)" strokeWidth="1" />
      <motion.path d={trailD()} fill="none" stroke="var(--color-rust)" strokeWidth="1" style={{ pathLength: progress }} />
    </svg>
  );
}
```

Note: `useScroll({ target })` requires the component to be mounted after hydration; tests mock it. If jest complains about `next/image`, add `next-image` stub to `jest.setup.cjs`: `jest.mock('next/image', () => (props) => <img {...props} alt="" />)` — check how existing tests handle it first (ParticleMesh tests exist).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- ExpeditionMap`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/map/ExpeditionMap.tsx components/map/__tests__/ExpeditionMap.test.tsx
git commit -m "feat: expedition map overlay with scroll-drawn trail and waypoints"
```

---

### Task 7: MetricCounter (SSR final value + spring)

**Files:**
- Create: `components/journey/MetricCounter.tsx`
- Test: `components/journey/__tests__/MetricCounter.test.tsx`

**Interfaces:**
- Consumes: `EraMetric` from `data/journey.ts`; `useInView`, `animate`, `useReducedMotion` from `motion/react`.
- Produces: `<MetricCounter value={10} suffix="×" label="ARR" />` — server-renderable markup showing the final value in the initial HTML.

- [ ] **Step 1: Write the failing test**

```tsx
// components/journey/__tests__/MetricCounter.test.tsx
import { render, screen } from '@testing-library/react';
import { MetricCounter } from '../MetricCounter';

describe('MetricCounter', () => {
  it('renders the final value in initial HTML (no-JS readable)', () => {
    const { container } = render(<MetricCounter value={10} suffix="×" label="ARR" />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('ARR')).toBeInTheDocument();
  });
  it('exposes final value to screen readers even while animating', () => {
    render(<MetricCounter value={70} suffix="K+" label="monthly users" />);
    expect(screen.getByRole('img', { name: '70K+ monthly users' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- MetricCounter`
Expected: FAIL

- [ ] **Step 3: Implement**

```tsx
// components/journey/MetricCounter.tsx
'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import type { EraMetric } from '@/data/journey';

export function MetricCounter({ value, suffix, label }: EraMetric) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = String(Math.round(v)); },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span role="img" aria-label={`${value}${suffix ?? ''} ${label}`} className="inline-flex flex-col">
      <span className="font-[family-name:var(--font-data)] text-4xl font-bold text-[var(--color-ink)]">
        <span ref={ref}>{value}</span>
        {suffix && <span className="text-[var(--color-rust)]">{suffix}</span>}
      </span>
      <span className="text-sm text-[var(--color-ink)]/70">{label}</span>
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- MetricCounter`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/journey/MetricCounter.tsx components/journey/__tests__/MetricCounter.test.tsx
git commit -m "feat: metric counter with SSR final value and spring on view"
```

---

### Task 8: JourneyChapter (era story + postcards)

**Files:**
- Create: `components/journey/JourneyChapter.tsx`
- Test: `components/journey/__tests__/JourneyChapter.test.tsx`

**Interfaces:**
- Consumes: `Era`, `MetricCounter` (Task 7).
- Produces: `<JourneyChapter era={era} active={boolean} />` — renders `<section id="era-{id}">` with terrain/crossing/summit, metrics row, press postcards.

- [ ] **Step 1: Write the failing test**

```tsx
// components/journey/__tests__/JourneyChapter.test.tsx
import { render, screen } from '@testing-library/react';
import { JourneyChapter } from '../JourneyChapter';
import { eras } from '@/data/journey';

describe('JourneyChapter', () => {
  it('renders the three story beats and section id', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    render(<JourneyChapter era={mobility} active={false} />);
    expect(document.getElementById('era-mobility')).toBeInTheDocument();
    expect(screen.getByText(/terrain/i)).toBeInTheDocument();
    expect(screen.getByText(/crossing/i)).toBeInTheDocument();
    expect(screen.getByText(/summit/i)).toBeInTheDocument();
  });
  it('renders press receipts as real links', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    render(<JourneyChapter era={mobility} active={false} />);
    const link = screen.getByRole('link', { name: /Impakter/i });
    expect(link).toHaveAttribute('href', 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- JourneyChapter`
Expected: FAIL

- [ ] **Step 3: Implement**

```tsx
// components/journey/JourneyChapter.tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Era } from '@/data/journey';
import { MetricCounter } from './MetricCounter';

export function JourneyChapter({ era, active }: { era: Era; active: boolean }) {
  const reduce = useReducedMotion();
  const enter = (i: number) =>
    reduce ? {} : {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-15% 0px' },
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    };

  return (
    <section id={`era-${era.id}`} className="relative min-h-[90vh] py-24" data-era={era.id} data-active={active}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.p {...enter(0)} className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
          WAYPOINT {era.number} — {era.period.toUpperCase()}
        </motion.p>
        <motion.h2 {...enter(1)} className="mt-2 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
          {era.company}
          <span className="block text-lg font-medium italic text-[var(--color-ink)]/70">{era.role}</span>
        </motion.h2>

        <motion.div {...enter(2)} className="mt-10 space-y-6 font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]">
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Terrain — </strong>{era.terrain}</p>
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Crossing — </strong>{era.crossing}</p>
          <p><strong className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-rust)]">Summit — </strong>{era.summit}</p>
        </motion.div>

        <motion.div {...enter(3)} className="mt-10 flex flex-wrap gap-10">
          {era.metrics.map((m) => <MetricCounter key={m.label} {...m} />)}
        </motion.div>

        {era.press && era.press.length > 0 && (
          <motion.div {...enter(4)} className="mt-12">
            <p className="font-[family-name:var(--font-data)] text-xs uppercase tracking-widest text-[var(--color-ink)]/60">Receipts from the press</p>
            <ul className="mt-3 space-y-3">
              {era.press.map((p) => (
                <li key={p.url} className="max-w-md rotate-[-1deg] border border-[var(--color-ink)]/20 bg-white/70 p-4 shadow-[2px_3px_6px_rgba(46,40,30,0.2)]">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="block hover:rotate-[0.5deg]">
                    <span className="font-[family-name:var(--font-data)] text-[11px] uppercase tracking-widest text-[var(--color-rust)]">{p.source} · {p.date}</span>
                    <span className="mt-1 block font-[family-name:var(--font-voice)] text-base text-[var(--color-ink)]">“{p.headline}”</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- JourneyChapter`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/journey/JourneyChapter.tsx components/journey/__tests__/JourneyChapter.test.tsx
git commit -m "feat: journey chapter with story beats, counters, press postcards"
```

---

### Task 9: useRoughAnnotation hook

**Files:**
- Create: `hooks/useRoughAnnotation.ts`
- Test: `hooks/__tests__/useRoughAnnotation.test.ts`

**Interfaces:**
- Consumes: `rough-notation` (dynamic import inside effect — keeps it out of SSR bundle).
- Produces: `useRoughAnnotation({ container: RefObject<HTMLElement>, selectors: string[], step: number, enabled: boolean })` — shows annotations with index ≤ step, hides the rest. `selector` resolves via `container.querySelector`.

- [ ] **Step 1: Write the failing test**

```ts
// hooks/__tests__/useRoughAnnotation.test.ts
import { renderHook } from '@testing-library/react';
import { useRoughAnnotation } from '../useRoughAnnotation';

const show = jest.fn();
const hide = jest.fn();
jest.mock('rough-notation', () => ({
  annotate: jest.fn(() => ({ show, hide })),
}));

describe('useRoughAnnotation', () => {
  it('shows annotations up to the current step and hides the rest', async () => {
    const el1 = document.createElement('span');
    const el2 = document.createElement('span');
    const container = document.createElement('div');
    container.append(el1, el2);
    container.querySelector('[data-anno="a"]')?.remove(); // use appendChild semantics instead
    el1.setAttribute('data-anno', 'a');
    el2.setAttribute('data-anno', 'b');
    container.append(el1, el2);

    const containerRef = { current: container };
    renderHook(() => useRoughAnnotation({ container: containerRef, selectors: ['[data-anno="a"]', '[data-anno="b"]'], step: 1, enabled: true }));

    await Promise.resolve(); // let dynamic import settle
    expect(show).toHaveBeenCalled();
    expect(hide).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- useRoughAnnotation`
Expected: FAIL — module not found

- [ ] **Step 3: Implement**

```ts
// hooks/useRoughAnnotation.ts
'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

interface Options {
  container: RefObject<HTMLElement | null>;
  selectors: string[];
  step: number;
  enabled: boolean;
}

/**
 * Shows rough-notation annotations with index <= step, hides the rest.
 * rough-notation is dynamically imported so it stays out of the SSR bundle.
 */
export function useRoughAnnotation({ container, selectors, step, enabled }: Options) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || !container.current) return;
    let cancelled = false;
    let instances: Array<{ show: () => void; hide: () => void; _el: Element }> = [];

    (async () => {
      const { annotate } = await import('rough-notation');
      if (cancelled || !container.current) return;
      instances = selectors
        .map((selector) => {
          const el = container.current?.querySelector(selector);
          if (!el) return null;
          return { ...annotate(el as HTMLElement, { type: 'underline', color: '#8C4A2F', strokeWidth: 2, padding: 2, animationDuration: reduceMotion ? 0 : 600 }), _el: el };
        })
        .filter(Boolean) as typeof instances;

      instances.forEach((inst, i) => (i <= step ? inst.show() : inst.hide()));
    })();

    return () => { cancelled = true; instances.forEach((inst) => inst.hide()); };
  }, [container, selectors, step, enabled, reduceMotion]);
}
```

Note: `rough-notation` has no types bundled? It ships `lib/rough-notation.d.ts` — if TS errors, add `declare module 'rough-notation'` stub in `types/rough-notation.d.ts`:
```ts
declare module 'rough-notation' {
  export function annotate(element: HTMLElement, config?: { type?: string; color?: string; strokeWidth?: number; padding?: number; animationDuration?: number }): { show: () => void; hide: () => void; remove: () => void };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- useRoughAnnotation`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add hooks/useRoughAnnotation.ts hooks/__tests__/useRoughAnnotation.test.ts
git commit -m "feat: rough-notation hook driven by scroll steps"
```

---

### Task 10: BaseCamp (sticky media + steps + recording)

**Files:**
- Create: `components/camps/BaseCamp.tsx`
- Test: `components/camps/__tests__/BaseCamp.test.tsx`

**Interfaces:**
- Consumes: `Camp` (Task 4), `useRoughAnnotation` (Task 9), `useInView` from `motion/react`.
- Produces: `<BaseCamp camp={camp} />` — sticky screenshot panel left, stepping text right (desktop), stacked on mobile; `<video>` recording with poster.

- [ ] **Step 1: Write the failing test**

```tsx
// components/camps/__tests__/BaseCamp.test.tsx
import { render, screen } from '@testing-library/react';
import { BaseCamp } from '../BaseCamp';
import { camps } from '@/data/camps';

jest.mock('motion/react', () => ({
  useInView: () => true,
  useReducedMotion: () => true,
  motion: new Proxy({}, { get: (_, tag) => tag === 'path' ? 'path' : (props) => <div {...props} /> }),
}));
jest.mock('@/hooks/useRoughAnnotation', () => ({ useRoughAnnotation: jest.fn() }));

describe('BaseCamp', () => {
  it('renders real screenshot (next/image) with alt text, no remote placeholders', () => {
    render(<BaseCamp camp={camps[0]} />);
    expect(screen.getByAltText(/AgentCanvas/i)).toHaveAttribute('src', '/projects/agent-canvas.png');
  });
  it('renders the recording as muted looped video with poster and preload=none', () => {
    render(<BaseCamp camp={camps[0]} />);
    const video = screen.getByTestId('camp-recording');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('poster', '/recordings/agent-canvas.jpg');
  });
  it('renders all steps as readable text', () => {
    render(<BaseCamp camp={camps[0]} />);
    expect(screen.getByText(/Agent workflows live in YAML files/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- BaseCamp`
Expected: FAIL

- [ ] **Step 3: Implement**

```tsx
// components/camps/BaseCamp.tsx
'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useInView } from 'motion/react';
import type { Camp } from '@/data/camps';
import { useRoughAnnotation } from '@/hooks/useRoughAnnotation';

export function BaseCamp({ camp }: { camp: Camp }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const inView = useInView(containerRef, { margin: '-20% 0px' });

  useRoughAnnotation({
    container: containerRef,
    selectors: camp.annotations.map((a) => a.selector),
    step,
    enabled: inView,
  });

  return (
    <article id={`camp-${camp.id}`} ref={containerRef} className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
        {/* sticky media plate */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">
            BASE CAMP — {camp.title.toUpperCase()} · {camp.year}
          </p>
          <div className="relative mt-4 border border-[var(--color-ink)] bg-white p-2 shadow-[3px_3px_0_rgba(46,40,30,0.15)]">
            <Image src={camp.screenshot} alt={`${camp.title} — ${camp.tagline}`} width={1200} height={800} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full" data-anno="canvas" />
            {/* annotation anchor points overlay the screenshot */}
            <span data-anno="inspector" className="absolute right-4 top-4 block h-6 w-6" />
          </div>
          <p className="mt-2 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">
            fig. — {camp.tagline} <a className="text-[var(--color-rust)] underline" href={camp.repoUrl} target="_blank" rel="noopener noreferrer">[{camp.repo} →]</a>
          </p>
          <video
            data-testid="camp-recording"
            className="mt-4 w-full border border-[var(--color-ink)]/20"
            src={camp.recording.src}
            poster={camp.recording.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={camp.recording.caption}
          />
          <p className="mt-1 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">{camp.recording.caption}</p>
        </div>

        {/* stepping text */}
        <ol className="space-y-10" aria-label={`${camp.title} — the story`}>
          {camp.steps.map((s, i) => (
            <li
              key={s.heading}
              data-step={i}
              className={`transition-opacity ${step === i ? 'opacity-100' : 'opacity-50'}`}
              onMouseEnter={() => setStep(i)}
              ref={(el) => {
                if (el && 'observe' in {} ) return; // no-op guard
                // step activation happens via in-view tracking below
              }}
            >
              <StepBlock index={i} onEnter={() => setStep(i)} heading={s.heading} body={s.body} />
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

import { useEffect } from 'react';
function StepBlock({ index, onEnter, heading, body }: { index: number; onEnter: () => void; heading: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: '-40% 0px -40% 0px' });
  useEffect(() => { if (visible) onEnter(); }, [visible, index, onEnter]);
  return (
    <div ref={ref}>
      <p className="font-[family-name:var(--font-data)] text-xs text-[var(--color-ink)]/50">STEP {index + 1}</p>
      <h3 className="mt-1 font-[family-name:var(--font-voice)] text-2xl font-bold text-[var(--color-ink)]">{heading}</h3>
      <p className="mt-2 font-[family-name:var(--font-voice)] text-base leading-relaxed text-[var(--color-ink)]/80">{body}</p>
    </div>
  );
}
```

Note: annotations in `data/camps.ts` use `[data-anno="canvas"]` on the Image wrapper and `[data-anno="inspector"]` — per camp, ensure the two selectors exist inside the container (adjust spans per camp if QA shows misalignment).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- BaseCamp`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/camps/BaseCamp.tsx components/camps/__tests__/BaseCamp.test.tsx
git commit -m "feat: base camp with sticky media plate, scroll steps, field recordings"
```

---

### Task 11: Ledger + End of Trail sections

**Files:**
- Create: `components/ledger/Ledger.tsx`
- Create: `components/EndOfTrail.tsx`
- Test: `components/ledger/__tests__/Ledger.test.tsx`

**Interfaces:**
- Consumes: `ledgerRepos`, `writing` (Task 4).
- Produces: `<Ledger />` and `<EndOfTrail />` (compact bio, contact, FAQ retention, colophon).

- [ ] **Step 1: Write the failing test**

```tsx
// components/ledger/__tests__/Ledger.test.tsx
import { render, screen } from '@testing-library/react';
import { Ledger } from '../Ledger';

describe('Ledger', () => {
  it('renders every repo as a row with a real link', () => {
    render(<Ledger />);
    expect(screen.getAllByRole('link', { name: /github\.com\/kanishka-namdeo/i }).length).toBeGreaterThanOrEqual(10);
    expect(screen.getByText('Unown')).toBeInTheDocument();
    expect(screen.getByText('the-pokemon-journey')).toBeInTheDocument();
  });
  it('renders writing entries', () => {
    render(<Ledger />);
    expect(screen.getByText(/MCP File Search That Actually Works/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- Ledger`
Expected: FAIL

- [ ] **Step 3: Implement Ledger**

```tsx
// components/ledger/Ledger.tsx
import { ledgerRepos, writing } from '@/data/ledger';

export function Ledger() {
  return (
    <section id="ledger" aria-labelledby="ledger-title" className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 id="ledger-title" className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">THE LEDGER — everything else, plainly</h2>
        <ul className="mt-8 divide-y divide-[var(--color-inkline)]">
          {ledgerRepos.map((r) => (
            <li key={r.name}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 hover:bg-white/50">
                <span className="font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-rust)]">{r.name}</span>
                <span className="font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]/75">{r.oneLiner}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">{r.language} · {r.year}</span>
              </a>
            </li>
          ))}
        </ul>
        <h3 className="mt-14 font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">FIELD WRITING</h3>
        <ul className="mt-4 divide-y divide-[var(--color-inkline)]">
          {writing.map((w) => (
            <li key={w.url}>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 hover:bg-white/50">
                <span className="font-[family-name:var(--font-voice)] text-sm text-[var(--color-ink)]">{w.title}</span>
                <span className="font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">{w.date} · {w.readTime}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement EndOfTrail** — concrete implementation (imports the existing `ContactFAQ`, which stays and gets restyled in Task 14):

```tsx
// components/EndOfTrail.tsx
import ContactFAQ from '@/components/ContactFAQ';

export function EndOfTrail() {
  return (
    <section id="contact" aria-labelledby="eot-title" className="border-t border-[var(--color-inkline)] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-[family-name:var(--font-data)] text-xs tracking-[0.2em] text-[var(--color-rust)]">END OF THE TRAIL</p>
        <h2 id="eot-title" className="mt-2 font-[family-name:var(--font-voice)] text-4xl font-bold text-[var(--color-ink)]">
          The next waypoint could be yours.
        </h2>
        <p className="mt-6 max-w-2xl font-[family-name:var(--font-voice)] text-lg leading-relaxed text-[var(--color-ink)]/85">
          I’m Kanishka — a technical product manager from Dubai who has shipped autonomous boats, logistics platforms,
          patent-search NLP, and agent pipelines. I build products that scale and write the code that proves it. 9+ years,
          10× ARR, and still committing to main. Open to new roles — Dubai or remote.
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          <a href="mailto:hello@kanishkanamdeo.com" className="border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm font-bold text-[var(--color-parchment)] hover:shadow-[3px_3px_0_var(--color-rust)]">Email me</a>
          <a href="https://www.linkedin.com/in/kanishkanamdeo" target="_blank" rel="noopener noreferrer" className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)]">LinkedIn</a>
          <a href="https://github.com/kanishka-namdeo" target="_blank" rel="noopener noreferrer" className="border border-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-data)] text-sm text-[var(--color-ink)] hover:shadow-[3px_3px_0_var(--color-inkline)]">GitHub</a>
        </div>
        <div className="mt-14">
          <ContactFAQ />
        </div>
        <p className="mt-16 border-t border-[var(--color-inkline)] pt-6 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/50">
          Set in Crimson Pro & JetBrains Mono. Contours drawn with simplex noise, committed as SVG. Built by hand in Next.js. No stock photos were used — every image is the work.
        </p>
      </div>
    </section>
  );
}
```

(Verify the LinkedIn URL from the existing About/Footer component and the real email address from `StickyCTA.tsx` before committing — the copy above is the launch text.)

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test -- Ledger`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/ledger/Ledger.tsx components/EndOfTrail.tsx components/ledger/__tests__/Ledger.test.tsx
git commit -m "feat: ledger index and end-of-trail contact section"
```

---

### Task 12: Remotion field recordings

**Files:**
- Create: `remotion/index.ts` (register composition)
- Create: `remotion/FieldRecording.tsx` (shared template: screenshot pan/zoom + mono captions + timestamp)
- Create: `remotion/compositions/agent-canvas.tsx`, `remotion/compositions/pi-dash.tsx`, `remotion/compositions/thetell.tsx`
- Create: `scripts/render-recordings.mjs`
- Generated (committed): `public/recordings/{agent-canvas,pi-dash,thetell}.mp4` + `.jpg` posters

**Interfaces:**
- Consumes: screenshots in `public/projects/`.
- Produces: MP4s + posters matching `data/camps.ts` paths (`/recordings/*.mp4`, `/recordings/*.jpg`).

- [ ] **Step 1: Shared composition template**

```tsx
// remotion/FieldRecording.tsx
import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, staticFile } from 'remotion';

export const FPS = 30;

export function FieldRecording({
  screenshot, title, caption, durationInFrames, framesPerBeat,
}: { screenshot: string; title: string; caption: string; durationInFrames: number; framesPerBeat: number }) {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const beat = Math.floor(frame / framesPerBeat);
  return (
    <AbsoluteFill style={{ backgroundColor: '#2E281E', padding: 40 }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile(screenshot)} style={{ width: '100%', transform: `scale(${zoom})`, transformOrigin: '40% 40%' }} />
      </AbsoluteFill>
      <Sequence from={0}>
        <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'monospace', color: '#F3EDE2', background: 'rgba(46,40,30,0.75)', padding: '4px 10px', fontSize: 18 }}>
          ● REC — {title}
        </div>
      </Sequence>
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, fontFamily: 'monospace', color: '#F3EDE2', fontSize: 20 }}>
        {String(beat).padStart(2, '0')} — {caption}
      </div>
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: One composition per camp** — each file exports a component using `FieldRecording` with its screenshot, title, and a 10s duration (300 frames at FPS 30, `framesPerBeat: 75` for 4 captions). Register in `remotion/index.ts`:

```ts
import { registerRoot, Composition } from 'remotion';
import { AgentCanvasRecording } from './compositions/agent-canvas';
import { PiDashRecording } from './compositions/pi-dash';
import { TheTellRecording } from './compositions/thetell';
import { FPS } from './FieldRecording';

registerRoot(() => (
  <>
    <Composition id="agent-canvas" component={AgentCanvasRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
    <Composition id="pi-dash" component={PiDashRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
    <Composition id="thetell" component={TheTellRecording} durationInFrames={300} fps={FPS} width={1280} height={720} />
  </>
));
```

- [ ] **Step 3: Render script + run**

```js
// scripts/render-recordings.mjs — run manually after committing compositions
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('public/recordings', { recursive: true });
const camps = ['agent-canvas', 'pi-dash', 'thetell'];
for (const id of camps) {
  execSync(`npx remotion render remotion/index.ts ${id} public/recordings/${id}.mp4 --codec=h264`, { stdio: 'inherit' });
  execSync(`npx remotion still remotion/index.ts ${id} public/recordings/${id}.jpg --frame=30 --image-format=jpeg`, { stdio: 'inherit' });
}
```

Run: `node scripts/render-recordings.mjs`
Expected: 3 MP4s + 3 JPGs in `public/recordings/`, each MP4 < 2 MB (if over, add `--crf=30` and/or lower width to 960).

- [ ] **Step 4: Verify size budget & commit**

```bash
ls -la public/recordings/
git add remotion/ scripts/render-recordings.mjs public/recordings/
git commit -m "feat: remotion field recordings rendered at build time (3 loops + posters)"
```

---

### Task 13: Page assembly — Journey section + Hero + progress rail

**Files:**
- Create: `components/journey/Journey.tsx` (assembles chapters; hosts the shared `scrollYProgress`)
- Rewrite: `components/Hero.tsx`
- Create: `components/TrailProgress.tsx`
- Modify: `app/page.tsx` (new assembly; keep FAQPage + breadcrumb JSON-LD)

**Interfaces:**
- Consumes: everything above.
- Produces: final page order: `<Hero /> → <Journey /> → <BaseCamps /> → <Ledger /> → <EndOfTrail />` plus fixed `<TrailProgress />`.

- [ ] **Step 1: Journey section** — wraps `ExpeditionMap` (sticky top) + chapters:

```tsx
// components/journey/Journey.tsx
'use client';

import { useRef, useState } from 'react';
import { useScroll, useSpring } from 'motion/react';
import { eras } from '@/data/journey';
import { ExpeditionMap } from '../map/ExpeditionMap';
import { JourneyChapter } from './JourneyChapter';

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  // active chapter tracking via scroll position is done with IntersectionObserver
  // on era sections; desktop keeps the map sticky beside the chapters.
  return (
    <section id="journey" ref={ref} aria-label="The journey" className="relative">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[minmax(0,420px)_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-24">
            <ExpeditionMap activeId={activeId} />
            <p className="mt-3 font-[family-name:var(--font-data)] text-[11px] text-[var(--color-ink)]/60">
              The trail draws itself as you travel. Click a waypoint to jump.
            </p>
          </div>
        </div>
        <div>
          {eras.map((era) => <JourneyChapter key={era.id} era={era} active={activeId === era.id} />)}
        </div>
      </div>
      {/* mobile: static vertical timeline — chapters already stack; line comes from CSS */}
    </section>
  );
}
```

Add `IntersectionObserver` in `Journey` (one effect, `rootMargin: '-45% 0px -45% 0px'`, observing `[data-era]` sections) setting `activeId` — implement directly in this file; mobile shows the same chapters with a left border line via a `md:hidden` wrapper class.

- [ ] **Step 2: Hero** — full-viewport parchment, title "Kanishka Namdeo — a field log, 2016 → present", the `ExpeditionMap` (reduced height variant `aspect-[16/9] max-h-[70vh]`), CTA "Follow the trail" scrolling to `#era-origin`, availability as plain text: "Open to new roles — Dubai / remote". No stat row. Delete `ParticleMesh` usage and the picsum background.

- [ ] **Step 3: TrailProgress** — fixed right-edge rail:

```tsx
// components/TrailProgress.tsx
'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { ExpeditionMapMini } from './map/ExpeditionMap';
import { useLenis } from 'lenis/react';
import { eras } from '@/data/journey';

export function TrailProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const lenis = useLenis();
  return (
    <nav aria-label="Trail progress" className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <ExpeditionMapMini progress={progress as unknown as number} />
      <ul className="mt-2 space-y-1">
        {eras.map((e) => (
          <li key={e.id}>
            <button onClick={() => lenis?.scrollTo(`#era-${e.id}`)} className="font-[family-name:var(--font-data)] text-[10px] text-[var(--color-ink)]/60 hover:text-[var(--color-rust)]">
              {e.number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Assemble page.tsx** — keep `faqSchema`/`breadcrumbSchema` (update breadcrumb names to new sections), render the five movements + `<TrailProgress />`.

- [ ] **Step 5: Verify manually**

Run: `pnpm dev` → walk the page: hero map, scroll-drawn trail, chapters with counters, camps, ledger, contact. Check mobile at 390px: chapters stack with a left timeline line, map hidden (replaced by chapter headers), no pinned scenes.

- [ ] **Step 6: Commit**

```bash
git add components/journey/Journey.tsx components/Hero.tsx components/TrailProgress.tsx app/page.tsx
git commit -m "feat: assemble dispatches page — hero, journey, camps, ledger, end of trail"
```

---

### Task 14: Cleanup — delete superseded code and styles

**Files:**
- Delete: `components/Experience.tsx`, `components/Showcase.tsx`, `components/ParticleMesh.tsx`, `components/ThemeToggle.tsx`, `components/StickyCTA.tsx`, `components/BackToTop.tsx`, `components/ScrollNav.tsx`, `components/SmoothScrollInit.tsx`, `components/Navigation.tsx`, `components/About.tsx`, `components/Footer.tsx` (colophon replaces), `components/ui/Skeleton.tsx`, `components/ui/EmptyState.tsx`. **Keep and restyle `components/ContactFAQ.tsx`** (imported by `EndOfTrail.tsx`): swap its card classes to `border-[var(--color-ink)]/20 bg-white/60`, remove any hard-shadow/gradient classes.
- Delete: `app/styles/hero.css`, `app/styles/showcase.css`, `app/styles/about.css`, `app/styles/scroll-nav.css`, `app/styles/sticky-cta.css`, `app/styles/navigation.css` and their `@import` lines in `app/globals.css`
- Delete: `data/product-media-data.ts`
- Modify: tests that referenced deleted components (remove those test files)

- [ ] **Step 1: Delete files + imports; run grep**

```bash
grep -rn "picsum\|ParticleMesh\|ThemeToggle\|StickyCTA\|ScrollNav\|embla" app components --include="*.tsx" --include="*.css" --include="*.ts"
```
Expected: no matches.

- [ ] **Step 2: Full test + build**

Run: `pnpm test && pnpm type-check && pnpm build`
Expected: all PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove superseded components, styles, and placeholder imagery pipeline"
```

---

### Task 15: Playwright smoke + accessibility + reduced-motion

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/dispatches.spec.ts`

**Interfaces:**
- Consumes: dev server. Produces: e2e gate for CI.

- [ ] **Step 1: Config**

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3457' },
  webServer: { command: 'pnpm dev --port 3457', port: 3457, reuseExistingServer: true, timeout: 60_000 },
});
```

- [ ] **Step 2: Tests**

```ts
// e2e/dispatches.spec.ts
import { test, expect } from '@playwright/test';

test('no horizontal overflow at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('trail rail and all five waypoint anchors exist', async ({ page }) => {
  await page.goto('/');
  for (const id of ['era-origin', 'era-logistics', 'era-language', 'era-mobility', 'era-agents']) {
    expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test('reduced motion shows full content (counters at final value)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.getByText('ARR').scrollIntoViewIfNeeded();
  await expect(page.getByRole('img', { name: /10× ARR/ })).toBeVisible();
});

test('no stock imagery anywhere', async ({ page }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).not.toContain('picsum');
});
```

- [ ] **Step 3: Run and fix**

Run: `npx playwright test`
Expected: all pass (fix overflow offenders by constraining widths; iterate until green).

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e/
git commit -m "test: e2e smoke — overflow, waypoints, reduced motion, no placeholder imagery"
```

---

### Task 16: Performance verification & final polish

**Files:**
- Modify: whatever the audit flags (images, video attrs, CSS)

- [ ] **Step 1: Lighthouse run**

Run: `pnpm build && pnpm start`, then Lighthouse (mobile) on `/`.
Expected: LCP < 2.5s, CLS < 0.1, TBT < 300ms. Common fixes if missed: confirm `preload="none"` on all 3 videos, confirm below-fold images lazy (next/image default), confirm `contours.svg` < 200 KB, `content-visibility: auto` on Ledger section.

- [ ] **Step 2: Content QA against anti-AI rules**

Walk the page and verify: no picsum; no purple/blue gradients; no pulse dots; no stat-row template; counters have receipts; copy reads first-person; colophon present.

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "polish: performance and content QA pass for dispatches launch"
```

---

## Self-Review Notes

**Web-research verification (2026-09-14, against current official docs):**
- Lenis: `<ReactLenis root options={{ anchors: { offset: -80 }, syncTouch: false }}>` — `anchors` accepts scrollTo options incl. offset (github.com/darkroomengineering/lenis); `syncTouch` smooths touch only when enabled (off = native mobile scroll, as intended).
- Motion: `useInView(ref, { once: true, margin })` and `pathLength` on `motion.path` are documented in motion.dev/docs/react-use-in-view and /react-motion-component. If the installed v13 TS type rejects `%` in `margin`, switch to px equivalents (e.g. `'-120px 0px'`) — behavior unchanged.
- Remotion: `npx remotion render <entry> <id> <out> --codec=h264 [--crf]` and `npx remotion still <entry> <id> <out> --frame --image-format=jpeg` match remotion.dev/docs/cli/render.
- Tailwind 4: `font-[family-name:var(--font-voice)]` is the documented explicit form (tailwindcss.com/docs/font-family); `font-(--voice)` is the v4 shorthand — either works.
- Spec/plan reconciliation: spec §7 updated to the hook-based annotation architecture and inline postcards (no `AnnotationLayer`/`PressPostcard` components) — fewer files, and the hook approach is what the rough-notation research supports.

**Spec coverage:** map (T5, T6), hero (T13), journey+counters+postcards (T3, T7, T8, T13), camps+annotations+recordings (T4, T9, T10, T12), ledger (T4, T11), end of trail + colophon (T11), progress rail (T13), tokens/fonts/grain (T2), guardrails (T15 reduced-motion test), performance budgets (T12 size checks, T16). About/FAQ retained in compact form inside EndOfTrail (schema stays in page.tsx).

**Known judgment calls during execution:**
- The `JourneyChapter`/`BaseCamp` tests mock `motion/react` — verify mock shape matches installed v13 exports during implementation; adjust mocks, not production code.
- Copy in `data/journey.ts` is the launch copy — editing is expected but keep every metric's receipt.
- Verify the LinkedIn URL and email from the existing About/Footer/StickyCTA before shipping EndOfTrail.

---

## Post-launch additions (2026-09-14)

Everything above shipped and was reviewed. This section records the scrollytelling
elements added afterwards, correlated against the spec's four story elements
(§2 of the spec: scroll-driven narrative · Remotion moment · live project media ·
motion microinteractions). Research basis: scrollytelling.ai's six design patterns
(sticky figure, scrubbed sequence, step triggers, staged reveals, parallax, WebGL)
and Emil Kowalski's motion guidance ("parallax fits one establishing scene at most";
"never animate keyboard-initiated actions"; animations usually < 300ms).

1. **Travelling "you are here" marker** (strengthens the scroll-driven narrative).
   A ringed marker rides the SVG trail, positioned by `path.getPointAtLength()`
   each frame — with the hero's load draw it travels 2016→2026; in the journey it
   tracks scroll progress, so the map is literally where you are. Positioned by
   direct DOM writes (a state update per frame would re-render every pin).
   Reduced motion: parked at the destination, no ride.
2. **Contour parallax depth** (one establishing scene). The contour layer drifts
   ±1.6% against the trail and pins as the hero scrolls away — depth without a
   second parallax instance anywhere else, and disabled under reduced motion.
3. **Rail readout + keyboard travel** (motion microinteractions, a11y).
   The progress rail now shows `03 / 05 · Medulla.AI · en route` with
   `aria-live="polite"`, marks the active button with `aria-current`, and
   supports ↑/↓/Home/End to travel between waypoints — jumps are **instant**
   (`lenis.scrollTo(..., { immediate: true })`) per the no-animation-on-keyboard
   rule. Active-era tracking moved to `hooks/useActiveEra.ts`, shared with Journey.
4. **Horizontal Field Writing strip** (variety against the vertical page).
   The Ledger's article list became a scroll-snapped horizontal strip of dispatch
   cards with a keyboard-focusable, labeled scroller — the researched
   horizontal-panel pattern used where it fits (a short, browsable set), not for
   body copy.

Deliberately NOT added: scroll-velocity skew (no authoritative endorsement; risks
gimmick), auto-marquee tickers (banned by the anti-AI rules), a second parallax
scene, and WebGL (out of scope for a field-log aesthetic). A before/after
comparison slider remains a candidate for a future case study — it needs a real
before/after asset pair, which we do not have.

### Interaction & easter-egg layer (same date, second pass)

5. **Waypoint jumper (⌘K / Ctrl+K, or `/`)** — `components/WaypointPalette.tsx`: a
   filterable dialog over every destination (5 waypoints, 3 camps, ledger,
   contact, 4 articles). Arrow keys + Enter travel, Esc closes, focus is restored
   on close, and it is announced as a real `dialog` with `listbox`/`option` roles.
   Opens from anywhere; a "⌘K jump" button on the rail opens it for mouse users
   via a window event (`OPEN_PALETTE_EVENT`). Ignored while typing in a field.
6. **Completion easter egg** — `components/FieldNote.tsx` + `hooks/useVisitedEras.ts`:
   travelling all five waypoints (each era counted once it becomes active,
   persisted in `sessionStorage`) surfaces a hidden taped field note at the End
   of the Trail — the Pokémon-tribute repo, framed as "the first thing I ever
   shipped". Storage is read after mount to keep SSR/CSR identical.
7. **Rail readout grows up**: a live `NN% of the trail` (honest, derived from
   `scrollYProgress`) and the ⌘K trigger, alongside the era readout.
8. **Press-clipping lift**: postcards straighten and rise 2px on hover/focus with
   a "read the piece ↗" reveal — 150ms `ease-out`, paper-like, no layout shift.

Deliberately NOT added: a second keyboard overlay (the palette footer documents
both key sets), cursor-following gimmicks, sounds, and any fake "distance
travelled" numbers — readouts stay honest or they don't ship.
