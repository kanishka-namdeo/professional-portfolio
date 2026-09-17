// components/__tests__/WaypointPalette.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { WaypointPalette, OPEN_PALETTE_EVENT } from '../WaypointPalette';

const mockScrollTo = jest.fn();
const mockStop = jest.fn();
const mockStart = jest.fn();
// Stable instance: useLenis is called on every render, and the component's
// open-effect must see the same object to avoid stop/start re-firing.
const mockLenis = { scrollTo: mockScrollTo, stop: mockStop, start: mockStart };
jest.mock('lenis/react', () => ({ useLenis: () => mockLenis }));

function openWithCtrlK() {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
}

function focusPaletteInput() {
  // The palette focuses its input in a requestAnimationFrame after paint;
  // jest.setup maps that to a 0ms timeout, so flush microtasks.
  return waitFor(() =>
    expect(screen.getByRole('combobox', { name: /search destinations/i })).toHaveFocus(),
  );
}

describe('WaypointPalette', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    mockStop.mockClear();
    mockStart.mockClear();
  });

  it('stays closed until the shortcut is pressed, then lists every destination', () => {
    render(<WaypointPalette />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openWithCtrlK();

    const dialog = screen.getByRole('dialog', { name: /jump to a waypoint/i });
    expect(dialog).toBeInTheDocument();
    // 5 waypoints + 3 camps + ledger + contact + 4 writing entries
    expect(screen.getAllByRole('option')).toHaveLength(14);
  });

  it('filters as you type', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('combobox', { name: /search destinations/i }), {
      target: { value: 'medulla' },
    });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Medulla.AI');
  });

  it('renders the empty state as presentation, not a phantom option', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('combobox', { name: /search destinations/i }), {
      target: { value: 'zzzz-no-such-waypoint' },
    });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText(/no destination matches/i)).toHaveAttribute('role', 'presentation');
  });

  it('travels to the selected waypoint with Enter and closes (instant, per the rail rule)', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('combobox', { name: /search destinations/i }), {
      target: { value: 'medulla' },
    });
    fireEvent.keyDown(screen.getByRole('combobox', { name: /search destinations/i }), { key: 'Enter' });
    expect(mockScrollTo).toHaveBeenCalledWith('#era-language', { immediate: true, offset: -80 });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.keyDown(screen.getByRole('combobox', { name: /search destinations/i }), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('ignores the shortcut while typing in a field', () => {
    render(
      <>
        <input aria-label="notes" />
        <WaypointPalette />
      </>,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'notes' }), { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lets Ctrl+K close the palette from its own input (the key that opened it)', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    await focusPaletteInput();
    fireEvent.keyDown(screen.getByRole('combobox', { name: /search destinations/i }), {
      key: 'k',
      ctrlKey: true,
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps Tab on the input: the modal is a single tab stop', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    const input = screen.getByRole('combobox', { name: /search destinations/i });
    await focusPaletteInput();
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveFocus();
    fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
    expect(input).toHaveFocus();
  });

  it('stops Lenis while open so the page behind can’t wheel-scroll, and resumes on close', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    await focusPaletteInput();
    expect(mockStop).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole('combobox', { name: /search destinations/i }), { key: 'Escape' });
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  // ── Regression: the dead-dialog bug ────────────────────────────────────
  // Clicking the dialog's non-focusable chrome (footer hint, list gutters)
  // parks focus on a focusable ancestor OUTSIDE the dialog; keydowns then
  // never bubble through the dialog div. Escape and Tab must still work —
  // handled at document level while open. (Live-verified before the fix.)

  it('closes on Escape even when focus has left the dialog (clicked chrome parked it outside)', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    // Keydown targets something outside the dialog div — before the fix the
    // React onKeyDown on the dialog never fired and the palette hung open.
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('reclaims Tab into the dialog when focus sits outside it', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    const input = screen.getByRole('combobox', { name: /search destinations/i });
    await focusPaletteInput();
    input.blur(); // park focus on <body>, the click-on-chrome aftermath
    fireEvent.keyDown(document.body, { key: 'Tab' });
    expect(input).toHaveFocus();
  });

  it('sweeps focus back into the dialog when it lands outside while open', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    const input = screen.getByRole('combobox', { name: /search destinations/i });
    await focusPaletteInput();
    // focusin firing on an outside element (what an inert-less browser does
    // when a background click steals focus) must be reclaimed.
    fireEvent.focusIn(document.body);
    await waitFor(() => expect(input).toHaveFocus());
  });

  it('inerts the page behind the dialog while open, and restores it on close', () => {
    const { container } = render(<WaypointPalette />);
    openWithCtrlK();
    expect(screen.getByRole('dialog', { name: /jump to a waypoint/i })).toBeInTheDocument();
    // The render container (standing in for the page) is a body child without
    // data-modal-dialog — it must be inert while the dialog is open.
    expect(container.hasAttribute('inert')).toBe(true);
    fireEvent.keyDown(screen.getByRole('combobox', { name: /search destinations/i }), { key: 'Escape' });
    expect(container.hasAttribute('inert')).toBe(false);
  });

  it('ignores open requests while another modal dialog holds the page (no stacking)', () => {
    render(<WaypointPalette />);
    // Stand in for the dossier: a div-based dialog mounted in the DOM.
    const dossier = document.createElement('div');
    dossier.setAttribute('data-modal-dialog', 'dossier');
    document.body.appendChild(dossier);
    try {
      act(() => {
        window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
      });
      expect(screen.queryByRole('dialog', { name: /jump to a waypoint/i })).not.toBeInTheDocument();
    } finally {
      dossier.remove();
    }
    // Once the other dialog is gone, the palette opens again.
    act(() => {
      window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
    });
    expect(screen.getByRole('dialog', { name: /jump to a waypoint/i })).toBeInTheDocument();
  });

  it('ignores the shortcut while a native lightbox dialog is open', () => {
    render(<WaypointPalette />);
    // Stand in for the camp lightbox: a native <dialog> that is ALWAYS in the
    // DOM — the guard must match it only in its open state.
    const lightbox = document.createElement('dialog');
    lightbox.setAttribute('data-modal-dialog', 'lightbox');
    lightbox.setAttribute('open', '');
    document.body.appendChild(lightbox);
    try {
      openWithCtrlK();
      expect(screen.queryByRole('dialog', { name: /jump to a waypoint/i })).not.toBeInTheDocument();
    } finally {
      lightbox.remove();
    }
    openWithCtrlK();
    expect(screen.getByRole('dialog', { name: /jump to a waypoint/i })).toBeInTheDocument();
  });
});
