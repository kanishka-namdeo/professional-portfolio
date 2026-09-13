import { renderHook } from '@testing-library/react';
import { useRoughAnnotation } from '../useRoughAnnotation';

const show = jest.fn();
const hide = jest.fn();
jest.mock('rough-notation', () => ({
  annotate: jest.fn(() => ({ show, hide })),
}));

function createContainer() {
  const container = document.createElement('div');
  for (const name of ['a', 'b', 'c']) {
    const el = document.createElement('span');
    el.setAttribute('data-anno', name);
    container.append(el);
  }
  return container;
}

const SELECTORS = ['[data-anno="a"]', '[data-anno="b"]', '[data-anno="c"]'];

const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 0)); // let dynamic import settle

describe('useRoughAnnotation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows annotations up to the current step and hides the rest', async () => {
    const containerRef = { current: createContainer() };
    renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 1, enabled: true })
    );

    await flushAsync();
    expect(show).toHaveBeenCalled();
    expect(hide).toHaveBeenCalled();
  });

  it('hides all annotations on unmount', async () => {
    const containerRef = { current: createContainer() };
    const { unmount } = renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 1, enabled: true })
    );

    await flushAsync();
    unmount();
    // 1 hide before unmount (index 2 > step 1) + cleanup hides all 3 instances
    expect(hide).toHaveBeenCalledTimes(4);
  });

  it('does nothing when disabled', async () => {
    const containerRef = { current: createContainer() };
    renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 1, enabled: false })
    );

    await flushAsync();
    expect(show).not.toHaveBeenCalled();
    expect(hide).not.toHaveBeenCalled();
  });
});
