import { registerSettings } from "./settings.js";
import { startBridgeRuntime } from "./runtime.js";

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", async () => {
  await startBridgeRuntime();
});
