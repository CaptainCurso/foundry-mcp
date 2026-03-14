import { randomUUID } from "node:crypto";

export interface ModuleSessionRegistration {
  foundryUserId: string;
  foundryUserName?: string;
  moduleVersion: string;
  worldId?: string;
  worldTitle?: string;
}

export interface ModuleSession extends ModuleSessionRegistration {
  lastSeenAt: number;
  sessionId: string;
}

export class SessionRegistry {
  private readonly sessions = new Map<string, ModuleSession>();
  private readonly sessionTtlMs = 30_000;

  register(payload: ModuleSessionRegistration): ModuleSession {
    const session: ModuleSession = {
      ...payload,
      lastSeenAt: Date.now(),
      sessionId: randomUUID(),
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  heartbeat(sessionId: string): ModuleSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }

    session.lastSeenAt = Date.now();
    return session;
  }

  get(sessionId: string): ModuleSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }

    if (session.lastSeenAt + this.sessionTtlMs < Date.now()) {
      this.sessions.delete(sessionId);
      return undefined;
    }

    return session;
  }

  getActive(): ModuleSession | undefined {
    const active = [...this.sessions.values()]
      .filter((session) => session.lastSeenAt + this.sessionTtlMs >= Date.now())
      .sort((left, right) => right.lastSeenAt - left.lastSeenAt)[0];

    return active;
  }
}
