import { BridgeError, ERROR_CODES } from "./errors.js";

export interface SystemChange {
  path: string;
  value: unknown;
}

export interface FlagChange {
  namespace: string;
  key: string;
  value: unknown;
}

export function assertAllowedNamespaces(
  flags: FlagChange[] | undefined,
  allowedNamespaces: string[],
): void {
  if (!flags?.length) {
    return;
  }

  const allowed = new Set(allowedNamespaces);
  for (const flag of flags) {
    if (!allowed.has(flag.namespace)) {
      throw new BridgeError(
        ERROR_CODES.forbiddenField,
        `Flag namespace "${flag.namespace}" is not allowlisted.`,
        400,
        { namespace: flag.namespace },
      );
    }
  }
}

export function assertAllowedSystemPaths(
  systemChanges: SystemChange[] | undefined,
  allowedPaths: string[],
): void {
  if (!systemChanges?.length) {
    return;
  }

  const allowed = new Set(allowedPaths);
  for (const change of systemChanges) {
    if (!allowed.has(change.path)) {
      throw new BridgeError(
        ERROR_CODES.forbiddenField,
        `System path "${change.path}" is not allowlisted.`,
        400,
        { path: change.path },
      );
    }
  }
}

export function assertAllowedFields(
  requestedFields: string[],
  allowedFields: string[],
  context: string,
): void {
  const allowed = new Set(allowedFields);
  const forbidden = requestedFields.filter((field) => !allowed.has(field));
  if (forbidden.length > 0) {
    throw new BridgeError(
      ERROR_CODES.forbiddenField,
      `${context} contains non-allowlisted fields.`,
      400,
      { forbidden },
    );
  }
}

export function pathChangesToObject(changes: SystemChange[] | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const change of changes ?? []) {
    const segments = change.path.split(".");
    let cursor: Record<string, unknown> = result;

    for (const [index, segment] of segments.entries()) {
      if (index === segments.length - 1) {
        cursor[segment] = change.value;
        continue;
      }

      if (!(segment in cursor) || typeof cursor[segment] !== "object" || cursor[segment] === null) {
        cursor[segment] = {};
      }
      cursor = cursor[segment] as Record<string, unknown>;
    }
  }

  return result;
}

export function flagChangesToObject(flags: FlagChange[] | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const flag of flags ?? []) {
    if (!(flag.namespace in result)) {
      result[flag.namespace] = {};
    }

    const namespace = result[flag.namespace] as Record<string, unknown>;
    namespace[flag.key] = flag.value;
  }

  return result;
}
