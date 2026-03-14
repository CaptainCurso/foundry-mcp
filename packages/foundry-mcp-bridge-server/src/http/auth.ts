import type { FastifyReply, FastifyRequest } from "fastify";

import type { BridgeConfig } from "../services/config.js";

export function createModuleAuth(config: BridgeConfig) {
  return async function moduleAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const header = request.headers.authorization;
    if (header !== `Bearer ${config.sharedToken}`) {
      return reply.code(401).send({
        error: {
          code: "INVALID_AUTH",
          message: "Missing or invalid bearer token.",
        },
        ok: false,
      });
    }
  };
}
