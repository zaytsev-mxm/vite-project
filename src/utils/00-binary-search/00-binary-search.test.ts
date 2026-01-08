import { describe, it, expect } from 'vitest';
import {
  binarySearch,
  binarySearchRec,
  binarySearchFirstOccurrence,
  binarySearchRecFirstOccurrence,
  binarySearchFirstOccurrenceTypeSafe,
} from './00-binary-search';

describe('binarySearch', () => {
  describe('empty array', () => {
    it('returns -1 for empty array', () => {
      expect(binarySearch([], 5)).toBe(-1);
    });
  });

  describe('single element array', () => {
    it('returns 0 when target is found', () => {
      expect(binarySearch([5], 5)).toBe(0);
    });

    it('returns -1 when target is not found', () => {
      expect(binarySearch([5], 3)).toBe(-1);
    });
  });

  describe('odd number of elements', () => {
    const arr = [1, 3, 5, 7, 9];

    it('finds element at the beginning', () => {
      expect(binarySearch(arr, 1)).toBe(0);
    });

    it('finds element in the middle', () => {
      expect(binarySearch(arr, 5)).toBe(2);
    });

    it('finds element at the end', () => {
      expect(binarySearch(arr, 9)).toBe(4);
    });

    it('returns -1 when target is smaller than all elements', () => {
      expect(binarySearch(arr, 0)).toBe(-1);
    });

    it('returns -1 when target is larger than all elements', () => {
      expect(binarySearch(arr, 10)).toBe(-1);
    });

    it('returns -1 when target is between elements', () => {
      expect(binarySearch(arr, 4)).toBe(-1);
    });
  });

  describe('even number of elements', () => {
    const arr = [2, 4, 6, 8];

    it('finds element at the beginning', () => {
      expect(binarySearch(arr, 2)).toBe(0);
    });

    it('finds element in the middle (left)', () => {
      expect(binarySearch(arr, 4)).toBe(1);
    });

    it('finds element in the middle (right)', () => {
      expect(binarySearch(arr, 6)).toBe(2);
    });

    it('finds element at the end', () => {
      expect(binarySearch(arr, 8)).toBe(3);
    });

    it('returns -1 when target does not exist', () => {
      expect(binarySearch(arr, 5)).toBe(-1);
    });
  });

  describe('negative numbers', () => {
    it('handles arrays with negative numbers', () => {
      const arr = [-10, -5, 0, 5, 10];
      expect(binarySearch(arr, -5)).toBe(1);
      expect(binarySearch(arr, 0)).toBe(2);
      expect(binarySearch(arr, -7)).toBe(-1);
    });
  });
});

describe('binarySearchRec', () => {
  describe('empty array', () => {
    it('returns -1 for empty array', () => {
      expect(binarySearchRec([], 5)).toBe(-1);
    });
  });

  describe('single element array', () => {
    it('returns 0 when target is found', () => {
      expect(binarySearchRec([5], 5)).toBe(0);
    });

    it('returns -1 when target is not found', () => {
      expect(binarySearchRec([5], 3)).toBe(-1);
    });
  });

  describe('odd number of elements', () => {
    const arr = [1, 3, 5, 7, 9];

    it('finds element at the beginning', () => {
      expect(binarySearchRec(arr, 1)).toBe(0);
    });

    it('finds element in the middle', () => {
      expect(binarySearchRec(arr, 5)).toBe(2);
    });

    it('finds element at the end', () => {
      expect(binarySearchRec(arr, 9)).toBe(4);
    });

    it('returns -1 when target does not exist', () => {
      expect(binarySearchRec(arr, 4)).toBe(-1);
    });
  });

  describe('even number of elements', () => {
    const arr = [2, 4, 6, 8];

    it('finds element at the beginning', () => {
      expect(binarySearchRec(arr, 2)).toBe(0);
    });

    it('finds element at the end', () => {
      expect(binarySearchRec(arr, 8)).toBe(3);
    });

    it('returns -1 when target does not exist', () => {
      expect(binarySearchRec(arr, 5)).toBe(-1);
    });
  });

  describe('negative numbers', () => {
    it('handles arrays with negative numbers', () => {
      const arr = [-10, -5, 0, 5, 10];
      expect(binarySearchRec(arr, -5)).toBe(1);
      expect(binarySearchRec(arr, -15)).toBe(-1);
    });
  });
});

