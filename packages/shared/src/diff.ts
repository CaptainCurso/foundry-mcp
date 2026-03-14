export interface DiffEntry {
  path: string;
  before: unknown;
  after: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function diffValues(before: unknown, after: unknown, basePath = ""): DiffEntry[] {
  if (Object.is(before, after)) {
    return [];
  }

  if (Array.isArray(before) || Array.isArray(after)) {
    return [{ path: basePath || "$", before, after }];
  }

  if (isObject(before) && isObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    const entries: DiffEntry[] = [];

    for (const key of keys) {
      const nextPath = basePath ? `${basePath}.${key}` : key;
      entries.push(...diffValues(before[key], after[key], nextPath));
    }

    return entries;
  }

  return [{ path: basePath || "$", before, after }];
}
