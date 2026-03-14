import {
  BridgeError,
  ERROR_CODES,
  WRITE_TOOL_NAMES,
  applyApprovedChangeOutputSchema,
  createEnvelopeSchema,
  previewChangeOutputSchema,
  toolInputSchemas,
  toolOutputSchemas,
  type ChangeResultData,
  type RequestContext,
  type ToolName,
  type WriteToolName,
} from "@foundry-mcp/shared";

import type { ApprovalStore, ApprovalRecord } from "./approval-store.js";
import { AuditLogger } from "./audit-logger.js";
import type { JobQueue } from "./job-queue.js";
import type { BridgeConfig } from "./config.js";
import type { SessionRegistry } from "./session-registry.js";

function nowIso() {
  return new Date().toISOString();
}

function isWriteTool(toolName: ToolName): toolName is WriteToolName {
  return (WRITE_TOOL_NAMES as readonly string[]).includes(toolName);
}

function asObjectRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

interface ToolRunnerDeps {
  approvalStore: ApprovalStore;
  auditLogger: AuditLogger;
  config: BridgeConfig;
  jobQueue: JobQueue;
  sessionRegistry: SessionRegistry;
}

export class ToolRunner {
  constructor(private readonly deps: ToolRunnerDeps) {}

  async runTool(toolName: ToolName, rawInput: unknown) {
    const schema = toolInputSchemas[toolName];
    const parsedInput = schema.parse(rawInput);
    const requestContext = parsedInput.requestContext as RequestContext | undefined;
    const requestId = this.deps.auditLogger.createRequestId();

    try {
      let envelope;
      if (toolName === "preview_change") {
        envelope = await this.previewChange(parsedInput, requestId);
      } else if (toolName === "apply_approved_change") {
        envelope = await this.applyApprovedChange(parsedInput, requestId);
      } else if (isWriteTool(toolName)) {
        envelope = await this.executeWriteTool(toolName, parsedInput, requestId);
      } else {
        envelope = await this.executeModuleTool(toolName, parsedInput, requestId, requestContext);
      }

      this.deps.auditLogger.log({
        requestContext,
        requestId,
        status: envelope.status,
        tool: toolName,
      });

      return envelope;
    } catch (error) {
      const bridgeError =
        error instanceof BridgeError
          ? error
          : new BridgeError(ERROR_CODES.moduleError, error instanceof Error ? error.message : "Unknown error", 500);

      const envelope = {
        audit: {
          agentId: requestContext?.agentId,
          agentName: requestContext?.agentName,
          foundrySessionId: this.deps.sessionRegistry.getActive()?.sessionId,
          foundryUserId: this.deps.sessionRegistry.getActive()?.foundryUserId,
          requestId,
          timestamp: nowIso(),
        },
        data: {},
        error: {
          code: bridgeError.code,
          details: bridgeError.details,
          message: bridgeError.message,
        },
        ok: false,
        requestId,
        status: "error" as const,
        timestamp: nowIso(),
        tool: toolName,
      };

      this.deps.auditLogger.log({
        requestContext,
        requestId,
        status: "error",
        tool: toolName,
      });

      return envelope;
    }
  }

  private async executeModuleTool(
    toolName: Exclude<ToolName, WriteToolName | "preview_change" | "apply_approved_change">,
    input: Record<string, unknown>,
    requestId: string,
    requestContext?: RequestContext,
  ) {
    this.assertBridgeOnline();
    const result = await this.deps.jobQueue.enqueueAndWait(
      {
        dryRun: false,
        payload: input,
        requestContext,
        requestId,
        toolName,
      },
      this.deps.config.requestTimeoutMs,
    );

    const activeSession = this.deps.sessionRegistry.getActive();
    const envelope = {
      audit: {
        agentId: requestContext?.agentId,
        agentName: requestContext?.agentName,
        foundrySessionId: activeSession?.sessionId,
        foundryUserId: activeSession?.foundryUserId,
        requestId,
        timestamp: nowIso(),
      },
      data: this.extractReadData(toolName, result.after),
      error: null,
      ok: true,
      requestId,
      status: "success" as const,
      timestamp: nowIso(),
      tool: toolName,
    };

    return toolOutputSchemas[toolName].parse(envelope);
  }

