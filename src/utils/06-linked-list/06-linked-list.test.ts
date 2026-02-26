import { describe, it, expect, beforeEach } from 'vitest';
import { LinkedList } from './06-linked-list';

describe('LinkedList', () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  describe('initial state', () => {
    it('starts empty with null head and tail', () => {
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });
  });

  describe('append', () => {
    it('appends a single node and sets head and tail', () => {
      list.append(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
      expect(list.length).toBe(1);
    });

    it('appends multiple nodes to the end', () => {
      list.append(1).append(2).append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.tail?.value).toBe(3);
      expect(list.length).toBe(3);
    });

    it('returns `this` for chaining', () => {
      expect(list.append(1)).toBe(list);
    });
  });

  describe('prepend', () => {
    it('prepends to an empty list and sets head and tail', () => {
      list.prepend(1);
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
      expect(list.length).toBe(1);
    });

    it('prepends multiple nodes to the front', () => {
      list.prepend(3).prepend(2).prepend(1);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.head?.value).toBe(1);
      expect(list.length).toBe(3);
    });

    it('returns `this` for chaining', () => {
      expect(list.prepend(1)).toBe(list);
    });

    it('preserves tail when prepending to a non-empty list', () => {
      list.append(5).prepend(1);
      expect(list.tail?.value).toBe(5);
    });
  });

  describe('remove', () => {
    it('returns false when removing from an empty list', () => {
      expect(list.remove(1)).toBe(false);
    });

    it('returns false when the value is not found', () => {
      list.append(1).append(2);
      expect(list.remove(99)).toBe(false);
      expect(list.length).toBe(2);
    });

    it('removes the head node', () => {
      list.append(1).append(2).append(3);
      const removed = list.remove(1);
      expect(removed).toBe(true);
      expect(list.head?.value).toBe(2);
      expect(list.toArray()).toEqual([2, 3]);
      expect(list.length).toBe(2);
    });

    it('removes the tail node', () => {
      list.append(1).append(2).append(3);
      const removed = list.remove(3);
      expect(removed).toBe(true);
      expect(list.tail?.value).toBe(2);
      expect(list.toArray()).toEqual([1, 2]);
      expect(list.length).toBe(2);
    });

    it('removes a middle node', () => {
      list.append(1).append(2).append(3);
      const removed = list.remove(2);
      expect(removed).toBe(true);
      expect(list.toArray()).toEqual([1, 3]);
      expect(list.length).toBe(2);
    });

    it('sets head and tail to null after removing the only node', () => {
      list.append(1);
      list.remove(1);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });
  });

  describe('find', () => {
    it('returns null on an empty list', () => {
      expect(list.find(1)).toBeNull();
    });

    it('returns the node when value is found', () => {
      list.append(1).append(2).append(3);
      const node = list.find(2);
      expect(node).not.toBeNull();
      expect(node?.value).toBe(2);
    });

    it('returns null when value is not found', () => {
      list.append(1).append(2);
      expect(list.find(99)).toBeNull();
    });

    it('finds the head node', () => {
      list.append(1).append(2);
      expect(list.find(1)?.value).toBe(1);
    });

    it('finds the tail node', () => {
      list.append(1).append(2);
      expect(list.find(2)?.value).toBe(2);
    });
  });

  describe('get', () => {
    it('returns null for an empty list', () => {
      expect(list.get(0)).toBeNull();
    });

    it('returns null for a negative index', () => {
      list.append(1);
      expect(list.get(-1)).toBeNull();
    });

    it('returns null for an out-of-bounds index', () => {
      list.append(1).append(2);
      expect(list.get(2)).toBeNull();
    });

    it('returns the value at index 0', () => {
      list.append(10).append(20);
      expect(list.get(0)).toBe(10);
    });

    it('returns the value at a middle index', () => {
      list.append(10).append(20).append(30);
      expect(list.get(1)).toBe(20);
    });

    it('returns the value at the last index', () => {
      list.append(10).append(20).append(30);
      expect(list.get(2)).toBe(30);
    });
  });

  describe('toArray', () => {
    it('returns an empty array for an empty list', () => {
      expect(list.toArray()).toEqual([]);
    });

    it('returns all values in order', () => {
      list.append(1).append(2).append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('toString', () => {
    it('returns an empty string for an empty list', () => {
      expect(list.toString()).toBe('');
    });

    it('returns comma-separated values', () => {
      list.append(1).append(2).append(3);
      expect(list.toString()).toBe('1,2,3');
    });
  });

  describe('toJSON', () => {
    it('serializes correctly with JSON.stringify', () => {
      list.append(1).append(2).append(3);
      expect(JSON.stringify(list)).toBe('[1,2,3]');
    });
  });

  describe('readonly enforcement', () => {
    it('throws when attempting to write head, tail, or length', () => {
      list.append(1);
      const obj = list as unknown as Record<string, unknown>;
      expect(() => { obj['head'] = null; }).toThrow(TypeError);
      expect(() => { obj['tail'] = null; }).toThrow(TypeError);
      expect(() => { obj['length'] = 999; }).toThrow(TypeError);
    });

    it('throws when attempting to write node.next', () => {
      list.append(1).append(2);
      const node = list.head as unknown as Record<string, unknown>;
      expect(() => { node['next'] = null; }).toThrow(TypeError);
    });

    it('throws when attempting to write node.value', () => {
      list.append(1);
      const node = list.head as unknown as Record<string, unknown>;
      expect(() => { node['value'] = 99; }).toThrow(TypeError);
    });
  });

  describe('mixed operations', () => {
    it('handles a mix of append, prepend and remove correctly', () => {
      list.append(2).append(3).prepend(1);
      expect(list.toArray()).toEqual([1, 2, 3]);
      list.remove(2);
      expect(list.toArray()).toEqual([1, 3]);
      expect(list.length).toBe(2);
    });
  });
});
