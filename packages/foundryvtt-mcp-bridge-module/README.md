# foundryvtt-mcp-bridge-module

This package is the Foundry VTT v13 module side of the bridge. It polls the local bridge server from a dedicated GM session and performs allowlisted document operations using public Foundry APIs only.

## Important Paths

- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module/module.json`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module/src/module.ts`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module/src/runtime.ts`
- `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module/src/operations.ts`

## Installation

1. Build the repo from `/Users/nicholasmcdowell/Developer/foundry-mcp` with `npm run build`.
2. Link the module with `npm run install:module`.
3. In Foundry VTT v13, enable `Foundry VTT MCP Bridge`.
4. As a GM, open the module's dedicated settings window from **Game Settings -> Configure Settings -> Module Settings -> Foundry MCP Bridge -> Bridge Settings**.
5. Set the bridge owner user id, server URL, bearer token, and any optional allowlists.
5. Keep that GM session open while using the MCP bridge.

## GitHub Distribution

This module can follow the same release flow used by the earlier Foundry projects in this workspace:

1. Host the repo on GitHub.
2. Prepare `module.json` with public `url`, `manifest`, and `download` fields.
3. Build a release zip with the module files at the archive root.
4. Publish the zip as a GitHub release asset.

See `/Users/nicholasmcdowell/Developer/foundry-mcp/docs/foundry_remote_install.md` for the exact commands.

## Settings

This module now uses its own Foundry-style settings window instead of exposing the raw fields in the generic settings list.

- `Bridge Server URL`: local bridge HTTP URL, usually `http://127.0.0.1:3310`
- `Bridge Bearer Token`: shared bearer token that matches `BRIDGE_SHARED_TOKEN`
- `Bridge Owner User ID`: only this GM user will poll and execute jobs
- `Allowed Operations`: comma-separated write-tool allowlist
- `Allowed Flag Namespaces`: comma-separated flag namespace allowlist
- `Allowed System Paths`: comma-separated dotted-path allowlist for Actor and Item `system` writes

## Where socketlib is required

It is not required in v1. This module performs work locally inside the dedicated GM session.

## Where socketlib is not required

- Read tools
- Journal entry create/update
- Actor create/update
- Actor item create/update
- Scene note create
- Flag writes
- Preview/apply approval flow

## Threat Model Notes

- The module never exposes a generic HTTP listener inside Foundry.
- Only one configured GM session is allowed to poll for bridge work.
- Dynamic `system` writes are denied unless the exact dotted paths are allowlisted.
- Flag writes are denied unless the namespace is allowlisted.
