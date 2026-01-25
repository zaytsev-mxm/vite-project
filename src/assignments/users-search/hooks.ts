import { useEffect, useState } from 'react';

export function useAjax<T>(url: string, fetcher: (url: string) => Promise<T>) {
  const [result, setResult] = useState<{
    isLoading?: boolean;
    error?: Error;
    data?: T;
  }>({ isLoading: true });

  useEffect(() => {
    setResult({ isLoading: true });

    fetcher(url)
      .then((data) => {
        setResult({ data, isLoading: false });
      })
      .catch((error) => {
        setResult({ error, isLoading: false });
      });
  }, [fetcher, url]);

  return result;
}
