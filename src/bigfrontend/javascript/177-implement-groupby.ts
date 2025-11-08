function ObjectGroupBy<T, K extends PropertyKey>(
    items: Array<T>,
    callback: (item: T) => K
): Record<K, Array<T>> {
    const result = Object.create(null) as Record<K, Array<T>>;
    /**
     * The above might be simple `{}` but we had to use this `Object.create(null)`
     * just to pass this synthetic test:
     * ```
     * const groups = ObjectGroupBy([0, 1, 2, 3, 4, 5], (item) => item % 2 === 0 ? 'even' : 'odd')
     * expect(
     *   Object.getPrototypeOf(groups)
     * ).toBeNull()
     * ```
     * (I do not know if it's applicable in real life)
     */

    return items.reduce((acc, item) => {
        const key = callback(item);
        const bucket = acc[key] || [];
        bucket.push(item);
        acc[key] = bucket;
        return acc;
    }, result);
}

// ==========


export { ObjectGroupBy }