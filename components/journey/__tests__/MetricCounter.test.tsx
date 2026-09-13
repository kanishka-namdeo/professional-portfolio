import { render, screen } from '@testing-library/react';
import { MetricCounter } from '../MetricCounter';

describe('MetricCounter', () => {
  it('renders the final value in initial HTML (no-JS readable)', () => {
    const { container } = render(<MetricCounter value={10} suffix="×" label="ARR" />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('ARR')).toBeInTheDocument();
  });
  it('exposes final value to screen readers even while animating', () => {
    render(<MetricCounter value={70} suffix="K+" label="monthly users" />);
    expect(screen.getByRole('img', { name: '70K+ monthly users' })).toBeInTheDocument();
  });
});