  private async executeWriteTool(
    toolName: WriteToolName,
    input: Record<string, unknown>,
    requestId: string,
    approvalRecord?: ApprovalRecord,
  ) {
    this.assertBridgeOnline();

    const requestContext = input.requestContext as RequestContext | undefined;
    const dryRun = Boolean(input.dryRun);
    const payload = { ...input };
    delete payload.approvalToken;

    if (!dryRun && !approvalRecord) {
      const approvalToken = input.approvalToken;
      if (typeof approvalToken !== "string") {
        throw new BridgeError(
          ERROR_CODES.approvalRequired,
          "Non-dry-run write calls require a preview-derived approval token.",
          400,
        );
      }

      approvalRecord = this.deps.approvalStore.consume(approvalToken, toolName, payload);
    }

    const result = await this.deps.jobQueue.enqueueAndWait(
      {
        dryRun,
        payload,
        requestContext,
        requestId,
        toolName,
      },
      this.deps.config.requestTimeoutMs,
    );

    const changeData: ChangeResultData = {
      after: result.after as any,
      approvalRequired: dryRun,
      approved: !dryRun,
      before: result.before as any,
      diff: result.diff,
      dryRun,
      warnings: result.warnings,
    };

    const activeSession = this.deps.sessionRegistry.getActive();
    const envelope = {
      audit: {
        agentId: requestContext?.agentId,
        agentName: requestContext?.agentName,
        foundrySessionId: activeSession?.sessionId,
        foundryUserId: activeSession?.foundryUserId,
        requestId,
        timestamp: nowIso(),
      },
      data: changeData,
      error: null,
      ok: true,
      requestId,
      status: "success" as const,
      timestamp: nowIso(),
      tool: toolName,
    };

    return toolOutputSchemas[toolName].parse(envelope);
  }

  private async previewChange(input: Record<string, unknown>, requestId: string) {
    const change = input.change as { payload: Record<string, unknown>; toolName: WriteToolName };
    if (change.payload.dryRun !== true) {
      throw new BridgeError(ERROR_CODES.invalidPayload, "preview_change payloads must set dryRun=true.", 400);
    }

    const previewEnvelope = await this.executeWriteTool(change.toolName, change.payload, requestId);
    const payloadForApproval = {
      ...change.payload,
      dryRun: false,
    };
    delete (payloadForApproval as { approvalToken?: string }).approvalToken;

    const approval = this.deps.approvalStore.create(
      change.toolName,
      payloadForApproval,
      input.requestContext as RequestContext | undefined,
    );

    const envelope = {
      audit: previewEnvelope.audit,
      data: {
        approvalToken: approval.tokenId,
        change: previewEnvelope.data,
        expiresAt: approval.expiresAt,
        toolName: change.toolName,
      },
      error: null,
      ok: true,
      requestId,
      status: "success" as const,
      timestamp: nowIso(),
      tool: "preview_change" as const,
    };

    return previewChangeOutputSchema.parse(envelope);
  }

  private async applyApprovedChange(input: Record<string, unknown>, requestId: string) {
    const approval = this.deps.approvalStore.consume(input.approvalToken as string);
    const envelope = await this.executeWriteTool(approval.toolName, approval.payload, requestId, approval);
    const appliedEnvelope = {
      ...envelope,
      data: {
        ...envelope.data,
        approvalTokenUsed: approval.tokenId,
        toolName: approval.toolName,
      },
      tool: "apply_approved_change" as const,
    };

    return applyApprovedChangeOutputSchema.parse(appliedEnvelope);
  }

  private assertBridgeOnline(): void {
    if (!this.deps.sessionRegistry.getActive()) {
      throw new BridgeError(
        ERROR_CODES.bridgeOffline,
        "No active Foundry bridge session is connected. Keep the dedicated GM session open.",
        503,
      );
    }
  }

  private extractReadData(toolName: ToolName, after: Record<string, unknown> | null) {
    if (!after) {
      throw new BridgeError(ERROR_CODES.moduleError, "Module did not return data.", 500);
    }

    switch (toolName) {
      case "find_documents":
        return { documents: (after.documents ?? []) as unknown[] };
      case "get_document":
        return { document: after.document };
      case "list_folders":
        return { folders: (after.folders ?? []) as unknown[] };
      case "get_scene_summary":
        return { scene: after.scene };
      default:
        return after;
    }
  }
}
