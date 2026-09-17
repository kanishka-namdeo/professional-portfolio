// data/camps.ts
export interface CampStep {
  heading: string;
  body: string;
  /** Index into camp.media — the artifact staged while this step is active. */
  mediaIndex: number;
}
export interface CampAnnotation {
  /** CSS selector inside the stage's active media layer, e.g. '[data-anno="ac-canvas"]'.
   * Names must be unique across the whole camp (not just one media item) or
   * querySelector can anchor a mark to a dying crossfade layer. */
  selector: string;
  note: string;
  /** Label position as a percentage of the media box (edge-aware anchoring in
   * BaseCamp keeps labels inside the plate: x < 50 anchors left, else right). */
  pos: { x: number; y: number };
}
export interface CampMedia {
  /** 'still' = a photograph of the product (PLATE) or a frame pulled from the
   * recording (FR-xx); 'recording' = the field recording itself. */
  kind: 'still' | 'recording';
  /** Artifact label on the stage slate + filmstrip: PLATE, FR-02…, REC. */
  frame: string;
  /** Short slate line — doubles as the lightbox caption. */
  note: string;
  alt: string;
  /** still: image src; recording: video src. */
  src: string;
  /** recording only: poster frame (also the filmstrip thumbnail). */
  poster?: string;
  /** recording only: full length in seconds, shown on the slate (00:52). */
  duration?: number;
  /** recording only: seconds [start, end) looped while the recording is staged
   * by its step — the money moment stays on screen for the whole step. */
  chapter?: [number, number];
  /** Intrinsic pixels — drives the letterbox mat inside the 16:9 stage so the
   * box is reserved before load (zero CLS) and annotations anchor to the media,
   * never to the letterbox bars. */
  width: number;
  height: number;
  annotations: CampAnnotation[];
}

export interface Camp {
  id: string;
  repo: string;
  title: string;
  tagline: string;
  repoUrl: string;
  stack: string[];
  year: string;
  steps: CampStep[];
  /** Ordered archive: the PLATE first, FR-xx frames from the recording, and
   * the recording LAST (the stage rests on it before and after the story). */
  media: CampMedia[];
}

