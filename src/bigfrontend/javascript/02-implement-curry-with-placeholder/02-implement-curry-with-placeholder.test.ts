/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from 'vitest';
import { curry } from './02-implement-curry-with-placeholder.ts';

function join(a: any, b: any, c: any) {
  return `${a}_${b}_${c}`;
}

const _ = curry.placeholder;

describe('join with placeholder', () => {
  test('it works with placeholder', () => {
    expect(curry(join)(_, _, 3, 4)(1, _)(2, 5)).toBe('1_2_3');
  });
});