describe('binarySearchFirstOccurrence', () => {
  describe('empty array', () => {
    it('returns -1 for empty array', () => {
      expect(binarySearchFirstOccurrence([], 5)).toBe(-1);
    });
  });

  describe('single element array', () => {
    it('returns 0 when target is found', () => {
      expect(binarySearchFirstOccurrence([5], 5)).toBe(0);
    });

    it('returns -1 when target is not found', () => {
      expect(binarySearchFirstOccurrence([5], 3)).toBe(-1);
    });
  });

  describe('array without duplicates', () => {
    const arr = [1, 3, 5, 7, 9];

    it('finds element at the beginning', () => {
      expect(binarySearchFirstOccurrence(arr, 1)).toBe(0);
    });

    it('finds element in the middle', () => {
      expect(binarySearchFirstOccurrence(arr, 5)).toBe(2);
    });

    it('finds element at the end', () => {
      expect(binarySearchFirstOccurrence(arr, 9)).toBe(4);
    });
  });

  describe('array with duplicates', () => {
    it('returns first occurrence when duplicates at the beginning', () => {
      const arr = [1, 1, 1, 2, 3];
      expect(binarySearchFirstOccurrence(arr, 1)).toBe(0);
    });

    it('returns first occurrence when duplicates in the middle', () => {
      const arr = [1, 2, 2, 2, 3];
      expect(binarySearchFirstOccurrence(arr, 2)).toBe(1);
    });

    it('returns first occurrence when duplicates at the end', () => {
      const arr = [1, 2, 3, 3, 3];
      expect(binarySearchFirstOccurrence(arr, 3)).toBe(2);
    });

    it('returns first occurrence when all elements are the same', () => {
      const arr = [5, 5, 5, 5, 5];
      expect(binarySearchFirstOccurrence(arr, 5)).toBe(0);
    });

    it('returns -1 when target not in array with duplicates', () => {
      const arr = [1, 1, 2, 2, 3, 3];
      expect(binarySearchFirstOccurrence(arr, 4)).toBe(-1);
    });
  });

  describe('even number of elements with duplicates', () => {
    it('finds first occurrence correctly', () => {
      const arr = [1, 2, 2, 3];
      expect(binarySearchFirstOccurrence(arr, 2)).toBe(1);
    });
  });
});

describe('binarySearchRecFirstOccurrence', () => {
  describe('empty array', () => {
    it('returns -1 for empty array', () => {
      expect(binarySearchRecFirstOccurrence([], 5)).toBe(-1);
    });
  });

  describe('single element array', () => {
    it('returns 0 when target is found', () => {
      expect(binarySearchRecFirstOccurrence([5], 5)).toBe(0);
    });

    it('returns -1 when target is not found', () => {
      expect(binarySearchRecFirstOccurrence([5], 3)).toBe(-1);
    });
  });

  describe('array with duplicates', () => {
    it('returns first occurrence when duplicates at the beginning', () => {
      const arr = [1, 1, 1, 2, 3];
      expect(binarySearchRecFirstOccurrence(arr, 1)).toBe(0);
    });

    it('returns first occurrence when duplicates in the middle', () => {
      const arr = [1, 2, 2, 2, 3];
      expect(binarySearchRecFirstOccurrence(arr, 2)).toBe(1);
    });

    it('returns first occurrence when duplicates at the end', () => {
      const arr = [1, 2, 3, 3, 3];
      expect(binarySearchRecFirstOccurrence(arr, 3)).toBe(2);
    });

    it('returns first occurrence when all elements are the same', () => {
      const arr = [5, 5, 5, 5, 5];
      expect(binarySearchRecFirstOccurrence(arr, 5)).toBe(0);
    });
  });

  describe('odd number of elements', () => {
    const arr = [1, 3, 5, 7, 9];

    it('finds element at various positions', () => {
      expect(binarySearchRecFirstOccurrence(arr, 1)).toBe(0);
      expect(binarySearchRecFirstOccurrence(arr, 5)).toBe(2);
      expect(binarySearchRecFirstOccurrence(arr, 9)).toBe(4);
    });
  });

  describe('even number of elements', () => {
    const arr = [2, 4, 6, 8];

    it('finds element at various positions', () => {
      expect(binarySearchRecFirstOccurrence(arr, 2)).toBe(0);
      expect(binarySearchRecFirstOccurrence(arr, 8)).toBe(3);
    });
  });
});

