/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a JavaScript coding problem from BFE.dev

type Curry = (fn: (...args: any[]) => any) => (...args: any[]) => any;

const curry: Curry = (fn) => {
  const arity = fn.length;

  const curried = (...args: any[]): any => {
    if (args.length >= arity) {
      return fn(...args.slice(0, arity));
    }
    return (...next: any[]) => curried(...args, ...next);
  };

  return curried;
};

// @ts-expect-error ...-
curry.placeholder = Symbol('curry placeholder');

export { curry };
