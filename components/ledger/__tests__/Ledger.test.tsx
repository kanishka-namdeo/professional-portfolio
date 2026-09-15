// components/ledger/__tests__/Ledger.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
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
  it('renders writing entries with subtitles and images', () => {
    const { container } = render(<Ledger />);
    expect(screen.getByText(/MCP File Search That Actually Works/i)).toBeInTheDocument();
    expect(screen.getByText(/native OS search engines/i)).toBeInTheDocument();
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });
  it('scrolls the writing strip with arrow keys when focused', () => {
    render(<Ledger />);
    const strip = screen.getByRole('list', { name: /field writing/i });
    // jsdom doesn't implement Element.prototype.scrollBy — stub the methods
    // on the element so the handler's calls are observable.
    const scrollBy = jest.fn();
    const scrollTo = jest.fn();
    Object.defineProperty(strip, 'scrollBy', { value: scrollBy, configurable: true });
    Object.defineProperty(strip, 'scrollTo', { value: scrollTo, configurable: true });
    fireEvent.keyDown(strip, { key: 'ArrowRight' });
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: expect.any(Number) }));
    fireEvent.keyDown(strip, { key: 'Home' });
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: 0 }));
  });
});
