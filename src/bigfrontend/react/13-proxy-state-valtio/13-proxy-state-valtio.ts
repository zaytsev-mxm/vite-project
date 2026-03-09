import React, { useState } from 'react';

// Private symbol used to inject the React setState dispatcher into the proxy
// without exposing it as a public property
const setStateSymbol = Symbol('setState');

export function proxy<T extends object>(initialValue: T): T {
  // Tracks which keys were read during the last render cycle.
  // Only mutations to tracked keys trigger a re-render.
  const keys = new Set<string | symbol>();
  let setState: React.Dispatch<React.SetStateAction<T>>;

  return new Proxy<T>(
    { ...initialValue },
    {
      get(target, key) {
        // Record every property access so we know what the component depends on
        keys.add(key);
        return Reflect.get(target, key);
      },
      set(target, key, value) {
        if (key === setStateSymbol) {
          // useSnapshot calls this each render to refresh the dispatcher reference
          // and reset the tracked keys so only the current render's reads are subscribed
          keys.clear();
          setState = value;
          return true;
        }

        if (Reflect.get(target, key) === value) {
          // Skip re-render if the value hasn't changed
          return true;
        }

        const status = Reflect.set(target, key, value);

        // Only notify React if the write succeeded and the component actually read this key
        if (status && keys.has(key)) {
          keys.clear();
          setState((prev) => ({
            ...prev,
            [key]: value,
          }));
        }
        return status;
      },
    },
  );
}

export function useSnapshot<T extends object>(proxy: T): T {
  const [, setState] = useState(proxy);
  // Inject the current setState dispatcher into the proxy on every render.
  // This also clears the tracked keys so subscriptions reflect only the current render.
  Reflect.set(proxy, setStateSymbol, setState);
  return proxy;
}
