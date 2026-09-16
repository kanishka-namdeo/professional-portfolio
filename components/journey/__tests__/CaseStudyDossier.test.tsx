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
});
