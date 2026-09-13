// components/journey/__tests__/JourneyChapter.test.tsx
import { render, screen } from '@testing-library/react';
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
    const link = screen.getByRole('link', { name: /Impakter/i });
    expect(link).toHaveAttribute('href', 'https://impakter.com/indian-startup-moveinsync-pioneers-intelligent-commutes-across-the-globe/');
  });
});
