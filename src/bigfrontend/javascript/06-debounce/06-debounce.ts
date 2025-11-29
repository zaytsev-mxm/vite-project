/* eslint-disable @typescript-eslint/no-explicit-any */

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastResult: ReturnType<T> | undefined = undefined;

  const resetTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return function debouncedFunc(this: unknown, ...args: Parameters<T>) {
    resetTimeout();
    timeout = setTimeout(() => {
      lastResult = func.apply(this, args);
      resetTimeout();
    }, wait);
    return lastResult;
  };
}

export { debounce };
