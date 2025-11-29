import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { debounce } from './06-debounce.ts';
// import debounce from 'lodash/debounce';

const search = (value?: string) => {
  return {
    query: value,
    len: value?.length,
  };
};

describe('debounce', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.clearAllTimers();
  });

  test('debounced function return the same structure as the original', () => {
    const searchDebounced = debounce(search, 1000);

    const result = search('result regular');
    const resultDebounced = searchDebounced('result debounced');

    expect(result).toEqual({ query: 'result regular', len: 14 });
    expect(resultDebounced).toEqual(undefined);

    vi.advanceTimersByTime(1100);
    const resultDebouncedNew = searchDebounced('result debounced new');
    expect(resultDebouncedNew).toEqual({ query: 'result debounced', len: 16 });
  });
});
