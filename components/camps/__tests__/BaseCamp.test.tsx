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
});
