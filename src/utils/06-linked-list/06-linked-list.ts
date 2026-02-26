class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;

  constructor(value: T, next: LinkedListNode<T> | null) {
    this.value = value;
    this.next = next;
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
      this.#tail.next = node;
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
        current.next = current.next.next;
        this.#length--;
        return true;
      }
      current = current.next;
    }

    return false;
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
}
