import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const moduleId = "foundryvtt-mcp-bridge-module";
const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const sourcePath = path.join(repoRoot, "packages", moduleId);
const foundryDataPath =
  process.env.FOUNDRY_DATA_PATH ??
  path.join(os.homedir(), "Library", "Application Support", "FoundryVTT", "Data");
const targetPath = path.join(foundryDataPath, "modules", moduleId);

fs.mkdirSync(path.dirname(targetPath), { recursive: true });

try {
  const stat = fs.lstatSync(targetPath);
  if (stat.isSymbolicLink() || stat.isDirectory() || stat.isFile()) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
    throw error;
  }
}

fs.symlinkSync(sourcePath, targetPath, "junction");

console.log(`Linked ${sourcePath} -> ${targetPath}`);
