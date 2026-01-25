import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

type Options = {
  enabled?: boolean;
};

type FetcherFn<T> = (url: string) => Promise<T>;

// Simple cache for demo purposes - in production, use TanStack Query or SWR
const cache = new Map<string, unknown>();

export function useAjax<T>(
  url: string,
  fetcher: FetcherFn<T>,
  options?: Options,
) {
  const [result, setResult] = useState<{
    isLoading: boolean;
    error?: Error;
    data?: T;
  }>({ isLoading: false });

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Return cached data immediately if available
    if (cache.has(url)) {
      setResult({ data: cache.get(url) as T, isLoading: false });
      return;
    }

    let cancelled = false;

    setResult((prev) => ({ ...prev, isLoading: true, error: undefined }));

    fetcher(url)
      .then((data) => {
        if (!cancelled) {
          cache.set(url, data);
          setResult({ data, isLoading: false });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({ error, isLoading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, fetcher, url]);

  return result;
}
