/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a JavaScript coding problem from BFE.dev

interface Curry {
  (fn: (...args: any[]) => any): (...args: any[]) => any;
  placeholder: symbol;
}

export const curry: Curry = (fn) => {
  const arity = fn.length;
  const storedArgs: Parameters<typeof fn> = new Array(arity);
  const storedArgsPositions: boolean[] = new Array(arity).fill(false);
  let filledArgs = 0;
  return function curriedFunc(this: unknown, ...args) {
    args.forEach((arg, pos) => {
      if (
        pos <= arity - 1 &&
        arg !== curry.placeholder &&
        !storedArgsPositions[pos]
      ) {
        storedArgsPositions[pos] = true;
        storedArgs[pos] = arg;
        filledArgs++;
      }
    });

    if (filledArgs === arity) {
      return fn.apply(this, storedArgs);
    } else {
      return curriedFunc;
    }
  };
};

curry.placeholder = Symbol('curry placeholder');
