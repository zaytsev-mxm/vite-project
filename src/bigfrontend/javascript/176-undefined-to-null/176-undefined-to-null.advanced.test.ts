import { describe, it, expect } from 'vitest';
import { undefinedToNull } from './176-undefined-to-null.advanced';

describe('undefinedToNull (advanced)', () => {
  it('returns functions as-is (identity preserved)', () => {
    const fn = () => 42;
    expect(undefinedToNull(fn)).toBe(fn);

    const obj = { a: undefined, fn };
    const out = undefinedToNull(obj) as { a: null; fn: typeof fn };
    expect(out.fn).toBe(fn);
    expect(out.a).toBeNull();
  });

  it('returns Date/RegExp/Map/Set as-is (no deep conversion)', () => {
    const date = new Date();
    const re = /abc/gi;
    const m = new Map<string, unknown>([
      ['x', undefined],
      ['y', 1],
    ]);
    const s = new Set<unknown>([undefined, 1]);

    expect(undefinedToNull(date)).toBe(date);
    expect(undefinedToNull(re)).toBe(re);
    expect(undefinedToNull(m)).toBe(m);
    expect(undefinedToNull(s)).toBe(s);

    // contents should remain unchanged for non-plain objects
    expect(m.get('x')).toBeUndefined();
    expect([...s].includes(undefined)).toBe(true);
  });

  it('preserves class instances as-is (including undefined fields)', () => {
    class Foo {
      x: unknown = undefined;
      y = 1;
    }
    const foo = new Foo();
    const out = undefinedToNull(foo);
    expect(out).toBe(foo);
    expect((out as Foo).x).toBeUndefined();
    expect((out as Foo).y).toBe(1);
  });

  it('handles symbol properties and converts undefined to null for those keys', () => {
    const sym = Symbol('k');
    const obj: Record<PropertyKey, unknown> = {
      a: undefined,
      [sym]: undefined,
    };

    const out = undefinedToNull(obj) as Record<PropertyKey, unknown>;
    expect(out.a).toBeNull();
    expect(out[sym]).toBeNull();
  });

  it('treats symbol primitives as primitives (returned as-is)', () => {
    const s = Symbol('s');
    expect(undefinedToNull(s)).toBe(s);
  });

  it('treats bigint as primitive (returned as-is)', () => {
    const b = 123n;
    expect(undefinedToNull(b)).toBe(b);
  });

  it('converts holes in sparse arrays to null and converts present undefined to null', () => {
    const arr = [] as Array<unknown>;
    // create a hole at index 0
    arr.length = 3;
    // set index 1 as a real value
    arr[1] = 1;
    // set index 2 as an explicit undefined value
    arr[2] = undefined;

    const out = undefinedToNull(arr) as unknown[];

    // hole (index 0) becomes null, explicit undefined becomes null, value preserved
    expect(out).toEqual([null, 1, null]);

    // ensure original is untouched
    expect(0 in arr).toBe(false); // hole remains a hole in original
    expect(arr[2]).toBeUndefined();
  });

  it('handles cyclic objects without throwing and preserves self-references', () => {
    const obj: Record<string, unknown> & { self?: unknown } = { a: undefined };
    obj.self = obj;

    const out = undefinedToNull(obj) as typeof obj;

    expect(out).not.toBe(obj);
    expect(out.a).toBeNull();
    expect(out.self).toBe(out); // self-reference preserved in cloned structure
  });

  it('handles cyclic arrays without throwing and preserves cycle', () => {
    const arr: unknown[] = [undefined];
    arr.push(arr);

    const out = undefinedToNull(arr) as unknown[];

    expect(out).not.toBe(arr);
    expect(out[0]).toBeNull();
    expect(out[1]).toBe(out); // cycle preserved
  });

  it('deeply converts plain objects but leaves non-plain nested objects intact', () => {
    const date = new Date();
    const map = new Map([['k', undefined]]);
    const set = new Set([undefined]);

    const input = {
      a: undefined,
      b: { c: undefined },
      d: [undefined, { e: undefined }],
      date,
      map,
      set,
      fn() {
        return 1;
      },
    };

    // @ts-expect-error - it is OK here, for the test purposes
    const out = undefinedToNull(input) as typeof input;

    expect(out).not.toBe(input);
    expect(out.a).toBeNull();
    expect(out.b).toEqual({ c: null });
    expect(out.d).toEqual([null, { e: null }]);

    // non-plain instances preserved
    expect(out.date).toBe(date);
    expect(out.map).toBe(map);
    expect(out.set).toBe(set);

    // function preserved
    expect(out.fn).toBe(input.fn);
  });
});
