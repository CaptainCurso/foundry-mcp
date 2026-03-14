import { describe, expect, it } from "vitest";

import { ApprovalStore } from "../src/services/approval-store.js";
import { loadConfig } from "../src/services/config.js";
import { JobQueue } from "../src/services/job-queue.js";
import { SessionRegistry } from "../src/services/session-registry.js";
import { buildApp } from "../src/http/build-app.js";

describe("bridge broker routes", () => {
  it("supports module registration and long-poll job claim flow", async () => {
    const config = loadConfig({
      BRIDGE_ALLOWED_ORIGINS: "http://127.0.0.1",
      BRIDGE_APPROVAL_TTL_SECONDS: "300",
      BRIDGE_BIND_HOST: "127.0.0.1",
      BRIDGE_BIND_PORT: "3310",
      BRIDGE_DEV_MODE: "true",
      BRIDGE_LOG_LEVEL: "info",
      BRIDGE_REQUEST_TIMEOUT_MS: "5000",
      BRIDGE_SHARED_TOKEN: "secret",
    });

    const jobQueue = new JobQueue();
    const app = buildApp({
      approvalStore: new ApprovalStore(300),
      config,
      jobQueue,
      sessionRegistry: new SessionRegistry(),
    });

    const registerResponse = await app.inject({
      headers: { authorization: "Bearer secret" },
      method: "POST",
      payload: {
        foundryUserId: "gm-user",
        moduleVersion: "0.1.0",
      },
      url: "/module/session/register",
    });

    const registerBody = registerResponse.json();
    expect(registerResponse.statusCode).toBe(200);
    expect(registerBody.sessionId).toBeTruthy();

    const claimPromise = app.inject({
      headers: { authorization: "Bearer secret" },
      method: "POST",
      payload: {
        sessionId: registerBody.sessionId,
        waitMs: 100,
      },
      url: "/module/jobs/claim",
    });

    let queuedJobPromise: Promise<any> | undefined;
    setTimeout(() => {
      queuedJobPromise = jobQueue.enqueueAndWait(
        {
          dryRun: false,
          payload: { query: "bridge" },
          requestId: "req-1",
          toolName: "find_documents",
        },
        1000,
      );
    }, 10);

    const claimResponse = await claimPromise;
    const claimBody = claimResponse.json();

    expect(claimResponse.statusCode).toBe(200);
    expect(claimBody.job?.toolName).toBe("find_documents");

    jobQueue.complete(claimBody.job.jobId, {
      after: { documents: [] },
      before: null,
      diff: [],
      status: "success",
      warnings: [],
    });
    await queuedJobPromise;

    await app.close();
  });
});
