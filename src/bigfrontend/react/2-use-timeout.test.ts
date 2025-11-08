// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeout } from './2-use-timeout';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('callback should be triggered after the delay', () => {
    const callback = vi.fn();
    const delay = 1000;

    renderHook(() => useTimeout(callback, delay));

    // Callback should not be called immediately
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time by delay
    vi.advanceTimersByTime(delay);

    // Callback should be called once
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('timeout should be cleared when unmounted', () => {
    const callback = vi.fn();
    const delay = 1000;

    const { unmount } = renderHook(() => useTimeout(callback, delay));

    // Unmount before timeout completes
    unmount();

    // Fast-forward time
    vi.advanceTimersByTime(delay);

    // Callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });

  it('reset timeout when delay changes', () => {
    const callback = vi.fn();
    let delay = 1000;

    const { rerender } = renderHook(() => useTimeout(callback, delay));

    // Advance time partially
    vi.advanceTimersByTime(500);

    // Change delay
    delay = 2000;
    rerender();

    // Advance time by original delay (total 1500ms now)
    vi.advanceTimersByTime(1000);

    // Callback should not be called yet (timer was reset)
    expect(callback).not.toHaveBeenCalled();

    // Advance remaining time for new delay (total 2500ms now, 2000ms from reset)
    vi.advanceTimersByTime(1000);

    // Callback should be called now
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('NOT reset timeout when callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const delay = 1000;

    const { rerender } = renderHook(
      ({ cb }) => useTimeout(cb, delay),
      { initialProps: { cb: callback1 } }
    );

    // Advance time partially
    vi.advanceTimersByTime(500);

    // Change callback
    rerender({ cb: callback2 });

    // Advance the remaining time
    vi.advanceTimersByTime(500);

    // The new callback should be called (not reset, so the timer completes)
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});