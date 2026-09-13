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
