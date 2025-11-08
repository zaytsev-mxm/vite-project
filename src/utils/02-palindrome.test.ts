import { isPalindrome } from './02-palindrome';
import { describe, it, expect } from 'vitest';

describe('isPalindrome', () => {
  it('returns true for "A man, a plan, a canal: Panama"', () => {
    expect(isPalindrome("A man, a plan, a canal: Panama")).toBe(true);
  });

  it('returns false for "race a car"', () => {
    expect(isPalindrome("race a car")).toBe(false);
  });

  it('returns true for a single space " "', () => {
    expect(isPalindrome(" ")).toBe(true);
  });

  it('returns true for ".,"', () => {
      expect(isPalindrome(".,")).toBe(true);
  });

  it('returns false for "0P"', () => {
      expect(isPalindrome("0P")).toBe(false);
  });
});