import { LinkedList } from '../06-linked-list/06-linked-list';

export interface IQueue<T> {
  readonly size: number;
  add(item: T): T;
  peek(): T | null;
  shift(): T | null;
}

export class QueueOptimised<T> implements IQueue<T> {
  #list = new LinkedList<T>();

  get size() {
    return this.#list.length;
  }

  add(item: T) {
    this.#list.append(item);
    return item;
  }

  peek() {
    return this.#list.head?.value ?? null;
  }

  shift() {
    const value = this.#list.head?.value ?? null;
    if (this.#list.head) this.#list.remove(this.#list.head.value);
    return value;
  }
}

export class Queue<T> implements IQueue<T> {
  #queue: T[] = [];

  get size() {
    return this.#queue.length;
  }

  add(item: T) {
    this.#queue.push(item);
    return item;
  }

  peek() {
    return this.#queue[0] ?? null;
  }

  shift() {
    return this.#queue.shift() ?? null;
  }
}

export class Stack<T> {
  #stack: T[] = [];

  get size() {
    return this.#stack.length;
  }

  add(item: T) {
    this.#stack.push(item);
    return item;
  }

  peek() {
    return this.#stack[this.#stack.length - 1] ?? null;
  }

  pop() {
    return this.#stack.pop() ?? null;
  }
}
