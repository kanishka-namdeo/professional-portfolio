import { render, screen } from '@testing-library/react';
import { BaseCamp } from '../BaseCamp';
import { camps } from '@/data/camps';

jest.mock('motion/react', () => ({
  useInView: () => true,
  useReducedMotion: () => true,
  motion: new Proxy({}, { get: (_, tag) => tag === 'path' ? 'path' : (props: Record<string, unknown>) => <div {...props} /> }),
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
