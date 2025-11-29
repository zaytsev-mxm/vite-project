/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from 'vitest';
import { curry } from './02-implement-curry-with-placeholder.ts';

function join(a: any, b: any, c: any) {
  return `${a}_${b}_${c}`;
}

const _ = curry.placeholder;

describe('curry with placeholder', () => {
  test('test #1', () => {
    expect(curry(join)(1)(2)(3)).toBe('1_2_3');
  });
  test('test #2', () => {
    expect(curry(join)(1, 2)(3)).toBe('1_2_3');
  });
  test('test #3', () => {
    expect(curry(join)(1, 2, 3, 4)).toBe('1_2_3');
  });
  test('test #4', () => {
    const curried = curry(join)(1, 2);
    expect(curried(3)).toBe('1_2_3');
    expect(curried(4)).toBe('1_2_4');
  });
  test('test #5', () => {
    expect(curry(join)(_, _, 3, 4)(1, _)(2, 5)).toBe('1_2_3');
  });
  test('test #6', () => {
    expect(curry(join)(_, _, _, _)(_, 2, _)(_, 3)(1)).toBe('1_2_3');
  });
  test('test #7', () => {
    expect(curry(join)(1)(_, 3)(2)).toBe('1_2_3');
  });
});
