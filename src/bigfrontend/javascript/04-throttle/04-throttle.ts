/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a JavaScript coding problem from BFE.dev

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ThrottledFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastValue: ReturnType<typeof func> | undefined = undefined;

  const resetTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  const restartTimeout = (...args: Parameters<T>) => {
    timeout = setTimeout(() => {
      lastValue = func(...args);
      resetTimeout();
    }, wait);
  };

  return (...args: Parameters<T>) => {
    if (!timeout) {
      restartTimeout(...args);
    }
    return lastValue;
  };
}

export { throttle };
