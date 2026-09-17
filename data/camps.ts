// data/camps.ts
export interface CampStep {
  heading: string;
  body: string;
}
export interface CampAnnotation {
  /** CSS selector inside the screenshot container, e.g. '[data-anno="nodes"]' */
  selector: string;
  note: string;
  /** Label position as a percentage of the screenshot box (translate -50% centered). */
  pos: { x: number; y: number };
}
export interface Camp {
  id: string;
  repo: string;
  title: string;
  tagline: string;
  screenshot: string;
  /** Intrinsic pixel size of the screenshot file — the <Image> box must match
   * it or the browser re-layouts on load (CLS) under h-auto w-full. */
  screenshotWidth: number;
  screenshotHeight: number;
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
    tagline: 'Your agentic designer — prompt it, and agents build on canvas.',
    screenshot: '/projects/agent-canvas.webp',
    screenshotWidth: 1280,
    screenshotHeight: 577,
    repoUrl: 'https://github.com/kanishka-namdeo/AgentCanvas',
    stack: ['TypeScript', 'Next.js', 'Socket.IO', 'Prisma'],
    year: '2026',
    steps: [
      { heading: 'What I saw', body: 'Design requests live in chat threads nobody can revisit. AgentCanvas makes the conversation a surface: the agent builds directly on a canvas you can point at.' },
      { heading: 'The call', body: 'The agent doesn’t just answer — it edits the design: frames, text, color, auto-layout. Every tool call lands where you can see it, and a self-review closes the run.' },
      { heading: 'The payoff', body: 'Describe a screen in plain English, watch it get built, then keep editing — it’s a real canvas, not a render.' },
    ],
    annotations: [
      { selector: '[data-anno="canvas"]', note: 'the design surface — the agent builds here', pos: { x: 20, y: 80 } },
      { selector: '[data-anno="inspector"]', note: 'layers & properties — every element editable', pos: { x: 76, y: 24 } },
    ],
    recording: { src: '/recordings/agent-canvas.mp4', poster: '/recordings/agent-canvas.jpg', caption: 'A real agent run, filmed end to end.' },
  },
  {
    id: 'pi-dash',
    repo: 'pi-dash',
    title: 'pi-dash',
    tagline: 'Many agents, one surface.',
    screenshot: '/projects/pi-dash.webp',
    screenshotWidth: 2560,
    screenshotHeight: 1600,
    repoUrl: 'https://github.com/kanishka-namdeo/pi-dash',
    stack: ['TypeScript', 'React', 'Electron', 'xterm.js'],
    year: '2026',
    steps: [
      { heading: 'What hurt', body: 'Running five agents means five terminals, five logs, five places to lose the thread.' },
      { heading: 'The shape', body: 'One dashboard owns state and monitoring; agents stay disposable, the surface stays put.' },
      { heading: 'The result', body: 'Spawn, watch and steer every agent from one screen.' },
    ],
    annotations: [
      { selector: '[data-anno="agents"]', note: 'live agents at a glance', pos: { x: 25, y: 25 } },
      { selector: '[data-anno="timeline"]', note: 'run history — what happened, and when', pos: { x: 70, y: 70 } },
    ],
    recording: { src: '/recordings/pi-dash.mp4', poster: '/recordings/pi-dash.jpg', caption: 'The fleet, live — launch, steer, review.' },
  },
  {
    id: 'thetell',
    repo: 'thetell',
    title: 'thetell',
    tagline: 'Corporate intelligence: two agents in debate over 25+ signal sources.',
    screenshot: '/projects/thetell.webp',
    screenshotWidth: 2560,
    screenshotHeight: 1440,
    repoUrl: 'https://github.com/kanishka-namdeo/thetell',
    stack: ['TypeScript', 'Next.js', 'Neo4j', 'LlamaIndex'],
    year: '2025',
    steps: [
      { heading: 'What broke', body: 'A single model reading the news is a single point of failure — confident and wrong.' },
      { heading: 'The design', body: 'Two agents argue. A graph database (Neo4j) holds the claims, LlamaIndex retrieves the signals, and every conclusion carries a confidence score.' },
      { heading: 'What you see', body: 'Corporate intelligence where every claim carries the debate that produced it.' },
    ],
    annotations: [
      { selector: '[data-anno="debate"]', note: 'the debate: two agents argue, scores settle it', pos: { x: 35, y: 30 } },
      { selector: '[data-anno="graph"]', note: 'claims live in Neo4j, scored', pos: { x: 75, y: 65 } },
    ],
    recording: { src: '/recordings/thetell.mp4', poster: '/recordings/thetell.jpg', caption: 'Two agents argue the tape — every call scored.' },
  },
];
