export function createQuery<Q>(params: URLSearchParams, query: Q, map: (query: Q, key: keyof Q) => (string | string[] | null | undefined)) {
    for (const key in query) {
        const value = map(query, key);

        if (!value) {
            continue;
        }

        if (typeof value === "string") {
            params.append(key, value);
            continue;
        }

        for (const item of value) {
            params.append(key, item);
        }
    }
}