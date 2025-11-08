/* @vitest-environment jsdom */

import { describe, it, expect } from 'vitest';
import { nextRightSibling } from './01-next-right-sibling';

function el(tag: string, id: string): HTMLElement {
  const node = document.createElement(tag);
  node.id = id;
  return node;
}

describe('nextRightSibling', () => {
  it('returns the next element to the right within the same level', () => {
    // root
    const root = el('div', 'root');

    // level 1
    const p1 = el('div', 'p1');
    const p2 = el('div', 'p2');
    root.append(p1, p2);

    // level 2 under p1
    const a1 = el('div', 'a1');
    const a2 = el('div', 'a2');
    p1.append(a1, a2);

    // level 2 under p2
    const b1 = el('div', 'b1');
    const b2 = el('div', 'b2');
    p2.append(b1, b2);

    // a1 -> a2 (same parent)
    expect(nextRightSibling(root, a1)).toBe(a2);

    // a2 -> b1 (across different parents, same level)
    expect(nextRightSibling(root, a2)).toBe(b1);

    // b1 -> b2 (same parent)
    expect(nextRightSibling(root, b1)).toBe(b2);

    // b2 is last in its level -> null
    expect(nextRightSibling(root, b2)).toBeNull();
  });

  it('returns null when target is the root (no peers at its level)', () => {
    const root = el('div', 'root');
    expect(nextRightSibling(root, root)).toBeNull();
  });

  it('works for deeper trees (correct level traversal)', () => {
    // Build a deeper tree:
    // root
    // ├─ p1
    // │  ├─ a1
    // │  │  └─ x1
    // │  └─ a2
    // └─ p2
    //    └─ b1
    const root = el('div', 'root');

    const p1 = el('div', 'p1');
    const p2 = el('div', 'p2');
    root.append(p1, p2);

    const a1 = el('div', 'a1');
    const a2 = el('div', 'a2');
    p1.append(a1, a2);

    const b1 = el('div', 'b1');
    p2.append(b1);

    const x1 = el('div', 'x1');
    a1.append(x1);

    // Level 2 is [a1, a2, b1]; verify neighbors
    expect(nextRightSibling(root, a1)).toBe(a2);
    expect(nextRightSibling(root, a2)).toBe(b1);
    expect(nextRightSibling(root, b1)).toBeNull();

    // Level 3 is [x1]; only one element -> null
    expect(nextRightSibling(root, x1)).toBeNull();
  });
});
