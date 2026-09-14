// components/__tests__/FieldNote.test.tsx
import { render, screen } from '@testing-library/react';
import { FieldNote } from '../FieldNote';

const mockComplete = jest.fn();
jest.mock('@/hooks/useVisitedEras', () => ({
  useTrailComplete: () => mockComplete(),
}));

describe('FieldNote (completion easter egg)', () => {
  it('is hidden until every era has been travelled', () => {
    mockComplete.mockReturnValue(false);
    render(<FieldNote />);
    expect(screen.queryByLabelText(/hidden field note/i)).not.toBeInTheDocument();
  });

  it('surfaces with the Pokémon-journey receipt once the trail is complete', () => {
    mockComplete.mockReturnValue(true);
    render(<FieldNote />);
    const note = screen.getByLabelText(/hidden field note/i);
    expect(note).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /the-pokemon-journey/i })).toHaveAttribute(
      'href',
      'https://github.com/kanishka-namdeo/the-pokemon-journey'
    );
    expect(note).toHaveTextContent(/most people stop at the first waypoint/i);
  });
});
