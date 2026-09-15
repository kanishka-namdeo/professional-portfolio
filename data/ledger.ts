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
  subtitle: string;
  image: string;
  date: string;
  readTime: string;
  url: string;
}

export const ledgerRepos: LedgerRepo[] = [
  { name: 'yfnhanced-mcp', oneLiner: 'MCP server for Yahoo Finance data with circuit breaker, rate limiting, and caching — published as an npm package', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/yfnhanced-mcp' },
  { name: 'Unown', oneLiner: 'A coding agent that gets better with use.', language: 'TypeScript', year: '2026', url: 'https://github.com/kanishka-namdeo/Unown' },
  { name: 'the-pokemon-journey', oneLiner: 'A tribute to the franchise that shaped my childhood.', language: 'HTML', year: '2026', url: 'https://github.com/kanishka-namdeo/the-pokemon-journey' },
  { name: 'coding-plan-proxy', oneLiner: 'HTTP proxy for AI coding APIs, with a TUI dashboard.', language: 'Python', year: '2026', url: 'https://github.com/kanishka-namdeo/coding-plan-proxy' },
  { name: 'everything-search-mcp', oneLiner: 'MCP server: instant file search on Windows/macOS/Linux.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/everything-search-mcp' },
  { name: 'electron-mcp', oneLiner: 'MCP server for Electron testing and automation.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/electron-mcp' },
  { name: 'cursor-learning-harness', oneLiner: 'Records AI coding sessions and improves agent behavior over time.', language: 'Python', year: '2025', url: 'https://github.com/kanishka-namdeo/cursor-learning-harness' },
  { name: 'instructify', oneLiner: 'Cursor IDE configuration for AI coding agents.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/instructify' },
  { name: 'Twin', oneLiner: 'AI meeting assistant in Rust; runs locally.', language: 'Rust', year: '2025', url: 'https://github.com/kanishka-namdeo/Twin' },
  { name: 'rust-sim', oneLiner: 'A fast simulation framework for experiments.', language: 'Rust', year: '2026', url: 'https://github.com/kanishka-namdeo/rust-sim' },
  { name: 'social-beam', oneLiner: 'Full-stack social platform with AI agents and real-time aggregation.', language: 'TypeScript', year: '2025', url: 'https://github.com/kanishka-namdeo/social-beam' },
];

export const writing: WritingEntry[] = [
  { title: 'MCP File Search That Actually Works (Everywhere)', subtitle: 'Leveraging native OS search engines for instant, secure AI-assisted file retrieval.', image: 'https://miro.medium.com/v2/resize:fit:853/1*5MH6GGh-ul4SEBJRHrB5ew.png', date: 'Jan 2026', readTime: '8 min', url: 'https://kanishkanamdeo.medium.com/mcp-file-search-that-actually-works-everywhere-d139a33dfcb1' },
  { title: 'Vibe Coding (and not losing my mind)', subtitle: 'Building a RAG workbench with LLMs — structured prompting and iterative refinement.', image: 'https://miro.medium.com/v2/resize:fit:763/1*x7SGMqRoEXbLNOS0lvit1w.png', date: 'Dec 2025', readTime: '10 min', url: 'https://kanishkanamdeo.medium.com/vibe-coding-and-not-losing-my-mind-ac175f123155' },
  { title: 'Writing A Simple Kivy-based CPU-Monitoring App in Python!', subtitle: 'Cross-platform CPU monitor with Kivy, psutil, and threaded UI updates.', image: 'https://miro.medium.com/v2/resize:fit:940/1*17Opc8jL-LfE8R4SS56L-g.jpeg', date: 'Apr 2020', readTime: '7 min', url: 'https://kanishkanamdeo.medium.com/writing-a-simple-kivy-based-cpu-monitoring-app-in-python-74e1a7e872' },
  { title: 'My Experiments with Elementary OS: Part 1', subtitle: 'Customizing Elementary OS — multiple docks, TLP for battery, and touchpad gestures.', image: 'https://miro.medium.com/v2/resize:fit:1200/1*QzfDfSzsPYYB-QMEDBQ2gA.png', date: 'Apr 2020', readTime: '6 min', url: 'https://kanishkanamdeo.medium.com/my-experiments-with-elementary-os-part-1-4a2e81777101' },
];
