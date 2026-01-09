import { describe, it, expect } from 'vitest';
import { quickSort } from './01-quick-sort';

describe('quickSort', () => {
  describe('edge cases', () => {
    it('should return empty array for empty input', () => {
      expect(quickSort([])).toEqual([]);
    });

    it('should return same array for single element', () => {
      expect(quickSort([1])).toEqual([1]);
    });

    it('should return same array for single element (negative)', () => {
      expect(quickSort([-5])).toEqual([-5]);
    });

    it('should return same array for single element (zero)', () => {
      expect(quickSort([0])).toEqual([0]);
    });
  });

  describe('two elements', () => {
    it('should sort two elements in correct order', () => {
      expect(quickSort([2, 1])).toEqual([1, 2]);
    });

    it('should keep two elements already sorted', () => {
      expect(quickSort([1, 2])).toEqual([1, 2]);
    });

    it('should handle two equal elements', () => {
      expect(quickSort([5, 5])).toEqual([5, 5]);
    });

    it('should handle two negative elements', () => {
      expect(quickSort([-1, -5])).toEqual([-5, -1]);
    });
  });

  describe('multiple elements', () => {
    it('should sort already sorted array', () => {
      expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort reverse sorted array', () => {
      expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort randomly ordered array', () => {
      expect(quickSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([
        1, 1, 2, 3, 4, 5, 6, 9,
      ]);
    });

    it(
      'should sort array with three elements',
      () => {
        expect(quickSort([2, 7, 4, 1, 6, 5, 3])).toEqual([1, 2, 3, 4, 5, 6, 7]);
      },
      { timeout: 30 * 60 * 1000 },
    );
  });

  describe('duplicates', () => {
    it('should handle array with all same elements', () => {
      expect(quickSort([5, 5, 5, 5, 5])).toEqual([5, 5, 5, 5, 5]);
    });

    it('should handle array with multiple duplicates', () => {
      expect(quickSort([3, 1, 2, 1, 3, 2])).toEqual([1, 1, 2, 2, 3, 3]);
    });

    it('should handle array with duplicates at beginning', () => {
      expect(quickSort([1, 1, 1, 2, 3])).toEqual([1, 1, 1, 2, 3]);
    });

    it('should handle array with duplicates at end', () => {
      expect(quickSort([1, 2, 3, 3, 3])).toEqual([1, 2, 3, 3, 3]);
    });
  });

  describe('negative numbers', () => {
    it('should sort array with all negative numbers', () => {
      expect(quickSort([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
    });

    it('should sort array with mixed positive and negative', () => {
      expect(quickSort([3, -1, 4, -2, 0])).toEqual([-2, -1, 0, 3, 4]);
    });

    it('should sort array with negative and positive duplicates', () => {
      expect(quickSort([-1, 1, -1, 1, 0])).toEqual([-1, -1, 0, 1, 1]);
    });
  });

  describe('zeros', () => {
    it('should handle array with all zeros', () => {
      expect(quickSort([0, 0, 0, 0])).toEqual([0, 0, 0, 0]);
    });

    it('should handle array with zeros and positive numbers', () => {
      expect(quickSort([0, 3, 0, 1, 0])).toEqual([0, 0, 0, 1, 3]);
    });

    it('should handle array with zeros and negative numbers', () => {
      expect(quickSort([0, -3, 0, -1, 0])).toEqual([-3, -1, 0, 0, 0]);
    });
  });

  describe('floating point numbers', () => {
    it('should sort array with floating point numbers', () => {
      expect(quickSort([3.5, 1.2, 4.8, 2.1])).toEqual([1.2, 2.1, 3.5, 4.8]);
    });

    it('should sort array with mixed integers and floats', () => {
      expect(quickSort([3, 1.5, 2, 1.2])).toEqual([1.2, 1.5, 2, 3]);
    });

    it('should handle very small differences', () => {
      expect(quickSort([1.001, 1.002, 1.0001])).toEqual([1.0001, 1.001, 1.002]);
    });

    it('should handle negative floating point numbers', () => {
      expect(quickSort([-1.5, -2.5, -0.5])).toEqual([-2.5, -1.5, -0.5]);
    });
  });

  describe('large arrays', () => {
    it('should sort a larger array correctly', () => {
      const input = [64, 34, 25, 12, 22, 11, 90, 45, 33, 21];
      const expected = [11, 12, 21, 22, 25, 33, 34, 45, 64, 90];
      expect(quickSort(input)).toEqual(expected);
    });

    it('should sort array of 100 elements', () => {
      const input = Array.from({ length: 100 }, (_, i) => 100 - i);
      const expected = Array.from({ length: 100 }, (_, i) => i + 1);
      expect(quickSort(input)).toEqual(expected);
    });

    it('should handle large array with random values', () => {
      const input = [
        87, 23, 45, 12, 99, 34, 56, 78, 90, 11, 67, 43, 21, 88, 55,
      ];
      const expected = [...input].sort((a, b) => a - b);
      expect(quickSort(input)).toEqual(expected);
    });
  });

  describe('special values', () => {
    it('should handle array with Infinity', () => {
      expect(quickSort([Infinity, 1, 2])).toEqual([1, 2, Infinity]);
    });

    it('should handle array with negative Infinity', () => {
      expect(quickSort([1, -Infinity, 2])).toEqual([-Infinity, 1, 2]);
    });

    it('should handle array with both Infinities', () => {
      expect(quickSort([0, Infinity, -Infinity])).toEqual([
        -Infinity,
        0,
        Infinity,
      ]);
    });
  });

  describe('stability and immutability', () => {
    it('should not modify the original array', () => {
      const original = [3, 1, 2];
      const copy = [...original];
      quickSort(original);
      expect(original).toEqual(copy);
    });

    it('should return a new array instance', () => {
      const input = [3, 1, 2];
      const result = quickSort(input);
      expect(result).not.toBe(input);
    });
  });
});
