import { describe, it, expect, beforeEach } from 'vitest';
import { Queue, Stack } from './08-queue-and-stack';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('add', () => {
    it('returns the added item', () => {
      expect(queue.add(1)).toBe(1);
    });

    it('adds multiple items', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);
      expect(queue.shift()).toBe(1);
    });
  });

  describe('size', () => {
    it('returns 0 for an empty queue', () => {
      expect(queue.size).toBe(0);
    });

    it('reflects the number of items', () => {
      queue.add(1);
      queue.add(2);
      expect(queue.size).toBe(2);
    });

    it('decreases after shift', () => {
      queue.add(1);
      queue.shift();
      expect(queue.size).toBe(0);
    });
  });

  describe('peek', () => {
    it('returns null on an empty queue', () => {
      expect(queue.peek()).toBeNull();
    });

    it('returns the front item without removing it', () => {
      queue.add(1);
      queue.add(2);
      expect(queue.peek()).toBe(1);
      expect(queue.size).toBe(2);
    });
  });

  describe('shift', () => {
    it('returns null when queue is empty', () => {
      expect(queue.shift()).toBeNull();
    });

    it('removes and returns items in FIFO order', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);
      expect(queue.shift()).toBe(1);
      expect(queue.shift()).toBe(2);
      expect(queue.shift()).toBe(3);
    });

    it('returns null after all items are removed', () => {
      queue.add(1);
      queue.shift();
      expect(queue.shift()).toBeNull();
    });
  });
});

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  describe('add', () => {
    it('returns the added item', () => {
      expect(stack.add(1)).toBe(1);
    });

    it('adds multiple items', () => {
      stack.add(1);
      stack.add(2);
      stack.add(3);
      expect(stack.pop()).toBe(3);
    });
  });

  describe('size', () => {
    it('returns 0 for an empty stack', () => {
      expect(stack.size).toBe(0);
    });

    it('reflects the number of items', () => {
      stack.add(1);
      stack.add(2);
      expect(stack.size).toBe(2);
    });

    it('decreases after pop', () => {
      stack.add(1);
      stack.pop();
      expect(stack.size).toBe(0);
    });
  });

  describe('peek', () => {
    it('returns null on an empty stack', () => {
      expect(stack.peek()).toBeNull();
    });

    it('returns the top item without removing it', () => {
      stack.add(1);
      stack.add(2);
      expect(stack.peek()).toBe(2);
      expect(stack.size).toBe(2);
    });
  });

  describe('pop', () => {
    it('returns null when stack is empty', () => {
      expect(stack.pop()).toBeNull();
    });

    it('removes and returns items in LIFO order', () => {
      stack.add(1);
      stack.add(2);
      stack.add(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });

    it('returns null after all items are removed', () => {
      stack.add(1);
      stack.pop();
      expect(stack.pop()).toBeNull();
    });
  });
});
