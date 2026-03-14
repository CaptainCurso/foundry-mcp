import type { ToolName } from "@foundry-mcp/shared";

import { MODULE_ID } from "./constants.js";
import { BridgeClient } from "./bridge-client.js";
import { executeOperation } from "./operations.js";
import { getClientSettings, getWorldSettings } from "./settings.js";

interface BridgeJob {
  dryRun: boolean;
  jobId: string;
  payload: Record<string, unknown>;
  requestId: string;
  toolName: ToolName;
}

export async function startBridgeRuntime(): Promise<void> {
  const clientSettings = getClientSettings();
  const worldSettings = getWorldSettings();

  if (!game.user?.isGM) {
    return;
  }

  if (!worldSettings.bridgeOwnerUserId || game.user.id !== worldSettings.bridgeOwnerUserId) {
    return;
  }

  if (!clientSettings.serverUrl || !clientSettings.serverToken) {
    ui.notifications?.warn?.("Foundry MCP Bridge: configure the bridge server URL and bearer token first.");
    return;
  }

  const client = new BridgeClient(clientSettings);
  const session = await client.registerSession({
    foundryUserId: String(game.user.id),
    foundryUserName: String(game.user.name ?? ""),
    moduleVersion: "0.1.0",
    worldId: String(game.world?.id ?? ""),
    worldTitle: String(game.world?.title ?? ""),
  });

  const sessionId = String(session.sessionId);
  setInterval(() => {
    void client.heartbeat(sessionId).catch((error) => {
      console.error(`${MODULE_ID} heartbeat failed`, error);
    });
  }, 10_000);

  async function poll(): Promise<void> {
    try {
      const response = await client.claimJob(sessionId);
      const job = response.job as BridgeJob | null;
      if (job) {
        const result = await executeOperation(job.toolName, job.payload, {
          allowedFlagNamespaces: worldSettings.allowedFlagNamespaces,
          allowedOperations: worldSettings.allowedOperations,
          allowedSystemPaths: worldSettings.allowedSystemPaths,
        });
        await client.submitResult(sessionId, job.jobId, result);
      }
    } catch (error) {
      console.error(`${MODULE_ID} poll failed`, error);
    } finally {
      window.setTimeout(() => {
        void poll();
      }, Number(session.pollIntervalMs ?? 2500));
    }
  }

  void poll();
}