describe('binarySearchFirstOccurrenceTypeSafe', () => {
  describe('with numbers', () => {
    const numberMatcher = (target: number) => (item: number) => {
      if (item === target) return 0;
      if (item > target) return 1;
      return -1;
    };

    it('returns -1 for empty array', () => {
      expect(binarySearchFirstOccurrenceTypeSafe([], numberMatcher(5))).toBe(
        -1,
      );
    });

    it('finds element in single element array', () => {
      expect(binarySearchFirstOccurrenceTypeSafe([5], numberMatcher(5))).toBe(
        0,
      );
    });

    it('returns -1 when target not found', () => {
      expect(binarySearchFirstOccurrenceTypeSafe([5], numberMatcher(3))).toBe(
        -1,
      );
    });

    it('finds first occurrence with duplicates', () => {
      const arr = [1, 2, 2, 2, 3];
      expect(binarySearchFirstOccurrenceTypeSafe(arr, numberMatcher(2))).toBe(
        1,
      );
    });

    it('finds first occurrence when all elements are the same', () => {
      const arr = [5, 5, 5, 5, 5];
      expect(binarySearchFirstOccurrenceTypeSafe(arr, numberMatcher(5))).toBe(
        0,
      );
    });
  });

  describe('with objects', () => {
    interface Person {
      id: number;
      name: string;
    }

    const people: Person[] = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Bob2' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Diana' },
    ];

    const idMatcher = (targetId: number) => (person: Person) => {
      if (person.id === targetId) return 0;
      if (person.id > targetId) return 1;
      return -1;
    };

    it('finds first object with matching id', () => {
      expect(binarySearchFirstOccurrenceTypeSafe(people, idMatcher(2))).toBe(1);
    });

    it('finds object at the beginning', () => {
      expect(binarySearchFirstOccurrenceTypeSafe(people, idMatcher(1))).toBe(0);
    });

    it('finds object at the end', () => {
      expect(binarySearchFirstOccurrenceTypeSafe(people, idMatcher(4))).toBe(4);
    });

    it('returns -1 when id not found', () => {
      expect(binarySearchFirstOccurrenceTypeSafe(people, idMatcher(5))).toBe(
        -1,
      );
    });
  });

  describe('with strings', () => {
    const stringMatcher = (target: string) => (item: string) => {
      if (item === target) return 0;
      if (item > target) return 1;
      return -1;
    };

    it('finds string in sorted array', () => {
      const arr = ['apple', 'banana', 'cherry', 'date'];
      expect(binarySearchFirstOccurrenceTypeSafe(arr, stringMatcher('cherry'))).toBe(2);
    });

    it('returns -1 when string not found', () => {
      const arr = ['apple', 'banana', 'cherry'];
      expect(binarySearchFirstOccurrenceTypeSafe(arr, stringMatcher('mango'))).toBe(-1);
    });

    it('finds first occurrence with duplicate strings', () => {
      const arr = ['a', 'b', 'b', 'b', 'c'];
      expect(binarySearchFirstOccurrenceTypeSafe(arr, stringMatcher('b'))).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles large arrays', () => {
      const arr = Array.from({ length: 10000 }, (_, i) => i);
      const matcher = (target: number) => (item: number) => {
        if (item === target) return 0;
        if (item > target) return 1;
        return -1;
      };
      expect(binarySearchFirstOccurrenceTypeSafe(arr, matcher(9999))).toBe(
        9999,
      );
      expect(binarySearchFirstOccurrenceTypeSafe(arr, matcher(0))).toBe(0);
      expect(binarySearchFirstOccurrenceTypeSafe(arr, matcher(5000))).toBe(
        5000,
      );
    });
  });
});
