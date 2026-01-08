import { describe, it, expect } from 'vitest';
import { selectionSort, selectionSortTypeSafe } from './01-selection-sort';

describe('selectionSort', () => {
  it('sorts an array of numbers in ascending order', () => {
    expect(selectionSort([64, 25, 12, 22, 11])).toEqual([11, 12, 22, 25, 64]);
  });

  it('handles an already sorted array', () => {
    expect(selectionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles a reverse sorted array', () => {
    expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles an empty array', () => {
    expect(selectionSort([])).toEqual([]);
  });

  it('handles a single element array', () => {
    expect(selectionSort([42])).toEqual([42]);
  });

  it('handles an array with duplicate values', () => {
    expect(selectionSort([3, 1, 4, 1, 5, 9, 2, 6, 5])).toEqual([1, 1, 2, 3, 4, 5, 5, 6, 9]);
  });

  it('handles negative numbers', () => {
    expect(selectionSort([3, -1, 0, -5, 2])).toEqual([-5, -1, 0, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [3, 1, 2];
    selectionSort(original);
    expect(original).toEqual([3, 1, 2]);
  });
});

describe('selectionSortTypeSafe', () => {
  const numberComparator = (a: number, b: number): 0 | 1 | -1 => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  it('sorts numbers with a comparator', () => {
    expect(selectionSortTypeSafe([64, 25, 12, 22, 11], numberComparator)).toEqual([
      11, 12, 22, 25, 64,
    ]);
  });

  it('sorts strings alphabetically', () => {
    const stringComparator = (a: string, b: string): 0 | 1 | -1 => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
    expect(selectionSortTypeSafe(['banana', 'apple', 'cherry'], stringComparator)).toEqual([
      'apple',
      'banana',
      'cherry',
    ]);
  });

  it('sorts objects by a property', () => {
    const items = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }, { name: 'Bob', age: 35 }];
    const ageComparator = (a: typeof items[0], b: typeof items[0]): 0 | 1 | -1 => {
      if (a.age < b.age) return -1;
      if (a.age > b.age) return 1;
      return 0;
    };
    expect(selectionSortTypeSafe(items, ageComparator)).toEqual([
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
      { name: 'Bob', age: 35 },
    ]);
  });

  it('sorts in descending order with reversed comparator', () => {
    const descendingComparator = (a: number, b: number): 0 | 1 | -1 => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    };
    expect(selectionSortTypeSafe([1, 5, 3, 2, 4], descendingComparator)).toEqual([5, 4, 3, 2, 1]);
  });

  it('handles an empty array', () => {
    expect(selectionSortTypeSafe([], numberComparator)).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const original = [3, 1, 2];
    selectionSortTypeSafe(original, numberComparator);
    expect(original).toEqual([3, 1, 2]);
  });
});
