import { act, renderHook } from '@testing-library/react';
import { useRoughAnnotation } from '../useRoughAnnotation';
import { annotate } from 'rough-notation';

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

  afterEach(() => {
    jest.restoreAllMocks();
    document.documentElement.className = '';
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

  // Theme-leak regression: the stroke color must come from the live
  // --color-rust token at creation time, not a hardcoded day-rust hex that
  // disappears on dark surfaces.
  it('reads the live --color-rust token at creation time', async () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ getPropertyValue: () => '#3366AA' } as unknown as CSSStyleDeclaration);
    const containerRef = { current: createContainer() };
    renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 0, enabled: true })
    );

    await flushAsync();
    expect(annotate).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ color: '#3366AA' })
    );
  });

  it('falls back to #8C4A2F when the token is unreadable (jsdom)', async () => {
    const containerRef = { current: createContainer() };
    renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 0, enabled: true })
    );

    await flushAsync();
    expect(annotate).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ color: '#8C4A2F' })
    );
  });

  it('re-creates annotations when the theme class flips on <html>', async () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ getPropertyValue: () => '#12AB34' } as unknown as CSSStyleDeclaration);
    const containerRef = { current: createContainer() };
    renderHook(() =>
      useRoughAnnotation({ container: containerRef, selectors: SELECTORS, step: 1, enabled: true })
    );

    await flushAsync();
    expect(annotate).toHaveBeenCalledTimes(3);

    // ThemeToggle toggles the `dark` class on documentElement; the MutationObserver
    // re-runs creation so the marks re-read the color token for the new theme.
    await act(async () => {
      document.documentElement.classList.add('dark');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await flushAsync();
    // 3 torn-down marks + 3 re-created ones (color re-read at creation time).
    expect(annotate).toHaveBeenCalledTimes(6);
    expect(annotate).toHaveBeenLastCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ color: '#12AB34' })
    );
  });
});
