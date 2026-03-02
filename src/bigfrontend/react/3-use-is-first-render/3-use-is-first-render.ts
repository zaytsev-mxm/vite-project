// https://bigfrontend.dev/react/useIsFirstRender

/**
 * Create a hook to tell if it is the first render.
 * ```
 * function App() {
 *   const isFirstRender = useIsFirstRender()
 *   // only true for the first render
 *   ...
 * }
 * ```
 */

import { useEffect, useRef } from 'react';

export function useIsFirstRender(): boolean {
  const isFirstRef = useRef(true);
  useEffect(() => {
    isFirstRef.current = false;
  }, []);
  return isFirstRef.current;
}
