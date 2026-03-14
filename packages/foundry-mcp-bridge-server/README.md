# foundry-mcp-bridge-server

This package exposes the MCP-facing side of the bridge. It validates agent input with strict schemas, queues work for the Foundry module, and enforces preview/approval rules before any write is applied.

## Important Paths

- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/src/index.ts`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/src/http/build-app.ts`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/src/services/tool-runner.ts`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/shared/schemas`

## Environment Variables

- `BRIDGE_BIND_HOST`: host for the local broker HTTP server. Use `127.0.0.1` in v1.
- `BRIDGE_BIND_PORT`: local broker HTTP port.
- `BRIDGE_SHARED_TOKEN`: bearer token used by the Foundry module.
- `BRIDGE_ALLOWED_ORIGINS`: comma-separated browser origins allowed to call the local broker.
- `BRIDGE_APPROVAL_TTL_SECONDS`: approval-token lifetime.
- `BRIDGE_REQUEST_TIMEOUT_MS`: how long tool calls wait for the Foundry module.
- `BRIDGE_LOG_LEVEL`: reserved for future filtering; v1 always emits structured audit lines to `stderr`.
- `BRIDGE_DEV_MODE`: enables easier local defaults.

## Tool Surface

### Read tools

- `find_documents`
- `get_document`
- `list_folders`
- `get_scene_summary`

### Write tools

- `create_journal_entry`
- `update_journal_entry`
- `create_actor`
- `update_actor`
- `create_actor_item`
- `update_actor_item`
- `create_scene_note`
- `set_document_flags`

### Control tools

- `preview_change`
- `apply_approved_change`

## Example Request/Response

Full request/response examples for every tool live in `/Users/nicholasmcdowell/Developer/foundry-mcp/docs/tool-reference.md`.

## Example Tool Definition

The MCP tool definitions are registered from `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/src/tools/definitions.ts`. A typical definition includes a title, description, strict input schema, and strict output schema before the handler is attached in `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/src/index.ts`.

## Threat Model Notes

- The bridge never accepts arbitrary document patches.
- Approval tokens are short-lived, single-use, and payload-bound.
- The server rejects writes when no active GM bridge session exists.
- Audit logs include the tool name, timestamp, request id, request context, and result status.
