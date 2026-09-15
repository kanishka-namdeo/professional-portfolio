// components/__tests__/WaypointPalette.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaypointPalette } from '../WaypointPalette';

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
    expect(screen.getByRole('textbox', { name: /search destinations/i })).toHaveFocus(),
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
    fireEvent.change(screen.getByRole('textbox', { name: /search destinations/i }), {
      target: { value: 'medulla' },
    });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Medulla.AI');
  });

  it('renders the empty state as presentation, not a phantom option', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('textbox', { name: /search destinations/i }), {
      target: { value: 'zzzz-no-such-waypoint' },
    });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText(/no destination matches/i)).toHaveAttribute('role', 'presentation');
  });

  it('travels to the selected waypoint with Enter and closes (instant, per the rail rule)', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('textbox', { name: /search destinations/i }), {
      target: { value: 'medulla' },
    });
    fireEvent.keyDown(screen.getByRole('textbox', { name: /search destinations/i }), { key: 'Enter' });
    expect(mockScrollTo).toHaveBeenCalledWith('#era-language', { immediate: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.keyDown(screen.getByRole('textbox', { name: /search destinations/i }), { key: 'Escape' });
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
    fireEvent.keyDown(screen.getByRole('textbox', { name: /search destinations/i }), {
      key: 'k',
      ctrlKey: true,
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps Tab on the input: the modal is a single tab stop', async () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    const input = screen.getByRole('textbox', { name: /search destinations/i });
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
    fireEvent.keyDown(screen.getByRole('textbox', { name: /search destinations/i }), { key: 'Escape' });
    expect(mockStart).toHaveBeenCalledTimes(1);
  });
});
