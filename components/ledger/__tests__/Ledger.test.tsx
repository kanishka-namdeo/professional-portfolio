// components/ledger/__tests__/Ledger.test.tsx
import { render, screen } from '@testing-library/react';
import { Ledger } from '../Ledger';

describe('Ledger', () => {
  it('renders every repo as a row with a real link', () => {
    render(<Ledger />);
    expect(screen.getAllByRole('link', { name: /github\.com\/kanishka-namdeo/i }).length).toBeGreaterThanOrEqual(10);
    expect(screen.getByText('Unown')).toBeInTheDocument();
    expect(screen.getByText('the-pokemon-journey')).toBeInTheDocument();
  });
  it('renders writing entries', () => {
    render(<Ledger />);
    expect(screen.getByText(/MCP File Search That Actually Works/i)).toBeInTheDocument();
  });
});
