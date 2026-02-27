export class Queue<T> {
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
