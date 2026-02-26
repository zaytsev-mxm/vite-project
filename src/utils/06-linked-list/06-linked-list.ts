const _next = new WeakMap<
  LinkedListNode<unknown>,
  LinkedListNode<unknown> | null
>();

class LinkedListNode<T> {
  #value: T;

  get value(): T {
    return this.#value;
  }
  get next(): LinkedListNode<T> | null {
    return (_next.get(this) as LinkedListNode<T>) ?? null;
  }

  constructor(value: T, next: LinkedListNode<T> | null) {
    this.#value = value;
    _next.set(this, next);
  }
}

export class LinkedList<T> {
  #head: LinkedListNode<T> | null = null;
  #tail: LinkedListNode<T> | null = null;
  #length: number = 0;

  get head(): LinkedListNode<T> | null {
    return this.#head;
  }
  get tail(): LinkedListNode<T> | null {
    return this.#tail;
  }
  get length(): number {
    return this.#length;
  }

  append(value: T): this {
    this.#length++;
    const node = new LinkedListNode(value, null);

    if (this.#tail === null) {
      this.#head = node;
      this.#tail = node;
    } else {
      _next.set(this.#tail, node);
      this.#tail = node;
    }
    return this;
  }

  prepend(value: T): this {
    this.#length++;
    const node = new LinkedListNode(value, this.#head);
    this.#head = node;
    if (this.#tail === null) this.#tail = node;
    return this;
  }

  remove(value: T): boolean {
    if (!this.#head) return false;

    if (this.#head.value === value) {
      this.#head = this.#head.next;
      if (this.#head === null) this.#tail = null;
      this.#length--;
      return true;
    }

    let current = this.#head;
    while (current.next) {
      if (current.next.value === value) {
        if (current.next === this.#tail) this.#tail = current;
        _next.set(current, current.next.next);
        this.#length--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  removeAfter(node: LinkedListNode<T>): boolean {
    if (node.next === null) return false;
    if (node.next === this.#tail) this.#tail = node;
    _next.set(node, node.next.next);
    this.#length--;
    return true;
  }

  insertAfter(node: LinkedListNode<T>, value: T): this {
    const newNode = new LinkedListNode(value, node.next);
    _next.set(node, newNode);
    if (node === this.#tail) this.#tail = newNode;
    this.#length++;
    return this;
  }

  find(value: T): LinkedListNode<T> | null {
    let current = this.#head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  get(index: number): T | null {
    if (index < 0 || index >= this.#length) return null;

    let current = this.#head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current ? current.value : null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.#head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  toString(): string {
    return this.toArray().join(',');
  }

  toJSON(): T[] {
    return this.toArray();
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

// Usage
const numsLinkedList = new LinkedList<number>();
numsLinkedList.append(1).append(2).append(3);

console.log(numsLinkedList.toString()); // "1,2,3"
console.log(numsLinkedList.toArray()); // [1, 2, 3]
console.log(numsLinkedList.length); // 3

numsLinkedList.prepend(0);
console.log(numsLinkedList.toString()); // "0,1,2,3"

numsLinkedList.remove(2);
console.log(numsLinkedList.toString()); // "0,1,3"

console.log(JSON.stringify(numsLinkedList)); // [0, 1, 3]
