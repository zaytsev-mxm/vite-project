import React, { useState } from 'react';

const setStateSymbol = Symbol('setState');

export function proxy<T extends object>(initialValue: T): T {
  const keys = new Set<string | symbol>();
  let setState: React.Dispatch<React.SetStateAction<T>>;

  return new Proxy<T>(
    { ...initialValue },
    {
      get(target, key) {
        keys.add(key);
        return Reflect.get(target, key);
      },
      set(target, key, value) {
        if (key === setStateSymbol) {
          // This is just to update the dispatch reference in this method, won't be required
          setState = value;
          return false;
        }
        if (Reflect.get(target, key) === value) {
          // no-change occurred w.r.t prev value
          return true;
        }

        const status = Reflect.set(target, key, value);

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
  // Pass dispatch handler to set interceptor in proxy method
  Reflect.set(proxy, setStateSymbol, setState);
  return proxy;
}
