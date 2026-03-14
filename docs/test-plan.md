# Test Plan

## Automated Tests

Run these from `/Users/nicholasmcdowell/Developer/foundry-mcp`:

1. `npm run build`
   - Compiles the shared package, bridge server, and Foundry module.
   - Exports JSON Schema files into `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/shared/schemas`.
2. `npm test`
   - Runs schema validation tests in `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/shared/test/shared.test.ts`.
   - Runs approval-token and HTTP broker tests in `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/test`.

## What The Current Tests Cover

- Unknown field rejection in strict schemas
- Preview-change payload validation
- Flag-namespace allowlisting
- System-path allowlisting
- Dotted-path to nested-object conversion
- Diff generation
- Approval token payload binding
- Approval token single-use enforcement
- Approval token expiration
- Module registration and long-poll job claim scaffolding

## Manual Foundry Smoke Test

1. Build the repo with `npm run build`.
2. Link the module with `npm run install:module`.
3. Start Foundry VTT v13 and enable the module in a test world.
4. As a GM, set:
   - `Bridge Server URL`
   - `Bridge Bearer Token`
   - `Bridge Owner User ID`
   - optional allowlists
5. Keep that GM session open.
6. Start the bridge server:
   - `node /Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundry-mcp-bridge-server/dist/index.js`
7. Add the local MCP config block from `/Users/nicholasmcdowell/Developer/foundry-mcp/README.md` to `~/.codex/config.toml`.
8. Call each tool in `dryRun` mode first.
9. Use `preview_change` followed by `apply_approved_change` for at least:
   - one journal creation
   - one journal update
   - one actor creation
   - one actor item creation
   - one scene note creation
   - one flag write
10. Confirm the bridge refuses:
   - a write with no approval token
   - an expired or replayed approval token
   - a forbidden `system` path
   - a forbidden flag namespace
   - any request while the GM bridge session is offline

## Known Gaps

- The Foundry module does not have browser-side automated tests yet.
- Runtime verification against a live Foundry v13 world still needs the manual smoke pass above.
- v1 keeps approvals and session state in memory only, so restart behavior is intentionally simple and not persistent.
