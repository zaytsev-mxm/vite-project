// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrevious } from './5-use-previous.ts';

describe('usePrevious', () => {
  test('returns previous value', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => usePrevious(value),
      { initialProps: { value: 1 } },
    );

    expect(result.current).toEqual(undefined);
    rerender({ value: 2 });
    expect(result.current).toEqual(1);
    rerender({ value: 3 });
    expect(result.current).toEqual(2);
  });
});
