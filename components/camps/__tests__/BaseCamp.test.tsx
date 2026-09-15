import { render, screen } from '@testing-library/react';
import { BaseCamp } from '../BaseCamp';
import { camps } from '@/data/camps';

const mockReduceMotion = jest.fn(() => true);
jest.mock('motion/react', () => ({
  useInView: () => true,
  useReducedMotion: () => mockReduceMotion(),
  motion: new Proxy({}, { get: (_, tag) => tag === 'path' ? 'path' : (props: Record<string, unknown>) => <div {...props} /> }),
}));
jest.mock('@/hooks/useRoughAnnotation', () => ({ useRoughAnnotation: jest.fn() }));

/** Stub matchMedia for a given viewport class (jest.setup defaults to matches:false). */
function mockViewport({ desktop }: { desktop: boolean }) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: desktop && query.includes('min-width: 768'),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

describe('BaseCamp', () => {
  beforeEach(() => {
    mockViewport({ desktop: false });
  });

  it('renders real screenshot (next/image) with alt text, no remote placeholders', () => {
    render(<BaseCamp camp={camps[0]} />);
    // next/image rewrites src through its loader — assert on the resolved path, not exact equality
    const src = screen.getByAltText(/AgentCanvas/i).getAttribute('src') ?? '';
    expect(decodeURIComponent(src)).toContain('/projects/agent-canvas.png');
  });
  it('renders annotation labels pinned to the screenshot regions', () => {
    render(<BaseCamp camp={camps[0]} />);
    expect(screen.getByText(/agents are nodes/i)).toHaveAttribute('data-anno', 'canvas');
    expect(screen.getByText('typed ports: every join is checked')).toBeInTheDocument();
  });
  it('does not autoplay under reduced motion — poster with a play control instead', () => {
    render(<BaseCamp camp={camps[0]} />);
    const video = screen.getByTestId('camp-recording');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('poster', '/recordings/agent-canvas.jpg');
    expect(screen.getByRole('button', { name: 'Play recording: AgentCanvas' })).toBeInTheDocument();
  });
  it('autoplays a silent looped recording on desktop without reduced motion', () => {
    mockReduceMotion.mockReturnValue(false);
    mockViewport({ desktop: true });
    render(<BaseCamp camp={camps[0]} />);
    const video = screen.getByTestId('camp-recording');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).toHaveAttribute('poster', '/recordings/agent-canvas.jpg');
    expect(screen.queryByRole('button', { name: /play recording/i })).not.toBeInTheDocument();
    // autoplaying content must stay pausable (WCAG 2.2.2)
    expect(screen.getByRole('button', { name: 'Pause recording: AgentCanvas' })).toBeInTheDocument();
  });
  it('renders all steps as readable text', () => {
    render(<BaseCamp camp={camps[0]} />);
    expect(screen.getByText(/Agent workflows live in YAML files/i)).toBeInTheDocument();
  });
  it('renders the camp title as a heading so camps appear in the heading outline', () => {
    render(<BaseCamp camp={camps[0]} />);
    expect(screen.getByRole('heading', { level: 2, name: /base camp — agentcanvas/i })).toBeInTheDocument();
  });
  it('never fades inactive step text below the accessible dim token', () => {
    render(<BaseCamp camp={camps[0]} />);
    // Regression guard for the WCAG 1.4.3 fix: the dim state must be the
    // --color-ink-muted token — never opacity on the <li> (which stacks on
    // text and dropped it to 2.28-2.90:1), and no ink alpha below /70 on
    // step text (light theme fails 4.5:1 below that).
    for (const li of document.querySelectorAll('ol[aria-label] > li[data-step]')) {
      expect(li.className).not.toContain('opacity-');
    }
    const stepTexts = Array.from(document.querySelectorAll('ol[aria-label] p, ol[aria-label] h3'));
    const stepCount = document.querySelectorAll('ol[aria-label] > li[data-step]').length;
    expect(stepTexts.length).toBe(stepCount * 3); // label + h3 + body per step
    for (const el of stepTexts) {
      expect(el.className).toMatch(/text-\[var\(--color-ink(-muted)?\)\]/);
      expect(el.className).not.toMatch(/text-\[var\(--color-ink\)\]\/[1-6]\d/);
    }
  });
});
