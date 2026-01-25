export function fetcher<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        setTimeout(() => {
          resolve(response.json());
        }, 100);
      })
      .catch(reject);
  });
}

export const debounce = (
  fn: (...args: unknown[]) => unknown,
  delay: number,
) => {
  let timerId: ReturnType<typeof setTimeout>;

  return function debounced(...args: Parameters<typeof fn>) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
