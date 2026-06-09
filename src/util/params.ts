export type SearchParams = Record<string, string | string[] | undefined>;

export function makeParams(searchParams: SearchParams) {
  const params = new URLSearchParams();
  for (const key in searchParams) {
    const val = searchParams[key];
    if (typeof val === "string") {
      params.set(key, val);
    } else if (typeof val !== "undefined") {
      for (const v of val) {
        params.append(key, v);
      }
    }
  }
  return params;
}
