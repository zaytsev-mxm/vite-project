/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from 'vitest';
import { curry } from './01-implement-curry.ts';

const join = (a: any, b: any, c: any) => {
  return `${a}_${b}_${c}`;
};

describe('curry', () => {
  test('it works when all 3 arguments passed', () => {
    const curriedJoin = curry(join);
    const result = curriedJoin(1, 2, 3);
    expect(result).toEqual('1_2_3');
  });

  test('it works when the 3 arguments passed via currying', () => {
    const curriedJoin = curry(join);
    expect(curriedJoin(1)(2, 3)).toEqual('1_2_3');
    expect(curriedJoin(1, 2)(3)).toEqual('1_2_3');
    expect(curriedJoin(1)(2)(3)).toEqual('1_2_3');
  });

  test('it works with pre-defined curried function', () => {
    const curried = curry(join)(1, 2);
    expect(curried(3)).toBe('1_2_3');
    expect(curried(4)).toBe('1_2_4');
  });
});
