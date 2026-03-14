import fs from "node:fs";
import path from "node:path";

import { zodToJsonSchema } from "zod-to-json-schema";

import { toolInputSchemas, toolOutputSchemas } from "../schemas.js";

const outputDir = path.resolve(process.cwd(), "schemas");
fs.mkdirSync(outputDir, { recursive: true });

for (const [toolName, schema] of Object.entries(toolInputSchemas)) {
  const targetPath = path.join(outputDir, `${toolName}.input.schema.json`);
  fs.writeFileSync(targetPath, `${JSON.stringify(zodToJsonSchema(schema, toolName), null, 2)}\n`);
}

for (const [toolName, schema] of Object.entries(toolOutputSchemas)) {
  const targetPath = path.join(outputDir, `${toolName}.output.schema.json`);
  fs.writeFileSync(targetPath, `${JSON.stringify(zodToJsonSchema(schema, `${toolName}Output`), null, 2)}\n`);
}

console.log(`Exported ${Object.keys(toolInputSchemas).length + Object.keys(toolOutputSchemas).length} schema files.`);
