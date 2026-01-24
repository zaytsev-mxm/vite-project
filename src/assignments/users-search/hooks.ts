import { useEffect, useRef, useState } from 'react';

export function useFetch<T>(url: string, fetcher: (url: string) => Promise<T>) {
  const promiseRef = useRef<Promise<T> | undefined>(undefined);
  const [result, setResult] = useState<{
    data?: T;
    isLoading?: boolean;
    error?: Error;
  }>({});

  useEffect(() => {
    promiseRef.current = fetcher(url);
    setResult({ isLoading: true });
  }, [fetcher, url]);

  promiseRef.current
    ?.then((data) => {
      setResult({ data, isLoading: false, error: undefined });
    })
    .catch((error) => {
      setResult({ data: undefined, error, isLoading: false });
    });

  return result;
}
