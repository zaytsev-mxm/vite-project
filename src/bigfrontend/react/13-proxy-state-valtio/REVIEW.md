# Implementation Review: proxy-state-valtio

## What it does

`proxy(initialValue)` wraps an object in a JS `Proxy` that:
- Tracks which keys are **read** (via `get` trap) into a `keys` set
- On a **write**, triggers React's `setState` only if the mutated key was previously read

`useSnapshot(proxy)` is a React hook that:
- Wires up a `useState` dispatcher into the proxy via a private symbol
- Clears `keys` on each render so subscriptions stay accurate to the current render cycle
- Returns the proxy directly (not an immutable snapshot)

---

## Known limitations vs. real valtio

### 1. Single subscriber only

`setState` is a single `let` variable inside the proxy closure. If two components call `useSnapshot` on the same proxy, the second one overwrites the dispatcher, and only the last-mounted component re-renders on mutations.

Real valtio maintains a **set of subscribers** and notifies all of them.

---

### 2. Mutation before mount throws

If `proxy` is mutated before any component calls `useSnapshot`, `setState` is `undefined` and calling it on line 40 throws `TypeError: setState is not a function`.

Real valtio uses `useSyncExternalStore` which separates subscription from rendering, so pre-mount mutations are safe.

---

### 3. Mutable "snapshot"

`useSnapshot` returns the proxy itself, not an immutable copy. A component (or a child) can accidentally mutate it, triggering side effects outside of normal state flow.

Real valtio returns a deep-frozen plain object via `createSnapshot`, making mutations impossible from within render.

---

### 4. No nested object support

`proxy` shallow-spreads `initialValue` (`{ ...initialValue }`), so nested objects are not proxied. Mutating a nested property (e.g. `state.user.name = 'bob'`) bypasses the `set` trap entirely — no re-render occurs.

Real valtio recursively proxies nested objects and tracks deep mutations.

---

### 5. No per-component key tracking

`keys` is shared across all subscribers of a proxy. With multiple components, their tracked keys intermix: component A's render populates `keys`, then component B's render clears and repopulates it. Mutations that should re-render A may not, because B's `keys` overwrote A's.

Real valtio tracks an "affected" set **per component instance** using `proxy-compare`.

---

### 6. Array and collection mutations

Mutating arrays via index (`state.list[0] = x`) or methods like `.push()` is unreliable:
- `.push()` triggers multiple `set` calls (`0`, `length`), each potentially firing `setState` separately, causing extra renders
- The spread in `setState` (`{ ...prev, [key]: value }`) does not copy array contents correctly for index-based mutations

Real valtio handles arrays and `Map`/`Set` explicitly with dedicated traps and snapshot logic.

---

### 7. `get` trap tracks internal React/JS property accesses

React, the JS runtime, and libraries may access properties on objects for internal reasons (e.g. `Symbol.iterator`, `Symbol.toPrimitive`, `then`, `$$typeof`). All of these go through the `get` trap and get added to `keys`, potentially causing spurious re-renders if those same keys are later written to.

A guard like `if (typeof key === 'symbol') return Reflect.get(target, key)` would mitigate this for symbol-keyed internals.

---

### 8. `useState(proxy)` as initial state

`useState(proxy)` passes the proxy as the initial state value to React. React may internally inspect or copy this value (e.g. during concurrent rendering or DevTools inspection), which triggers the `get` trap and pollutes `keys` before the component has rendered.

Real valtio never exposes the proxy to `useState` directly.

---

## Summary table

| Concern | This implementation | Real valtio |
|---|---|---|
| Multiple subscribers | Single, last-writer-wins | Set of subscribers |
| Pre-mount mutations | Throws | Safe |
| Snapshot immutability | None (returns proxy) | Deep-frozen object |
| Nested objects | Not proxied | Recursively proxied |
| Per-component tracking | Shared `keys` set | Per-instance via `proxy-compare` |
| Arrays / Map / Set | Unreliable | Explicitly supported |
| Symbol/internal key pollution | Unguarded | Filtered |
| React integration | `useState` | `useSyncExternalStore` |
