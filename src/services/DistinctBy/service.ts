export function distinctBy<T, K>(arr: T[], key: (t: T) => K): T[] {
    const map = new Set<K>();
    const result: T[] = [];
    for (let i = 0; i < arr.length; i++) {
        const k = key(arr[i]);
        if (!map.has(k)) {
            map.add(k);
            result.push(arr[i]);
        }
    }
    return result;
}
