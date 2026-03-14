import { randomUUID } from "node:crypto";

import type { RequestContext, ToolName, WriteToolName } from "@foundry-mcp/shared";
import { BridgeError, ERROR_CODES } from "@foundry-mcp/shared";

export interface BridgeJob {
  dryRun: boolean;
  jobId: string;
  payload: Record<string, unknown>;
  requestedBy?: RequestContext;
  requestId: string;
  toolName: ToolName;
}

export interface BridgeJobResult {
  after: Record<string, unknown> | null;
  before: Record<string, unknown> | null;
  diff: Array<{ after: unknown; before: unknown; path: string }>;
  error?: {
    code: string;
    details?: unknown;
    message: string;
  };
  status: "error" | "success";
  warnings: string[];
}

interface PendingJob {
  claimedBy?: string;
  createdAt: number;
  job: BridgeJob;
  reject: (error: Error) => void;
  resolve: (value: BridgeJobResult) => void;
  timeout: NodeJS.Timeout;
}

export class JobQueue {
  private readonly pending = new Map<string, PendingJob>();
  private readonly waiters = new Set<() => void>();

  async enqueueAndWait(job: Omit<BridgeJob, "jobId">, timeoutMs: number): Promise<BridgeJobResult> {
    return new Promise((resolve, reject) => {
      const jobId = randomUUID();
      const timeout = setTimeout(() => {
        this.pending.delete(jobId);
        reject(new BridgeError(ERROR_CODES.timeout, "Timed out waiting for the Foundry bridge module.", 504));
      }, timeoutMs);

      this.pending.set(jobId, {
        claimedBy: undefined,
        createdAt: Date.now(),
        job: {
          ...job,
          jobId,
        },
        reject,
        resolve,
        timeout,
      });

      this.notifyWaiters();
    });
  }

  async claimNext(sessionId: string, waitMs: number): Promise<BridgeJob | null> {
    const deadline = Date.now() + waitMs;

    while (Date.now() < deadline) {
      const next = [...this.pending.values()]
        .filter((entry) => !entry.claimedBy)
        .sort((left, right) => left.createdAt - right.createdAt)[0];

      if (next) {
        next.claimedBy = sessionId;
        return next.job;
      }

      await new Promise<void>((resolve) => {
        const waiter = () => {
          this.waiters.delete(waiter);
          resolve();
        };

        this.waiters.add(waiter);
        setTimeout(() => {
          this.waiters.delete(waiter);
          resolve();
        }, Math.min(500, Math.max(deadline - Date.now(), 0)));
      });
    }

    return null;
  }

  complete(jobId: string, result: BridgeJobResult): void {
    const pending = this.pending.get(jobId);
    if (!pending) {
      throw new BridgeError(ERROR_CODES.invalidPayload, "Job result did not match a pending job.", 400);
    }

    clearTimeout(pending.timeout);
    this.pending.delete(jobId);

    if (result.status === "error") {
      pending.reject(
        new BridgeError(
          result.error?.code ?? ERROR_CODES.moduleError,
          result.error?.message ?? "Foundry module returned an error.",
          500,
          result.error?.details,
        ),
      );
      return;
    }

    pending.resolve(result);
  }

  size(): number {
    return this.pending.size;
  }

  private notifyWaiters(): void {
    for (const waiter of this.waiters) {
      waiter();
    }
    this.waiters.clear();
  }
}
