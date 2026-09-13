// components/ledger/__tests__/Ledger.test.tsx
import { render, screen } from '@testing-library/react';
import { Ledger } from '../Ledger';

describe('Ledger', () => {
  it('renders every repo as a row with a real link', () => {
    render(<Ledger />);
    const repoLinks = screen.getAllByRole('link').filter(
      (a) => (a as HTMLAnchorElement).href.startsWith('https://github.com/kanishka-namdeo/')
    );
    expect(repoLinks.length).toBeGreaterThanOrEqual(10);
    expect(screen.getByText('Unown')).toBeInTheDocument();
    expect(screen.getByText('the-pokemon-journey')).toBeInTheDocument();
  });
  it('renders writing entries', () => {
    render(<Ledger />);
    expect(screen.getByText(/MCP File Search That Actually Works/i)).toBeInTheDocument();
  });
});
