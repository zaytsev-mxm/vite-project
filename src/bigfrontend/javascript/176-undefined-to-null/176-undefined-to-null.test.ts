import { describe, it, expect } from 'vitest';
import { undefinedToNull } from './176-undefined-to-null';

describe('undefinedToNull', () => {
  it('converts primitive undefined to null', () => {
    expect(undefinedToNull(undefined)).toBeNull();
  });

  it('leaves other primitives unchanged', () => {
    expect(undefinedToNull(null)).toBeNull();
    expect(undefinedToNull(0)).toBe(0);
    expect(undefinedToNull('str')).toBe('str');
    expect(undefinedToNull(true)).toBe(true);
  });

  it('replaces undefined elements inside arrays with null', () => {
    const input = [1, undefined, 'a', undefined, null];
    const output = undefinedToNull(input) as unknown[];

    expect(output).toEqual([1, null, 'a', null, null]);
  });

  it('replaces undefined properties inside objects with null (including nested)', () => {
    const input = {
      a: undefined,
      b: 'BFE.dev',
      c: [undefined, { d: undefined, e: 1 }],
      f: { g: undefined, h: [1, undefined, 3] },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output = undefinedToNull(input) as any;

    expect(output).toEqual({
      a: null,
      b: 'BFE.dev',
      c: [null, { d: null, e: 1 }],
      f: { g: null, h: [1, null, 3] },
    });
  });

  it('does not mutate the original input and creates new containers', () => {
    const nested = { c: undefined };
    const arr = [1, undefined, nested];
    const input = { a: undefined, b: arr };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = undefinedToNull(input) as any;

    // original remains unchanged
    expect(input.a).toBe(undefined);
    expect(input.b).toBe(arr);
    expect(nested.c).toBe(undefined);

    // result is a new object and contains new nested containers
    expect(result).not.toBe(input);
    expect(result.b).not.toBe(arr);
    expect(result.b[2]).not.toBe(nested);

    // values transformed accordingly
    expect(result).toEqual({ a: null, b: [1, null, { c: null }] });
  });
});
