// components/journey/__tests__/JourneyChapter.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { JourneyChapter } from '../JourneyChapter';
import { eras } from '@/data/journey';

describe('JourneyChapter', () => {
  it('renders the three story beats and section id', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    render(<JourneyChapter era={mobility} active={false} />);
    expect(document.getElementById('era-mobility')).toBeInTheDocument();
    expect(screen.getByText(/terrain/i)).toBeInTheDocument();
    expect(screen.getByText(/crossing/i)).toBeInTheDocument();
    expect(screen.getByText(/summit/i)).toBeInTheDocument();
  });
  it('renders press receipts as real links', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    render(<JourneyChapter era={mobility} active={false} />);
    // first press entry is the featured clipping, always visible
    const link = screen.getByRole('link', { name: /Mobility Outlook/i });
    expect(link).toHaveAttribute('href', 'https://www.mobilityoutlook.com/features/how-moveinsync-is-redefining-corporate-transport-in-india/');
  });
  it('features the first press mention and folds the tail behind a toggle', () => {
    const mobility = eras.find((e) => e.id === 'mobility')!;
    render(<JourneyChapter era={mobility} active={false} />);
    const pressLinks = () => screen.getAllByRole('link').filter((a) => a.getAttribute('target') === '_blank');
    // mobility has 6 receipts → 1 featured + 5 tail rows, 3 visible collapsed
    expect(screen.getByRole('button', { name: /\+2 more clippings/i })).toHaveAttribute('aria-expanded', 'false');
    expect(pressLinks()).toHaveLength(4); // featured + 3 visible tail rows
    fireEvent.click(screen.getByRole('button', { name: /\+2 more clippings/i }));
    expect(pressLinks()).toHaveLength(6); // all receipts unfolded
    expect(screen.getByRole('button', { name: /– fold back/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
