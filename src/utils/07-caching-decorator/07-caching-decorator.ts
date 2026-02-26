// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cachingDecorator<Fn extends (...args: any[]) => unknown>(
  func: Fn,
): (...args: Parameters<Fn>) => ReturnType<Fn> {
  const hash = new Map<string, ReturnType<Fn>>();

  return (...args: Parameters<Fn>): ReturnType<Fn> => {
    const key = JSON.stringify(args);
    if (hash.has(key)) {
      return hash.get(key)!;
    }
    const result = func(...args) as ReturnType<Fn>;
    hash.set(key, result);
    return result;
  };
}

const sum = (a: number, b: number) => {
  for (let i = 0; i < 10000000000; ) {
    i++;
  }
  return a + b;
};

const cachedSum = cachingDecorator(sum);

const start = Date.now();
const res1 = cachedSum(1, 2);
const interim = Date.now();
const res2 = cachedSum(1, 2);
const end = Date.now();

const diff1 = interim - start;
const diff2 = end - interim;

console.log({ res1, res2, diff1, diff2 });
