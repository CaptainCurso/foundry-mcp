import { describe, expect, it } from "vitest";

import { AuditLogger } from "../src/services/audit-logger.js";
import { ApprovalStore } from "../src/services/approval-store.js";
import { loadConfig } from "../src/services/config.js";
import { ToolRunner } from "../src/services/tool-runner.js";
import { SessionRegistry } from "../src/services/session-registry.js";

describe("ToolRunner", () => {
  it("returns BRIDGE_OFFLINE when no Foundry session is connected", async () => {
    const runner = new ToolRunner({
      approvalStore: new ApprovalStore(300),
      auditLogger: new AuditLogger(),
      config: loadConfig({
        BRIDGE_ALLOWED_ORIGINS: "http://127.0.0.1",
        BRIDGE_APPROVAL_TTL_SECONDS: "300",
        BRIDGE_BIND_HOST: "127.0.0.1",
        BRIDGE_BIND_PORT: "3310",
        BRIDGE_DEV_MODE: "true",
        BRIDGE_LOG_LEVEL: "info",
        BRIDGE_REQUEST_TIMEOUT_MS: "5000",
        BRIDGE_SHARED_TOKEN: "secret",
      }),
      jobQueue: {
        enqueueAndWait: async () => {
          throw new Error("should not be called");
        },
      } as any,
      sessionRegistry: new SessionRegistry(),
    });

    const result = await runner.runTool("find_documents", { query: "bridge" });

    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("BRIDGE_OFFLINE");
  });
});
