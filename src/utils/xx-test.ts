export function clone<T>(input: T): T {
  const getType = (entity: unknown) => {
    return Object.prototype.toString.call(entity).slice(8, -1);
  };

  const isArray = (maybeArray: unknown): maybeArray is Array<unknown> => {
    return getType(maybeArray) === 'Array';
  };
  const isObject = (
    maybeObject: unknown,
  ): maybeObject is Record<string, unknown> => {
    return getType(maybeObject) === 'Object';
  };

  if (isArray(input)) {
    return input.map(clone) as T;
  }

  if (isObject(input)) {
    return Object.entries(input).reduce((acc, [key, val]) => {
      Reflect.set(acc, key, clone(val));
      return acc;
    }, {}) as T;
  }

  return input;
}

const res1 = clone(1);
const res2 = clone('a');
const res3 = clone((numA: number, numB: number) => numA + numB);
const res4 = clone([1, 2, 3]);
const res5 = clone([1, 'a', () => 42]);
const res6 = clone({ a: 1 });
const res7 = clone({ a: 1, b: [1, { c: [() => 24] }] });

console.log(res1, res2, res3, res4, res5, res6, res7);
