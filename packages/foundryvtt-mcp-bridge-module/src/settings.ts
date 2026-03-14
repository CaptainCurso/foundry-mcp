import { DEFAULT_ALLOWED_FLAG_NAMESPACES, DEFAULT_ALLOWED_OPERATIONS, MODULE_ID, SETTINGS } from "./constants.js";
import { BridgeSettingsForm } from "./settings-menu.js";

function csv(value: string[]): string {
  return value.join(",");
}

export function registerSettings(): void {
  game.settings.registerMenu(MODULE_ID, "bridgeSettingsMenu", {
    hint: "Configure the Foundry MCP Bridge connection, bridge owner, and write allowlists.",
    icon: "fas fa-plug",
    label: "Bridge Settings",
    name: "Foundry MCP Bridge",
    restricted: false,
    type: BridgeSettingsForm,
  });

  game.settings.register(MODULE_ID, SETTINGS.serverUrl, {
    config: false,
    default: "http://127.0.0.1:3310",
    hint: "The local Foundry MCP bridge server URL.",
    name: "Bridge Server URL",
    scope: "client",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.serverToken, {
    config: false,
    default: "",
    hint: "Bearer token that authenticates this module to the local bridge server.",
    name: "Bridge Bearer Token",
    scope: "client",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.bridgeOwnerUserId, {
    config: false,
    default: "",
    hint: "Only this GM user id is allowed to run the bridge polling loop.",
    name: "Bridge Owner User ID",
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedOperations, {
    config: false,
    default: csv(DEFAULT_ALLOWED_OPERATIONS),
    hint: "Comma-separated allowlist of write tool names.",
    name: "Allowed Operations",
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedFlagNamespaces, {
    config: false,
    default: csv(DEFAULT_ALLOWED_FLAG_NAMESPACES),
    hint: "Comma-separated allowlist of flag namespaces. Defaults to the module-owned namespace only.",
    name: "Allowed Flag Namespaces",
    scope: "world",
    type: String,
  });

  game.settings.register(MODULE_ID, SETTINGS.allowedSystemPaths, {
    config: false,
    default: "",
    hint: "Comma-separated allowlist of dotted system paths for Actor and Item writes.",
    name: "Allowed System Paths",
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
