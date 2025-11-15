function undefinedToNull<T = unknown>(arg: T): unknown {
  function isPrimitive(arg: unknown) {
    return arg !== Object(arg);
  }

  function processPrimitive(arg: T) {
    return arg === undefined ? null : arg;
  }

  function processArray(arg: Array<unknown>): Array<unknown> {
    return arg.map(undefinedToNull);
  }

  function processKeyValue(arg: Record<string, unknown>) {
    const result: Record<string, unknown> = {};
    for (const key in arg) {
      const val = arg[key];
      result[key] = undefinedToNull(val);
    }
    return result;
  }

  if (isPrimitive(arg)) {
    return processPrimitive(arg);
  }

  if (Array.isArray(arg)) {
    return processArray(arg);
  }

  return processKeyValue(arg as Record<string, unknown>);
}

export { undefinedToNull };
