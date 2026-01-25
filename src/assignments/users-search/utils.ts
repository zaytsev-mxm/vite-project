export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    return response.json();
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
