import { randomUUID } from "node:crypto";

import type { RequestContext, ToolName } from "@foundry-mcp/shared";

export interface AuditRecord {
  foundrySessionId?: string;
  foundryUserId?: string;
  requestContext?: RequestContext;
  requestId: string;
  status: "error" | "success";
  tool: ToolName;
}

export class AuditLogger {
  createRequestId(): string {
    return randomUUID();
  }

  log(record: AuditRecord): void {
    process.stderr.write(
      `${JSON.stringify({
        agentId: record.requestContext?.agentId,
        agentName: record.requestContext?.agentName,
        foundrySessionId: record.foundrySessionId,
        foundryUserId: record.foundryUserId,
        requestId: record.requestId,
        status: record.status,
        timestamp: new Date().toISOString(),
        tool: record.tool,
        userId: record.requestContext?.userId,
      })}\n`,
    );
  }
}
