// components/__tests__/WaypointPalette.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WaypointPalette } from '../WaypointPalette';

const mockScrollTo = jest.fn();
jest.mock('lenis/react', () => ({ useLenis: () => ({ scrollTo: mockScrollTo }) }));

function openWithCtrlK() {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
}

describe('WaypointPalette', () => {
  beforeEach(() => mockScrollTo.mockClear());

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

  it('travels to the selected waypoint with Enter and closes', () => {
    render(<WaypointPalette />);
    openWithCtrlK();
    fireEvent.change(screen.getByRole('textbox', { name: /search destinations/i }), {
      target: { value: 'medulla' },
    });
    fireEvent.keyDown(screen.getByRole('textbox', { name: /search destinations/i }), { key: 'Enter' });
    expect(mockScrollTo).toHaveBeenCalledWith('#era-language');
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
      </>
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'notes' }), { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
