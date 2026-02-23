import { describe, test, expect } from 'vitest';
import { getMaxSubSum, getMaxSubSumOn } from './05-get-max-sub-sum';

describe('Get max. sub-array sum', () => {
  describe('getMaxSubSum', () => {
    test('it works correctly', () => {
      expect(getMaxSubSum([-1, 2, 3, -9])).eq(5); // [2, 3]
      expect(getMaxSubSum([2, -1, 2, 3, -9])).eq(6); // [2, -1, 2, 3]
      expect(getMaxSubSum([-1, 2, 3, -9, 11])).eq(11); // [11]
      expect(getMaxSubSum([-2, -1, 1, 2])).eq(3); // [1, 2]
      expect(getMaxSubSum([100, -9, 2, -3, 5])).eq(100); // [100]
      expect(getMaxSubSum([1, 2, 3])).eq(6); // [1, 2, 3]
      expect(getMaxSubSum([-1, -2, -3])).eq(-1); // [-1]
      expect(getMaxSubSum([])).eq(0); // []
    });
  });

  describe('getMaxSubSumOn', () => {
    test('it works correctly', () => {
      expect(getMaxSubSumOn([-1, 2, 3, -9])).eq(5); // [2, 3]
      expect(getMaxSubSumOn([2, -1, 2, 3, -9])).eq(6); // [2, -1, 2, 3]
      expect(getMaxSubSumOn([-1, 2, 3, -9, 11])).eq(11); // [11]
      expect(getMaxSubSumOn([-2, -1, 1, 2])).eq(3); // [1, 2]
      expect(getMaxSubSumOn([100, -9, 2, -3, 5])).eq(100); // [100]
      expect(getMaxSubSumOn([1, 2, 3])).eq(6); // [1, 2, 3]
      expect(getMaxSubSumOn([-1, -2, -3])).eq(-1); // [-1]
      expect(getMaxSubSum([])).eq(0); // []
    });
  });
});
