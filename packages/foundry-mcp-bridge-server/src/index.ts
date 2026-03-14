import "dotenv/config";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_NAMES, toolInputSchemas, toolOutputSchemas, type ToolName } from "@foundry-mcp/shared";

import { AuditLogger } from "./services/audit-logger.js";
import { ApprovalStore } from "./services/approval-store.js";
import { loadConfig } from "./services/config.js";
import { JobQueue } from "./services/job-queue.js";
import { SessionRegistry } from "./services/session-registry.js";
import { ToolRunner } from "./services/tool-runner.js";
import { buildApp } from "./http/build-app.js";
import { TOOL_DEFINITIONS } from "./tools/definitions.js";

const config = loadConfig();
const approvalStore = new ApprovalStore(config.approvalTtlSeconds);
const auditLogger = new AuditLogger();
const jobQueue = new JobQueue();
const sessionRegistry = new SessionRegistry();
const toolRunner = new ToolRunner({
  approvalStore,
  auditLogger,
  config,
  jobQueue,
  sessionRegistry,
});

const app = buildApp({
  approvalStore,
  config,
  jobQueue,
  sessionRegistry,
});

const server = new McpServer(
  {
    name: "foundry-mcp-bridge-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      logging: {},
      tools: {},
    },
  },
);

const registeredToolNames = TOOL_NAMES as readonly ToolName[];

for (const toolName of registeredToolNames) {
  server.registerTool(
    toolName,
    {
      description: TOOL_DEFINITIONS[toolName].description,
      inputSchema: toolInputSchemas[toolName].shape,
      outputSchema: toolOutputSchemas[toolName].shape,
      title: TOOL_DEFINITIONS[toolName].title,
    },
    async (input: Record<string, unknown>) => {
      const result = await toolRunner.runTool(toolName, input);
      return {
        content: [
          {
            text: JSON.stringify(result, null, 2),
            type: "text" as const,
          },
        ],
        isError: !result.ok,
        structuredContent: result,
      };
    },
  );
}

async function start() {
  await app.listen({ host: config.bindHost, port: config.bindPort });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

start().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
