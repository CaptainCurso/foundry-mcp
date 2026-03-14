import cors from "@fastify/cors";
import Fastify from "fastify";
import { z } from "zod";

import type { ApprovalStore } from "../services/approval-store.js";
import type { JobQueue } from "../services/job-queue.js";
import type { BridgeConfig } from "../services/config.js";
import type { SessionRegistry } from "../services/session-registry.js";
import { createModuleAuth } from "./auth.js";

const registerSchema = z
  .object({
    foundryUserId: z.string().min(1),
    foundryUserName: z.string().min(1).optional(),
    moduleVersion: z.string().min(1),
    worldId: z.string().min(1).optional(),
    worldTitle: z.string().min(1).optional(),
  })
  .strict();

const heartbeatSchema = z
  .object({
    sessionId: z.string().min(1),
  })
  .strict();

const claimSchema = z
  .object({
    sessionId: z.string().min(1),
    waitMs: z.number().int().min(0).max(30_000).default(10_000),
  })
  .strict();

const resultSchema = z
  .object({
    result: z
      .object({
        after: z.record(z.unknown()).nullable(),
        before: z.record(z.unknown()).nullable(),
        diff: z
          .array(
            z
              .object({
                after: z.unknown(),
                before: z.unknown(),
                path: z.string().min(1),
              })
              .strict(),
          )
          .default([]),
        error: z
          .object({
            code: z.string().min(1),
            details: z.unknown().optional(),
            message: z.string().min(1),
          })
          .strict()
          .optional(),
        status: z.enum(["success", "error"]),
        warnings: z.array(z.string()).default([]),
      })
      .strict(),
    sessionId: z.string().min(1),
  })
  .strict();

interface AppDependencies {
  approvalStore: ApprovalStore;
  config: BridgeConfig;
  jobQueue: JobQueue;
  sessionRegistry: SessionRegistry;
}

export function buildApp(deps: AppDependencies) {
  const app = Fastify({ logger: false });

  app.register(cors, {
    credentials: false,
    methods: ["GET", "POST"],
    origin: deps.config.allowedOrigins,
  });

  app.get("/health", async () => ({
    activeSession: Boolean(deps.sessionRegistry.getActive()),
    ok: true,
    pendingApprovals: deps.approvalStore.size(),
    pendingJobs: deps.jobQueue.size(),
  }));

  app.get("/version", async () => ({
    name: "foundry-mcp-bridge-server",
    version: "0.1.0",
  }));

  app.register(async (moduleRoutes) => {
    moduleRoutes.addHook("preHandler", createModuleAuth(deps.config));

    moduleRoutes.post("/session/register", async (request, reply) => {
      const parsed = registerSchema.parse(request.body);
      const session = deps.sessionRegistry.register(parsed);

      return reply.send({
        approvalTtlSeconds: deps.config.approvalTtlSeconds,
        pollIntervalMs: 2500,
        sessionId: session.sessionId,
      });
    });

    moduleRoutes.post("/session/heartbeat", async (request, reply) => {
      const parsed = heartbeatSchema.parse(request.body);
      const session = deps.sessionRegistry.heartbeat(parsed.sessionId);

      if (!session) {
        return reply.code(404).send({
          error: {
            code: "INVALID_SESSION",
            message: "Session not found or expired.",
          },
          ok: false,
        });
      }

      return reply.send({ ok: true });
    });

    moduleRoutes.post("/jobs/claim", async (request, reply) => {
      const parsed = claimSchema.parse(request.body);
      const session = deps.sessionRegistry.get(parsed.sessionId);
      if (!session) {
        return reply.code(404).send({
          error: {
            code: "INVALID_SESSION",
            message: "Session not found or expired.",
          },
          ok: false,
        });
      }

      const job = await deps.jobQueue.claimNext(parsed.sessionId, parsed.waitMs);
      return reply.send({ job });
    });

    moduleRoutes.post("/jobs/:jobId/result", async (request, reply) => {
      const parsed = resultSchema.parse(request.body);
      const session = deps.sessionRegistry.get(parsed.sessionId);
      if (!session) {
        return reply.code(404).send({
          error: {
            code: "INVALID_SESSION",
            message: "Session not found or expired.",
          },
          ok: false,
        });
      }

      deps.jobQueue.complete((request.params as { jobId: string }).jobId, parsed.result);

      return reply.send({ ok: true });
    });
  }, { prefix: "/module" });

  return app;
}
