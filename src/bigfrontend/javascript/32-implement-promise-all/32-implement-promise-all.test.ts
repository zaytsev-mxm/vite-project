import { describe, it, expect } from 'vitest';
import { all } from './32-implement-promise-all';

function delayResolve<T>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
}

function delayReject(reason: unknown, ms: number) {
  return new Promise<never>((_resolve, reject) =>
    setTimeout(() => reject(reason), ms),
  );
}

describe('all()', () => {
  it('resolves empty array when input is empty', async () => {
    await expect(all([])).resolves.toEqual([]);
  });

  it('resolves with values in the same order as input, mixing promises and non-promises', async () => {
    const p1 = delayResolve('a', 30);
    const p2 = Promise.resolve('b');
    const p3 = delayResolve(3, 10);
    const nonPromise = 42;

    const result = await all([p1, nonPromise, p2, p3]);

    expect(result).toEqual(['a', 42, 'b', 3]);
  });

  it('rejects with the reason of the first promise that rejects (by time)', async () => {
    const slowResolve = delayResolve('ok', 20);
    const fastReject = delayReject('fail-fast', 5);
    const midResolve = delayResolve('later', 10);

    await expect(all([slowResolve, fastReject, midResolve])).rejects.toBe(
      'fail-fast',
    );
  });

  it('rejects even if a later item (by index) rejects first (time-based)', async () => {
    const firstByIndex = delayResolve('index-0', 50);
    const thirdByIndexRejectsFirst = delayReject(new Error('boom'), 5);
    const secondByIndex = delayResolve('index-1', 30);

    await expect(
      all([firstByIndex, secondByIndex, thirdByIndexRejectsFirst]),
    ).rejects.toEqual(new Error('boom'));
  });

  it('waits for all asynchronous resolutions before resolving', async () => {
    const order: string[] = [];

    const p1 = delayResolve('one', 25).then((v) => {
      order.push(`resolved:${v}`);
      return v;
    });

    const p2 = delayResolve('two', 10).then((v) => {
      order.push(`resolved:${v}`);
      return v;
    });

    const p3 = 'instant';

    const result = await all([p1, p2, p3]);
    // Verify the final result and that both promises had a chance to resolve before all() resolved
    expect(result).toEqual(['one', 'two', 'instant']);
    expect(order).toEqual(['resolved:two', 'resolved:one']);
  });

  it('handles a variety of synchronous values', async () => {
    const result = await all([1, 'x', true, null, undefined, { a: 1 }]);
    expect(result).toEqual([1, 'x', true, null, undefined, { a: 1 }]);
  });

  it('propagates rejection reason as-is (non-Error values)', async () => {
    const r1 = delayReject('string-reason', 5);
    await expect(all([Promise.resolve(1), r1])).rejects.toBe('string-reason');
  });

  it('does not resolve if at least one promise rejects', async () => {
    const willReject = delayReject('nope', 10);
    const willResolveLate = delayResolve('ok', 50);

    // If it wrongly resolved, this await would succeed; we expect rejection instead
    await expect(all([willResolveLate, willReject])).rejects.toBe('nope');
  });
});
