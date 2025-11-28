// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useHover } from './6-use-hover.ts';
import type { RefCallback } from 'react';

describe('useHover', () => {
  test('attaches and removes the handler', () => {
    const el = document.createElement('div');
    const addSpy = vi.spyOn(el, 'addEventListener');
    const removeSpy = vi.spyOn(el, 'removeEventListener');

    const { result, unmount } = renderHook(() => useHover<HTMLDivElement>());

    // attach ref -> should register listeners in effect
    act(() => {
      const ref = result.current[0] as RefCallback<HTMLDivElement>;
      ref(el);
    });

    expect(addSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(addSpy).toHaveBeenCalledTimes(2);

    // unmount -> cleanup should remove listeners
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledTimes(2);
  });

  test('sets the isHover values to true when hovered, and to false when un-hovered', () => {
    const el = document.createElement('div');
    const { result } = renderHook(() => useHover<HTMLDivElement>());

    act(() => {
      const ref = result.current[0] as RefCallback<HTMLDivElement>;
      ref(el);
    });

    expect(result.current[1]).toBe(false);

    act(() => {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
    expect(result.current[1]).toBe(true);

    act(() => {
      el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
    expect(result.current[1]).toBe(false);
  });
});
