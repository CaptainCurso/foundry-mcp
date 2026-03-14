import { MODULE_FLAG_NAMESPACE, MODULE_ID, WRITE_TOOL_NAMES } from "@foundry-mcp/shared";

export const SETTINGS = {
  allowedFlagNamespaces: "allowedFlagNamespaces",
  allowedOperations: "allowedOperations",
  allowedSystemPaths: "allowedSystemPaths",
  bridgeOwnerUserId: "bridgeOwnerUserId",
  serverToken: "serverToken",
  serverUrl: "serverUrl",
} as const;

export const DEFAULT_ALLOWED_OPERATIONS = [...WRITE_TOOL_NAMES];
export const DEFAULT_ALLOWED_FLAG_NAMESPACES = [MODULE_FLAG_NAMESPACE];
export { MODULE_FLAG_NAMESPACE, MODULE_ID };
