/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a JavaScript coding problem from BFE.dev

type Curry = (fn: (...args: any[]) => any) => (...args: any[]) => any;

const curry: Curry = (fn) => {
  const getFilteredArgs = (...args: any[]) => {
    return args.filter((arg) => {
      // @ts-expect-error ...
      return arg !== curry.placeholder;
    });
  };

  const arity = fn.length;

  const curried = (..._args: any[]): any => {
    const args = getFilteredArgs(..._args);
    if (args.length >= arity) {
      return fn(...args.slice(0, arity));
    }
    return (..._next: any[]) => {
      const next = getFilteredArgs(..._next);
      return curried(...args, ...next);
    };
  };

  return curried;
};

// @ts-expect-error ...-
curry.placeholder = Symbol('curry placeholder');

export { curry };
