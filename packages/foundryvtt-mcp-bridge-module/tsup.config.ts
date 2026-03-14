import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/module.ts"],
  format: ["esm"],
  noExternal: ["@foundry-mcp/shared"],
  outDir: "dist",
  platform: "browser",
  target: "es2022",
});
