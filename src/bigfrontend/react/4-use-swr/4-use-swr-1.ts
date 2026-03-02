// https://bigfrontend.dev/react/useSWR-1

/**
 * The task was:
 * SWR is a popular library of data fetching.
 * Let's try to implement the basic usage by ourselves.
 * ```
 * import React from 'react'
 * function App() {
 *   const { data, error } = useSWR('/api', fetcher)
 *   if (error) return <div>failed</div>
 *   if (!data) return <div>loading</div>
 *   return <div>succeeded</div>
 * }
 * ```
 * this is not to replicate the true implementation of useSWR()
 * The first argument key is for deduplication, we can safely ignore it for now
 */

import { useEffect, useRef, useState } from 'react';

type Output<T, E> = {
  data?: T;
  error?: E;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromise<T = unknown>(obj?: any): obj is Promise<T> {
  return (
    !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function'
  );
}

export function useSWR<T = unknown, E = unknown>(
  _key: string,
  fetcher: () => T | Promise<T>,
): Output<T, E> {
  const maybePromiseRef = useRef(fetcher());
  const [state, setState] = useState<Output<T, E>>({});

  useEffect(() => {
    if (isPromise(maybePromiseRef.current)) {
      maybePromiseRef.current
        .then((data) => {
          setState({ data });
        })
        .catch((error) => {
          setState({ error });
        });
    }
  }, []);

  if (isPromise(maybePromiseRef.current)) {
    return state;
  } else {
    return { data: maybePromiseRef.current };
  }
}
