import {
  DEFAULT_APPROVAL_TTL_SECONDS,
  DEFAULT_REQUEST_TIMEOUT_MS,
} from "@foundry-mcp/shared";

export interface BridgeConfig {
  allowedOrigins: string[];
  approvalTtlSeconds: number;
  bindHost: string;
  bindPort: number;
  devMode: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  requestTimeoutMs: number;
  sharedToken: string;
}

function parseInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BridgeConfig {
  return {
    allowedOrigins: (env.BRIDGE_ALLOWED_ORIGINS ?? "http://127.0.0.1")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    approvalTtlSeconds: parseInteger(env.BRIDGE_APPROVAL_TTL_SECONDS, DEFAULT_APPROVAL_TTL_SECONDS),
    bindHost: env.BRIDGE_BIND_HOST ?? "127.0.0.1",
    bindPort: parseInteger(env.BRIDGE_BIND_PORT, 3310),
    devMode: env.BRIDGE_DEV_MODE === "true",
    logLevel: (env.BRIDGE_LOG_LEVEL as BridgeConfig["logLevel"]) ?? "info",
    requestTimeoutMs: parseInteger(env.BRIDGE_REQUEST_TIMEOUT_MS, DEFAULT_REQUEST_TIMEOUT_MS),
    sharedToken: env.BRIDGE_SHARED_TOKEN ?? "replace-me",
  };
}
