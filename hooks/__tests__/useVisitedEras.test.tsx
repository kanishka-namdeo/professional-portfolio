// hooks/__tests__/useVisitedEras.test.tsx
import type { ReactElement } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useVisitedEras, useTrailComplete } from '../useVisitedEras';

// Controllable active-era stand-in (jsdom's IntersectionObserver stub never
// fires, so the real useActiveEra would always report null). Assigning a new
// value only takes effect on the next render — the hook's effect keys on it.
let mockActiveId: string | null = null;
jest.mock('../useActiveEra', () => ({
  useActiveEra: () => mockActiveId,
}));

function Probe() {
  const visited = useVisitedEras();
  return (
    <ul>
      {[...visited].map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  );
}

function CompleteProbe() {
  const complete = useTrailComplete();
  return <p data-testid="complete">{complete ? 'yes' : 'no'}</p>;
}

describe('useVisitedEras', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
    mockActiveId = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /** Move the reader to `id` and re-render so the hook's effect sees it. */
  function travel(
    id: string | null,
    rerender: (ui: ReactElement) => void,
    ui: ReactElement = <Probe />,
  ) {
    mockActiveId = id;
    rerender(ui);
  }

  it('does not count an era that only became active (no dwell yet)', () => {
    const { rerender } = render(<Probe />);
    travel('origin', rerender);
    act(() => {
      jest.advanceTimersByTime(1400);
    });
    expect(screen.queryByText('origin')).not.toBeInTheDocument();
  });

  it('counts an era after ~1.5s of continuous active time', () => {
    const { rerender } = render(<Probe />);
    travel('origin', rerender);
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText('origin')).toBeInTheDocument();
  });

  it('cancels the dwell when the active era changes too soon', () => {
    const { rerender } = render(<Probe />);
    travel('origin', rerender);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Scroll on before 1.5s: the origin dwell is cancelled, the next era's
    // dwell starts fresh.
    travel('logistics', rerender);
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('origin')).not.toBeInTheDocument();
    expect(screen.getByText('logistics')).toBeInTheDocument();
  });

  it('restarts the dwell when an era is re-entered and left early', () => {
    const { rerender } = render(<Probe />);
    travel('origin', rerender);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    travel(null, rerender); // left before the dwell completed
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.queryByText('origin')).not.toBeInTheDocument();
    travel('origin', rerender); // came back — dwell starts over
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByText('origin')).toBeInTheDocument();
  });

  it('persists visited eras to sessionStorage', () => {
    const { rerender } = render(<Probe />);
    travel('agents', rerender);
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(JSON.parse(window.sessionStorage.getItem('dispatches:visited-eras') ?? '[]')).toEqual([
      'agents',
    ]);
  });

  it('adopts previously visited eras from sessionStorage on mount', () => {
    window.sessionStorage.setItem('dispatches:visited-eras', JSON.stringify(['origin', 'mobility']));
    render(<Probe />);
    expect(screen.getByText('origin')).toBeInTheDocument();
    expect(screen.getByText('mobility')).toBeInTheDocument();
  });

  it('useTrailComplete requires every era to be dwelled on', () => {
    const { rerender } = render(<CompleteProbe />);
    const eras = ['origin', 'logistics', 'language', 'mobility'];
    for (const era of eras) {
      travel(era, rerender, <CompleteProbe />);
      act(() => {
        jest.advanceTimersByTime(1500);
      });
    }
    expect(screen.getByTestId('complete')).toHaveTextContent('no');
    travel('agents', rerender, <CompleteProbe />);
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByTestId('complete')).toHaveTextContent('yes');
  });
});
