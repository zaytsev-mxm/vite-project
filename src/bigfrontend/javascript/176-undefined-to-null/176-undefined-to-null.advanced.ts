/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

type ReplaceUndefinedWithNull<T> = [T] extends [undefined]
  ? null
  : T extends Function
    ? T
    : T extends readonly (infer U)[]
      ? ReplaceUndefinedWithNull<U>[]
      : T extends object
        ? { [K in keyof T]: ReplaceUndefinedWithNull<T[K]> }
        : T;

function undefinedToNull<T>(
  arg: T,
  seen = new WeakMap<object, any>(),
): ReplaceUndefinedWithNull<T> {
  // primitives (including null, symbol, bigint) and functions: return as-is, except undefined -> null
  if (arg === undefined) return null as ReplaceUndefinedWithNull<T>;
  if (arg === null) return arg as ReplaceUndefinedWithNull<T>;
  const t = typeof arg;
  if (t !== 'object') return arg as ReplaceUndefinedWithNull<T>;
  if (typeof arg === 'function') return arg as ReplaceUndefinedWithNull<T>;

  // handle cycles
  if (seen.has(arg as object)) return seen.get(arg as object);

  // arrays: preserve holes
  if (Array.isArray(arg)) {
    const arr = arg as unknown as any[];
    const out: any[] = new Array(arr.length);
    seen.set(arg as object, out);
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        out[i] = undefinedToNull(arr[i], seen);
      } else {
        out[i] = null; // align with JSON.stringify behavior for holes
      }
    }
    return out as ReplaceUndefinedWithNull<T>;
  }

  // non-plain objects: return as-is (do not lose prototype/behavior)
  if (!isPlainObject(arg)) {
    return arg as ReplaceUndefinedWithNull<T>;
  }

  // plain objects: copy own string and symbol keys
  const out: Record<PropertyKey, unknown> = {};
  seen.set(arg as object, out);

  for (const key of Object.keys(arg as object)) {
    const value = (arg as Record<string, unknown>)[key];
    (out as Record<string, unknown>)[key] = undefinedToNull(value, seen);
  }
  for (const sym of Object.getOwnPropertySymbols(arg as object)) {
    const value = (arg as Record<symbol, unknown>)[sym];
    (out as Record<symbol, unknown>)[sym] = undefinedToNull(value, seen);
  }

  return out as ReplaceUndefinedWithNull<T>;
}

export { undefinedToNull };
