export interface BridgeClientConfig {
  serverToken: string;
  serverUrl: string;
}

export class BridgeClient {
  constructor(private readonly config: BridgeClientConfig) {}

  async registerSession(payload: {
    foundryUserId: string;
    foundryUserName?: string;
    moduleVersion: string;
    worldId?: string;
    worldTitle?: string;
  }) {
    return this.post("/module/session/register", payload);
  }

  async heartbeat(sessionId: string) {
    return this.post("/module/session/heartbeat", { sessionId });
  }

  async claimJob(sessionId: string, waitMs = 10_000) {
    return this.post("/module/jobs/claim", { sessionId, waitMs });
  }

  async submitResult(sessionId: string, jobId: string, result: unknown) {
    return this.post(`/module/jobs/${jobId}/result`, { result, sessionId });
  }

  private async post(path: string, body: unknown) {
    const response = await fetch(`${this.config.serverUrl}${path}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.config.serverToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error?.message ?? `Bridge request failed for ${path}`);
    }

    return payload;
  }
}
