import { fireEvent, render, screen } from '@testing-library/react';
import { BaseCamp } from '../BaseCamp';
import { camps } from '@/data/camps';

const mockReduceMotion = jest.fn(() => true);
const mockInView = jest.fn(() => true);
jest.mock('motion/react', () => ({
  useInView: (...args: unknown[]) => mockInView(...(args as [])),
  useReducedMotion: () => mockReduceMotion(),
  // AnimatePresence renders children directly; motion.* become plain divs.
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: new Proxy({}, { get: (_, tag) => tag === 'path' ? 'path' : (props: Record<string, unknown>) => <div {...props} /> }),
}));
jest.mock('@/hooks/useRoughAnnotation', () => ({ useRoughAnnotation: jest.fn() }));

/** jsdom does not implement <dialog> modality — stub the two entry points. */
beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  }
});

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

beforeEach(() => {
  mockInView.mockReturnValue(true);
});

/** Hover a step into activation (the story drives the stage). */
function hoverStep(index: number) {
  fireEvent.mouseEnter(document.querySelector(`ol > li[data-step="${index}"]`) as HTMLElement);
}

describe('BaseCamp', () => {
  beforeEach(() => {
    mockViewport({ desktop: false });
  });

  it('stages the plate (next/image) with alt text when step 1 activates', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    // useInView is mocked true, so the steps' effects race to the LAST step on
    // mount — activating step 1 reclaims the stage for the plate.
    hoverStep(0);
    const src = screen.getByAltText(/AgentCanvas/i).getAttribute('src') ?? '';
    expect(decodeURIComponent(src)).toContain('/projects/agent-canvas.webp');
  });
  it('renders annotation labels pinned to the staged plate regions', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    hoverStep(0);
    expect(screen.getByText(/the agent builds here/i)).toHaveAttribute('data-anno', 'ac-canvas');
    expect(screen.getByText('layers & properties — every element editable')).toBeInTheDocument();
  });
  it('rests on the recording before the story starts (showreel-first stage)', () => {
    // No step ever activates (useInView false everywhere): the stage must sit
    // on the field recording, exactly as the server renders it.
    mockInView.mockReturnValue(false);
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    expect(screen.getByTestId('camp-recording')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Field recording/i })).toHaveAttribute('aria-current', 'true');
  });
  it('does not autoplay under reduced motion — poster with a play control instead', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    const video = screen.getByTestId('camp-recording');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('poster', '/recordings/agent-canvas.jpg');
    // Intrinsic 1280x720 (poster size) so the browser reserves the box pre-metadata (CLS).
    expect(video).toHaveAttribute('width', '1280');
    expect(video).toHaveAttribute('height', '720');
    expect(screen.getByRole('button', { name: 'Play recording: AgentCanvas' })).toBeInTheDocument();
  });
  it('creates annotations once — useInView fires with once:true so re-entries never re-animate the marks', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    expect(mockInView).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ once: true, margin: '-20% 0px' })
    );
  });
  it('autoplays a silent looped recording on desktop without reduced motion', () => {
    mockReduceMotion.mockReturnValue(false);
    mockViewport({ desktop: true });
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
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
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    expect(screen.getByText(/Design requests live in chat threads/i)).toBeInTheDocument();
  });
  it('renders the camp title as a heading so camps appear in the heading outline', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    expect(screen.getByRole('heading', { level: 2, name: /base camp — agentcanvas/i })).toBeInTheDocument();
  });
  it('never fades inactive step text below the accessible dim token', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
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

  // ── media-first contracts ────────────────────────────────────────────
  it('stages each step\u2019s media as the story activates', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    hoverStep(0);
    expect(decodeURIComponent(screen.getByAltText(/design canvas with the layers/i).getAttribute('src') ?? '')).toContain('/projects/agent-canvas.webp');
    hoverStep(1);
    expect(decodeURIComponent(screen.getByAltText(/mid-run/i).getAttribute('src') ?? '')).toContain('/recordings/agent-canvas-fr-02.webp');
    hoverStep(2);
    expect(screen.getByTestId('camp-recording')).toBeInTheDocument();
  });
  it('keeps the recording mounted while a still is staged — no decoder churn mid-scroll', () => {
    // Remounting a <video> per stage swap forced the browser to rebuild its
    // decoder mid-scroll (a whole-screen flicker + jank trigger). The recording
    // layer must stay mounted under the crossfading stills, but go INERT and
    // hidden from assistive tech while a still owns the stage — the hidden
    // play/pause button must not become a ghost tab stop.
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    hoverStep(0);
    const video = screen.getByTestId('camp-recording');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/recordings/agent-canvas.mp4');
    expect(video).toHaveAttribute('poster', '/recordings/agent-canvas.jpg');
    const layer = video.closest('div[class*="inset-1.5"], [inert]');
    expect(layer?.hasAttribute('inert')).toBe(true);
    expect(layer?.getAttribute('aria-hidden')).toBe('true');
    // And the still really owns the stage.
    expect(screen.getByAltText(/design canvas with the layers/i)).toBeInTheDocument();
  });
  it('restores the recording layer to interactivity when it re-takes the stage', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    hoverStep(0);
    hoverStep(2); // the recording is camp[0] step 3's media
    const layer = screen.getByTestId('camp-recording').closest('div[class*="inset-1.5"], [inert]');
    expect(layer?.hasAttribute('inert')).toBe(false);
    expect(layer?.getAttribute('aria-hidden')).not.toBe('true');
  });
  it('activates a step on focus, not just hover (keyboard drives the stage)', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    fireEvent.focus(document.querySelector('ol > li[data-step="0"]') as HTMLElement);
    expect(screen.getByAltText(/design canvas with the layers/i)).toBeInTheDocument();
  });
  it('lists every artifact on the filmstrip and marks the staged one', () => {
    render(<BaseCamp camp={camps[1]} index={1} total={3} />);
    const strip = screen.getByRole('list', { name: /pi-dash — media/i });
    const thumbs = strip.querySelectorAll('button');
    expect(thumbs.length).toBe(camps[1].media.length);
    expect(screen.getAllByText('PLATE').length).toBeGreaterThan(0);
    expect(screen.getByText('FR-02')).toBeInTheDocument();
    expect(screen.getByText('FR-03')).toBeInTheDocument();
    expect(screen.getByText('REC')).toBeInTheDocument();
    const active = strip.querySelector('button[aria-current="true"]');
    expect(active).toBeTruthy();
    expect(active?.textContent).toContain('REC');
  });
  it('selecting a filmstrip frame stages it and lines the step text up with it', () => {
    render(<BaseCamp camp={camps[1]} index={1} total={3} />);
    fireEvent.click(screen.getByRole('button', { name: /FR-03 — worktrees/i }));
    expect(decodeURIComponent(screen.getByAltText(/worktree branch/i).getAttribute('src') ?? '')).toContain('/recordings/pi-dash-fr-03.webp');
    // FR-03 is un-referenced by steps; the nearest earlier step (The shape) highlights.
    const headings = Array.from(document.querySelectorAll('ol h3'));
    expect(headings[1].className).toContain('text-[var(--color-ink)]');
    expect(headings[2].className).toContain('text-[var(--color-ink-muted)]');
  });
  it('the story reclaims the stage after a filmstrip detour', () => {
    render(<BaseCamp camp={camps[1]} index={1} total={3} />);
    fireEvent.click(screen.getByRole('button', { name: /FR-03 — worktrees/i }));
    hoverStep(2);
    expect(screen.getByTestId('camp-recording')).toBeInTheDocument();
  });
  it('enlarge opens a dialog lightbox of the staged media with a close control', () => {
    render(<BaseCamp camp={camps[0]} index={0} total={3} />);
    hoverStep(0);
    fireEvent.click(screen.getByRole('button', { name: /Enlarge AgentCanvas PLATE/i }));
    const dialog = document.querySelector('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText(/PLATE — the design surface · AgentCanvas/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(dialog).not.toHaveAttribute('open');
  });
  it('renders the catalog line for the expedition archive', () => {
    render(<BaseCamp camp={camps[2]} index={2} total={3} />);
    expect(screen.getByText(/BC-03\/03 · 4 ARTIFACTS/i)).toBeInTheDocument();
  });
});
