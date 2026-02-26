import { describe, it, expect, vi } from 'vitest';
import { cachingDecorator } from './07-caching-decorator';

describe('cachingDecorator', () => {
  it('returns the correct result', () => {
    const add = (a: number, b: number) => a + b;
    const cachedAdd = cachingDecorator(add);
    expect(cachedAdd(1, 2)).toBe(3);
  });

  it('calls the original function only once for the same arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const cachedFn = cachingDecorator(fn);

    cachedFn(1, 2);
    cachedFn(1, 2);
    cachedFn(1, 2);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const cachedFn = cachingDecorator(fn);

    cachedFn(1, 2);
    cachedFn(3, 4);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('returns cached result on repeated calls', () => {
    const fn = vi.fn((x: number) => x * 2);
    const cachedFn = cachingDecorator(fn);

    const first = cachedFn(5);
    const second = cachedFn(5);

    expect(first).toBe(10);
    expect(second).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('handles functions with no arguments', () => {
    let count = 0;
    const fn = vi.fn(() => ++count);
    const cachedFn = cachingDecorator(fn);

    expect(cachedFn()).toBe(1);
    expect(cachedFn()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('handles string arguments', () => {
    const fn = vi.fn((s: string) => s.toUpperCase());
    const cachedFn = cachingDecorator(fn);

    expect(cachedFn('hello')).toBe('HELLO');
    expect(cachedFn('hello')).toBe('HELLO');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('distinguishes between different argument types', () => {
    const fn = vi.fn((a: unknown) => String(a));
    const cachedFn = cachingDecorator(fn);

    cachedFn(1);
    cachedFn('1');

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
