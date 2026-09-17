// components/journey/__tests__/CaseStudyDossier.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CaseStudyDossier } from '../CaseStudyDossier';

const mockStop = jest.fn();
const mockStart = jest.fn();
// Stable instance: useLenis is called on every render; stop/start must pair up.
const mockLenis = { stop: mockStop, start: mockStart };
jest.mock('lenis/react', () => ({ useLenis: () => mockLenis }));

function renderDossier() {
  // The dossier loads its document + renderer lazily on first open (they must
  // not sit in the home page's critical chunk), so tests await the async load.
  return render(
    <CaseStudyDossier href="/case-study/rentlz" label="Read the full RentLz case study" />,
  );
}

async function openDossier() {
  fireEvent.click(screen.getByRole('link', { name: /read the full rentlz case study/i }));
  await waitFor(() =>
    expect(screen.getByRole('dialog', { name: /scaling corporate mobility/i })).toBeInTheDocument(),
  );
}

describe('CaseStudyDossier', () => {
  beforeEach(() => {
    mockStop.mockClear();
    mockStart.mockClear();
    document.body.style.overflow = '';
  });

  it('renders the chapter stamp as a real link with the route href', () => {
    renderDossier();
    const link = screen.getByRole('link', { name: /read the full rentlz case study/i });
    expect(link).toHaveAttribute('href', '/case-study/rentlz');
    expect(link).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the dossier in-page instead of navigating, and stops the page scroll', async () => {
    renderDossier();
    // The scroll lock engages on open, before the lazy document arrives.
    fireEvent.click(screen.getByRole('link', { name: /read the full rentlz case study/i }));

    const dialog = await screen.findByRole('dialog', { name: /scaling corporate mobility/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(mockStop).toHaveBeenCalled();
    expect(mockStart).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('hidden');
    // The full document renders: header + every section heading + closing.
    await waitFor(() => expect(screen.getAllByText(/executive summary/i).length).toBeGreaterThan(0));
    expect(screen.getByText(/field lessons & what came next/i)).toBeInTheDocument();
  });

  it('closes on Escape, restarts Lenis, and un-clips the body', async () => {
    renderDossier();
    await openDossier();
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockStart).toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('closes via the close button and returns focus to the stamp link', async () => {
    renderDossier();
    const link = screen.getByRole('link', { name: /read the full rentlz case study/i });
    // jsdom's fireEvent.click doesn't move focus the way a real click does.
    link.focus();
    fireEvent.click(link);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(link).toHaveFocus());
  });

  // ── Regression: the dead-dialog bug ────────────────────────────────────
  // Clicking the article's non-focusable text parks focus on a focusable
  // ancestor OUTSIDE the dialog; keydowns then never bubble through the
  // dialog div. Escape and Tab must still work — handled at document level
  // while open. (Live-verified before the fix: a reader who clicked a
  // paragraph was locked in a scroll-frozen page with a dead Escape key.)

  it('closes on Escape even when focus has left the panel (clicked text parked it outside)', async () => {
    renderDossier();
    await openDossier();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(mockStart).toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('sweeps forward Tab back into the panel when focus sits outside it', async () => {
    renderDossier();
    await openDossier();
    const close = screen.getByRole('button', { name: /close/i });
    close.blur(); // park focus on <body>, the click-on-text aftermath
    fireEvent.keyDown(document.body, { key: 'Tab' });
    // Forward Tab from outside must re-enter the panel at its first focusable
    // (the close button) — never leak past the panel into the background.
    await waitFor(() => expect(close).toHaveFocus());
  });

  it('sweeps Shift+Tab back into the panel when focus sits outside it', async () => {
    renderDossier();
    await openDossier();
    const close = screen.getByRole('button', { name: /close/i });
    close.blur();
    fireEvent.keyDown(document.body, { key: 'Tab', shiftKey: true });
    await waitFor(() => expect(close).toHaveFocus());
  });

  it('reclaims focus that lands outside the panel while open', async () => {
    renderDossier();
    await openDossier();
    const close = screen.getByRole('button', { name: /close/i });
    close.blur();
    // focusin firing on an outside element (what an inert-less browser does
    // when a background click steals focus) must be reclaimed into the panel.
    fireEvent.focusIn(document.body);
    await waitFor(() => expect(close).toHaveFocus());
  });

  it('inerts the page behind the panel while open, and restores it on close', async () => {
    const { container } = renderDossier();
    await openDossier();
    expect(container.hasAttribute('inert')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(container.hasAttribute('inert')).toBe(false));
  });

  it('keeps the article panel wheel-scrollable: data-lenis-prevent + overscroll containment', async () => {
    // Regression: a stopped Lenis preventDefaults every wheel event unless it
    // starts inside a data-lenis-prevent element — without the attribute the
    // whole case study was unscrollable by mouse wheel while open.
    renderDossier();
    await openDossier();
    const panel = screen.getByRole('dialog').querySelector('[data-lenis-prevent]');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass('overscroll-contain');
  });
});
