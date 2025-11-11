import { describe, it, expect } from 'vitest';
import { ObjectGroupBy } from './177-implement-groupby';

describe('ObjectGroupBy', () => {
  it('[] -> returns empty null-prototype object', () => {
    const res = ObjectGroupBy([], (x) => x as never);
    expect(Object.getPrototypeOf(res)).toBeNull();
    expect(Object.keys(res)).toEqual([]);
  });

  it('[0,1,2,3,4,5] -> groups by parity', () => {
    const res = ObjectGroupBy([0, 1, 2, 3, 4, 5], (n) =>
      n % 2 === 0 ? 'even' : 'odd',
    );
    expect(res.even).toEqual([0, 2, 4]);
    expect(res.odd).toEqual([1, 3, 5]);
  });

  it('example case -> groups objects by property value', () => {
    const users = [
      { id: 1, role: 'admin' },
      { id: 2, role: 'user' },
      { id: 3, role: 'admin' },
      { id: 4, role: 'guest' },
      { id: 5, role: 'user' },
    ];
    const res = ObjectGroupBy(users, (u) => u.role);
    expect(res.admin.map((u) => u.id)).toEqual([1, 3]);
    expect(res.user.map((u) => u.id)).toEqual([2, 5]);
    expect(res.guest.map((u) => u.id)).toEqual([4]);
  });

  it('key coercion -> number and string key collide on object keys', () => {
    type Item = { key: number | string; value: string };
    const items: Item[] = [
      { key: 1, value: 'from number key' },
      { key: '1', value: 'from string key' },
      { key: 2, value: 'two' },
    ];
    const res = ObjectGroupBy(items, (i) => i.key as PropertyKey);

    // Number key 1 and string key '1' both map to the same property "1"
    expect(Object.keys(res).sort()).toEqual(['1', '2']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(res[1 as any]).toEqual([
      { key: 1, value: 'from number key' },
      { key: '1', value: 'from string key' },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(res['1']).toBe(res[1 as any]);
    expect(res['2']).toEqual([{ key: 2, value: 'two' }]);
  });

  it('key coercion with symbols -> symbol keys do not coerce', () => {
    const sym = Symbol('group');
    const res = ObjectGroupBy([10, 20], () => sym);
    // Symbol-keyed property exists and is not accessible via string name
    const symbols = Object.getOwnPropertySymbols(res);
    expect(symbols).toContain(sym);
    expect(res[sym]).toEqual([10, 20]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((res as any)['Symbol(group)']).toBeUndefined();
  });

  it('should return a null-prototype object', () => {
    const groups = ObjectGroupBy([0, 1, 2, 3, 4, 5], (item) =>
      item % 2 === 0 ? 'even' : 'odd',
    );
    expect(Object.getPrototypeOf(groups)).toBeNull();
  });

  it('throws if first arg not iterable', () => {
    // Not an array / not iterable: reduce will not exist and should throw a TypeError
    // Using various bad inputs
    const badInputs = [null, undefined, 123, true, {}];

    for (const bad of badInputs) {
      expect(() =>
        // @ts-expect-error testing runtime behavior with invalid input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ObjectGroupBy(bad, (x: any) => x),
      ).toThrow(TypeError);
    }
  });
});
