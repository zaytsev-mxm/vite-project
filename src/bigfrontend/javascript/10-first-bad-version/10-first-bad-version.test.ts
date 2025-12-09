import { describe, test, expect } from 'vitest';
import { firstBadVersion } from './10-first-bad-version';

describe('firstBadVersion', () => {
  test('it works correctly in all cases', () => {
    expect(firstBadVersion((n) => n > 7)(10)).toEqual(8);
  });
});
