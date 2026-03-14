# Foundry Remote Install (GitHub Manifest Workflow)

This guide lets you install or update `foundryvtt-mcp-bridge-module` in Foundry using a manifest URL, following the same GitHub flow used by earlier Foundry projects in this workspace.

## Where the module is

- Repo root:
  - `/Users/nicholasmcdowell/Developer/foundry-mcp`
- Module source folder:
  - `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module`
- Module manifest file:
  - `/Users/nicholasmcdowell/Developer/foundry-mcp/packages/foundryvtt-mcp-bridge-module/module.json`

## Terms

- Manifest URL: the public URL to `module.json` that Foundry reads to install or update a module.
- Download URL: the public URL to the release zip file Foundry downloads.

## Recommended hosting (GitHub)

If this folder is not yet a git repository, initialize it first:

```bash
cd "/Users/nicholasmcdowell/Developer/foundry-mcp"
git init
git add .
git commit -m "Initial commit"
```

Then connect it to GitHub:

```bash
git remote add origin https://github.com/CaptainCurso/foundry-mcp.git
git push -u origin main
```

Command explanation:

- `git init` creates local git history for the repo.
- `git add .` stages the current files.
- `git commit -m ...` records the initial snapshot.
- `git remote add origin ...` registers the GitHub repository URL.
- `git push -u origin main` publishes the current branch and sets the default upstream.

Risk:

- `git add .` stages every unignored file, so it is worth checking `git status` before the commit.
- `git remote add origin ...` fails if `origin` already exists.

## Prepare a release build

From:

- `/Users/nicholasmcdowell/Developer/foundry-mcp`

Run:

```bash
MODULE_VERSION=0.1.1 \
MODULE_URL=https://github.com/CaptainCurso/foundry-mcp \
MODULE_MANIFEST_URL=https://raw.githubusercontent.com/CaptainCurso/foundry-mcp/main/packages/foundryvtt-mcp-bridge-module/module.json \
MODULE_DOWNLOAD_URL=https://github.com/CaptainCurso/foundry-mcp/releases/download/v0.1.1/foundryvtt-mcp-bridge-module-v0.1.1.zip \
npm run module:prepare-release
```

What this does:

- updates `packages/foundryvtt-mcp-bridge-module/module.json` fields:
  - `version`
  - `url`
  - `manifest`
  - `download`
- creates a release zip at:
  - `dist/module-release/foundryvtt-mcp-bridge-module-v<version>.zip`

Risk:

- This edits `module.json` in place. Review the file before committing.

## Publish on GitHub

After preparing the release:

```bash
npm run module:publish-release
```

What this does:

- checks that GitHub CLI (`gh`) is installed and authenticated
- creates release `v<version>` if it does not exist
- uploads the prepared zip asset to that release

Risk:

- This publishes to the configured GitHub repository for the current checkout. Confirm the remote and version first.

## Install in Foundry

In Foundry:

1. Go to **Add-on Modules**.
2. Click **Install Module**.
3. Paste the manifest URL from `MODULE_MANIFEST_URL`.
4. Install and enable `Foundry VTT MCP Bridge`.
5. Open **Game Settings -> Configure Settings -> Module Settings** and use the module's own **Bridge Settings** button.

## Update flow

For each new version:

1. Choose the next version.
2. Re-run `npm run module:prepare-release` with updated URLs.
3. Commit the updated `module.json`.
4. Publish the new GitHub release and upload the zip.
5. In Foundry, update the module.
