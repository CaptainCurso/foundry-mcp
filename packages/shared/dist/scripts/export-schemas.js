import {
  toolInputSchemas,
  toolOutputSchemas
} from "../chunk-VQAL6FAF.js";

// src/scripts/export-schemas.ts
import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
var outputDir = path.resolve(process.cwd(), "schemas");
fs.mkdirSync(outputDir, { recursive: true });
for (const [toolName, schema] of Object.entries(toolInputSchemas)) {
  const targetPath = path.join(outputDir, `${toolName}.input.schema.json`);
  fs.writeFileSync(targetPath, `${JSON.stringify(zodToJsonSchema(schema, toolName), null, 2)}
`);
}
for (const [toolName, schema] of Object.entries(toolOutputSchemas)) {
  const targetPath = path.join(outputDir, `${toolName}.output.schema.json`);
  fs.writeFileSync(targetPath, `${JSON.stringify(zodToJsonSchema(schema, `${toolName}Output`), null, 2)}
`);
}
console.log(`Exported ${Object.keys(toolInputSchemas).length + Object.keys(toolOutputSchemas).length} schema files.`);
