import { describe, test, expect } from 'vitest';
import { binarySearch } from './00-binary-search';

describe('binary search', () => {
  test('works well for sorted arrays', () => {
    expect(binarySearch([0, 1, 2, 2, 2, 2, 3, 4], (el) => el === 2)).toEqual(2);
  });
});
