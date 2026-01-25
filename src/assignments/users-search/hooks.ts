import { useEffect, useRef, useState } from 'react';

type Options = {
  skipFirstMount?: boolean;
};

const cache = new Map<string, Promise<unknown>>();

export function useAjax<T>(
  url: string,
  fetcher: (url: string) => Promise<T>,
  options?: Options,
) {
  const mountedRef = useRef(false);
  const [result, setResult] = useState<{
    isLoading?: boolean;
    error?: Error;
    data?: T;
  }>({ isLoading: false });

  useEffect(() => {
    console.log(mountedRef.current);
    if (options?.skipFirstMount && !mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    mountedRef.current = true;
    setResult({ isLoading: true });

    if (!cache.has(url)) {
      cache.set(url, fetcher(url));
    }

    const promise = cache.get(url) as Promise<T>;

    promise
      .then((data) => {
        console.log({ data });
        setResult({ data, isLoading: false });
      })
      .catch((error) => {
        console.log({ error });
        setResult({ error, isLoading: false });
      });

    console.log({ promise });

    return () => {};
  }, [fetcher, options?.skipFirstMount, url]);

  return result;
}
