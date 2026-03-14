import { createHash, randomBytes } from "node:crypto";

import type { RequestContext, WriteToolName } from "@foundry-mcp/shared";
import { BridgeError, ERROR_CODES } from "@foundry-mcp/shared";

export interface ApprovalRecord {
  expiresAt: string;
  payload: Record<string, unknown>;
  payloadHash: string;
  requestedBy?: RequestContext;
  tokenId: string;
  toolName: WriteToolName;
  usedAt?: string;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashPayload(payload: Record<string, unknown>): string {
  return createHash("sha256").update(stableStringify(payload)).digest("hex");
}

export class ApprovalStore {
  private readonly approvals = new Map<string, ApprovalRecord>();

  constructor(private readonly ttlSeconds: number) {}

  create(toolName: WriteToolName, payload: Record<string, unknown>, requestedBy?: RequestContext): ApprovalRecord {
    const tokenId = `approval_${randomBytes(24).toString("hex")}`;
    const expiresAt = new Date(Date.now() + this.ttlSeconds * 1000).toISOString();
    const record: ApprovalRecord = {
      expiresAt,
      payload,
      payloadHash: hashPayload(payload),
      requestedBy,
      tokenId,
      toolName,
    };

    this.approvals.set(tokenId, record);
    return record;
  }

  consume(tokenId: string, toolName?: WriteToolName, payload?: Record<string, unknown>): ApprovalRecord {
    const record = this.approvals.get(tokenId);

    if (!record) {
      throw new BridgeError(ERROR_CODES.approvalRequired, "Approval token was not found.", 400);
    }

    if (record.expiresAt < new Date().toISOString()) {
      this.approvals.delete(tokenId);
      throw new BridgeError(ERROR_CODES.approvalExpired, "Approval token has expired.", 400);
    }

    if (record.usedAt) {
      throw new BridgeError(ERROR_CODES.approvalUsed, "Approval token has already been used.", 400);
    }

    if (toolName && record.toolName !== toolName) {
      throw new BridgeError(ERROR_CODES.approvalMismatch, "Approval token does not match this tool.", 400);
    }

    if (payload && record.payloadHash !== hashPayload(payload)) {
      throw new BridgeError(ERROR_CODES.approvalMismatch, "Approval token does not match this payload.", 400);
    }

    record.usedAt = new Date().toISOString();
    return record;
  }

  size(): number {
    return this.approvals.size;
  }
}
