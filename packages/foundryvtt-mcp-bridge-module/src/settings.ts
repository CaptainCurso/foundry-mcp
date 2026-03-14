import { DEFAULT_ALLOWED_FLAG_NAMESPACES, DEFAULT_ALLOWED_OPERATIONS, MODULE_ID, SETTINGS } from "./constants.js";

function csv(value: string[]): string {
  return value.join(",");
}

export function registerSettings(): void {
  game.settings.register(MODULE_ID, SETTINGS.serverUrl, {
    config: true,
    default: "http://127.0.0.1:3310",
    hint: "The local Foundry MCP bridge server URL.",
    name: "Bridge Server URL",
    requiresReload: true,
    scope: "client",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.serverToken, {
    config: true,
    default: "",
    hint: "Bearer token that authenticates this module to the local bridge server.",
    name: "Bridge Bearer Token",
    requiresReload: true,
    scope: "client",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.bridgeOwnerUserId, {
    config: true,
    default: "",
    hint: "Only this GM user id is allowed to run the bridge polling loop.",
    name: "Bridge Owner User ID",
    requiresReload: true,
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedOperations, {
    config: true,
    default: csv(DEFAULT_ALLOWED_OPERATIONS),
    hint: "Comma-separated allowlist of write tool names.",
    name: "Allowed Operations",
    requiresReload: true,
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedFlagNamespaces, {
    config: true,
    default: csv(DEFAULT_ALLOWED_FLAG_NAMESPACES),
    hint: "Comma-separated allowlist of flag namespaces. Defaults to the module-owned namespace only.",
    name: "Allowed Flag Namespaces",
    requiresReload: true,
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedSystemPaths, {
    config: true,
    default: "",
    hint: "Comma-separated allowlist of dotted system paths for Actor and Item writes.",
    name: "Allowed System Paths",
    requiresReload: true,
    scope: "world",
    type: String,
  });
}

export function getClientSettings() {
  return {
    serverToken: String(game.settings.get(MODULE_ID, SETTINGS.serverToken) ?? ""),
    serverUrl: String(game.settings.get(MODULE_ID, SETTINGS.serverUrl) ?? ""),
  };
}

export function getWorldSettings() {
  return {
    allowedFlagNamespaces: String(game.settings.get(MODULE_ID, SETTINGS.allowedFlagNamespaces) ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    allowedOperations: String(game.settings.get(MODULE_ID, SETTINGS.allowedOperations) ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    allowedSystemPaths: String(game.settings.get(MODULE_ID, SETTINGS.allowedSystemPaths) ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    bridgeOwnerUserId: String(game.settings.get(MODULE_ID, SETTINGS.bridgeOwnerUserId) ?? ""),
  };
}