export const camps: Camp[] = [
  {
    id: 'agent-canvas',
    repo: 'AgentCanvas',
    title: 'AgentCanvas',
    tagline: 'Your agentic designer — prompt it, and agents build on canvas.',
    repoUrl: 'https://github.com/kanishka-namdeo/AgentCanvas',
    stack: ['TypeScript', 'Next.js', 'Socket.IO', 'Prisma'],
    year: '2026',
    steps: [
      { heading: 'What I saw', body: 'Design requests live in chat threads nobody can revisit. AgentCanvas makes the conversation a surface: the agent builds directly on a canvas you can point at.', mediaIndex: 0 },
      { heading: 'The call', body: 'The agent doesn’t just answer — it edits the design: frames, text, color, auto-layout. Every tool call lands where you can see it, and a self-review closes the run.', mediaIndex: 1 },
      { heading: 'The payoff', body: 'Describe a screen in plain English, watch it get built, then keep editing — it’s a real canvas, not a render.', mediaIndex: 3 },
    ],
    media: [
      {
        kind: 'still', frame: 'PLATE', note: 'the design surface',
        alt: 'AgentCanvas — the design canvas with the layers and properties inspector',
        src: '/projects/agent-canvas.webp', width: 1280, height: 577,
        annotations: [
          { selector: '[data-anno="ac-canvas"]', note: 'the design surface — the agent builds here', pos: { x: 16, y: 72 } },
          { selector: '[data-anno="ac-inspector"]', note: 'layers & properties — every element editable', pos: { x: 87, y: 12 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-02', note: 'agent mid-run',
        alt: 'AgentCanvas — the agent mid-run, building the banner through tool calls',
        src: '/recordings/agent-canvas-fr-02.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="ac-run"]', note: 'the agent at work — tool calls land live', pos: { x: 12, y: 84 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-03', note: 'run complete',
        alt: 'AgentCanvas — run complete: the banner on the canvas, self-reviewed',
        src: '/recordings/agent-canvas-fr-03.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="ac-result"]', note: 'the built banner — self-reviewed, no defects', pos: { x: 35, y: 44 } },
        ],
      },
      {
        kind: 'recording', frame: 'REC', note: 'a real agent run, filmed end to end',
        alt: 'AgentCanvas field recording — a real agent run, filmed end to end',
        src: '/recordings/agent-canvas.mp4', poster: '/recordings/agent-canvas.jpg',
        duration: 52, chapter: [40.5, 47.8], width: 1280, height: 720,
        annotations: [],
      },
    ],
  },
  {
    id: 'pi-dash',
    repo: 'pi-dash',
    title: 'pi-dash',
    tagline: 'Many agents, one surface.',
    repoUrl: 'https://github.com/kanishka-namdeo/pi-dash',
    stack: ['TypeScript', 'React', 'Electron', 'xterm.js'],
    year: '2026',
    steps: [
      { heading: 'What hurt', body: 'Running five agents means five terminals, five logs, five places to lose the thread.', mediaIndex: 0 },
      { heading: 'The shape', body: 'One dashboard owns state and monitoring; agents stay disposable, the surface stays put.', mediaIndex: 1 },
      { heading: 'The result', body: 'Spawn, watch and steer every agent from one screen.', mediaIndex: 3 },
    ],
    media: [
      {
        kind: 'still', frame: 'PLATE', note: 'the fleet dashboard',
        alt: 'pi-dash — the agent fleet dashboard with live terminals',
        src: '/projects/pi-dash.webp', width: 2560, height: 1600,
        annotations: [
          { selector: '[data-anno="pd-agents"]', note: 'live agents at a glance', pos: { x: 25, y: 25 } },
          { selector: '[data-anno="pd-timeline"]', note: 'run history — what happened, and when', pos: { x: 70, y: 70 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-02', note: 'command palette',
        alt: 'pi-dash — the command palette fuzzy-searching the dashboard',
        src: '/recordings/pi-dash-fr-02.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="pd-palette"]', note: 'Ctrl+K — the whole dashboard, one query away', pos: { x: 12, y: 80 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-03', note: 'worktrees',
        alt: 'pi-dash — an agent committing to its own git worktree branch',
        src: '/recordings/pi-dash-fr-03.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="pd-worktree"]', note: 'every agent on its own branch', pos: { x: 86, y: 12 } },
        ],
      },
      {
        kind: 'recording', frame: 'REC', note: 'the fleet, live — launch, steer, review',
        alt: 'pi-dash field recording — launch, steer and review the agent fleet',
        src: '/recordings/pi-dash.mp4', poster: '/recordings/pi-dash.jpg',
        duration: 34, chapter: [8, 22], width: 1280, height: 720,
        annotations: [],
      },
    ],
  },
  {
    id: 'thetell',
    repo: 'thetell',
    title: 'thetell',
    tagline: 'Corporate intelligence: two agents in debate over 25+ signal sources.',
    repoUrl: 'https://github.com/kanishka-namdeo/thetell',
    stack: ['TypeScript', 'Next.js', 'Neo4j', 'LlamaIndex'],
    year: '2025',
    steps: [
      { heading: 'What broke', body: 'A single model reading the news is a single point of failure — confident and wrong.', mediaIndex: 0 },
      { heading: 'The design', body: 'Two agents argue. A graph database (Neo4j) holds the claims, LlamaIndex retrieves the signals, and every conclusion carries a confidence score.', mediaIndex: 1 },
      { heading: 'What you see', body: 'Corporate intelligence where every claim carries the debate that produced it.', mediaIndex: 3 },
    ],
    media: [
      {
        kind: 'still', frame: 'PLATE', note: 'the debate desk',
        alt: 'thetell — the debate desk with scored agent arguments',
        src: '/projects/thetell.webp', width: 2560, height: 1440,
        annotations: [
          { selector: '[data-anno="tt-debate"]', note: 'the debate: two agents argue, scores settle it', pos: { x: 35, y: 30 } },
          { selector: '[data-anno="tt-graph"]', note: 'claims live in Neo4j, scored', pos: { x: 75, y: 65 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-02', note: 'claims cluster',
        alt: 'thetell — claims clustering with momentum and signal counts',
        src: '/recordings/thetell-fr-02.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="tt-clusters"]', note: 'claims cluster — momentum settles as evidence piles up', pos: { x: 50, y: 87 } },
        ],
      },
      {
        kind: 'still', frame: 'FR-03', note: 'the debate',
        alt: 'thetell — the debate desk: two agents arguing with scored calls',
        src: '/recordings/thetell-fr-03.webp', width: 1280, height: 720,
        annotations: [
          { selector: '[data-anno="tt-exchange"]', note: 'Analyst vs Gossip Girl — every call scored', pos: { x: 10, y: 55 } },
        ],
      },
      {
        kind: 'recording', frame: 'REC', note: 'two agents argue the tape — every call scored',
        alt: 'thetell field recording — signals, clusters and the debate',
        src: '/recordings/thetell.mp4', poster: '/recordings/thetell.jpg',
        duration: 39, chapter: [26, 34], width: 1280, height: 720,
        annotations: [],
      },
    ],
  },
];
