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
      { selector: '[data-anno="canvas"]', note: 'the design surface — agents are nodes', pos: { x: 20, y: 80 } },
      { selector: '[data-anno="inspector"]', note: 'typed ports: every join is checked', pos: { x: 76, y: 24 } },
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
      { selector: '[data-anno="agents"]', note: 'live agents at a glance', pos: { x: 25, y: 25 } },
      { selector: '[data-anno="timeline"]', note: 'run history — what happened, when, and why', pos: { x: 70, y: 70 } },
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
      { selector: '[data-anno="debate"]', note: 'the debate: two agents, one verdict', pos: { x: 35, y: 30 } },
      { selector: '[data-anno="graph"]', note: 'claims live in Neo4j, scored', pos: { x: 75, y: 65 } },
    ],
    recording: { src: '/recordings/thetell.mp4', poster: '/recordings/thetell.jpg', caption: 'Field recording — signal debate visualization.' },
  },
];
