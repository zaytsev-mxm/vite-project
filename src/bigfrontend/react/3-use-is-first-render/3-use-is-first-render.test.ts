// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsFirstRender } from './3-use-is-first-render.ts';

describe('useIsFirstRender', () => {
  it('returns true on initial render, then false after re-render', () => {
    const { result, rerender, unmount } = renderHook(() => useIsFirstRender());

    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(false);

    rerender();
    expect(result.current).toBe(false);

    unmount();

    const again = renderHook(() => useIsFirstRender());
    expect(again.result.current).toBe(true);
  });
});
