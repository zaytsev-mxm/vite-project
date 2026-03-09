// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { proxy, useSnapshot } from './13-proxy-state-valtio';

afterEach(cleanup);

describe('proxy', () => {
  it('returns initial values', () => {
    const state = proxy({ count: 0, name: 'alice' });
    expect(state.count).toBe(0);
    expect(state.name).toBe('alice');
  });

  it('allows direct mutation', () => {
    const state = proxy({ count: 0 });
    state.count = 5;
    expect(state.count).toBe(5);
  });

  it('does not change value when setting same value', () => {
    const state = proxy({ count: 42 });
    state.count = 42;
    expect(state.count).toBe(42);
  });
});

describe('useSnapshot', () => {
  it('renders the initial proxy value', () => {
    const state = proxy({ count: 0 });

    function Counter() {
      const snap = useSnapshot(state);
      return <div data-testid="count">{snap.count}</div>;
    }

    render(<Counter />);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('re-renders when a tracked property changes', async () => {
    const state = proxy({ count: 0 });

    function Counter() {
      const snap = useSnapshot(state);
      return <div data-testid="count">{snap.count}</div>;
    }

    render(<Counter />);
    expect(screen.getByTestId('count').textContent).toBe('0');

    await act(async () => {
      state.count = 1;
    });

    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('re-renders multiple times on successive mutations', async () => {
    const state = proxy({ count: 0 });

    function Counter() {
      const snap = useSnapshot(state);
      return <div data-testid="count">{snap.count}</div>;
    }

    render(<Counter />);

    await act(async () => {
      state.count = 10;
    });
    expect(screen.getByTestId('count').textContent).toBe('10');

    await act(async () => {
      state.count = 20;
    });
    expect(screen.getByTestId('count').textContent).toBe('20');
  });

  it('does not re-render when setting the same value', async () => {
    const state = proxy({ count: 5 });
    let renderCount = 0;

    function Counter() {
      renderCount++;
      const snap = useSnapshot(state);
      return <div data-testid="count">{snap.count}</div>;
    }

    render(<Counter />);
    const rendersAfterMount = renderCount;

    await act(async () => {
      state.count = 5;
    });

    expect(renderCount).toBe(rendersAfterMount);
    expect(screen.getByTestId('count').textContent).toBe('5');
  });

  it('tracks multiple properties independently', async () => {
    const state = proxy({ a: 1, b: 2 });

    function Display() {
      const snap = useSnapshot(state);
      return (
        <>
          <span data-testid="a">{snap.a}</span>
          <span data-testid="b">{snap.b}</span>
        </>
      );
    }

    render(<Display />);
    expect(screen.getByTestId('a').textContent).toBe('1');
    expect(screen.getByTestId('b').textContent).toBe('2');

    await act(async () => {
      state.a = 10;
    });

    expect(screen.getByTestId('a').textContent).toBe('10');
    expect(screen.getByTestId('b').textContent).toBe('2');
  });
});
