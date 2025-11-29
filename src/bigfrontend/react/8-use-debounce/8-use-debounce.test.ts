// @vitest-environment jsdom

import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from './8-use-debounce.ts';

describe('useDebounce', () => {
  test('useDebounce works as expected', () => {
    const hook = renderHook(
      ({ val }: { val: number }) => {
        return useDebounce(val, 1000);
      },
      { initialProps: { val: 1 } },
    );

    expect(hook.result.current).toEqual(1);
  });
});
