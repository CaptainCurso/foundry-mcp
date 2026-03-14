import { describe, expect, it } from "vitest";

import {
  MODULE_FLAG_NAMESPACE,
  assertAllowedNamespaces,
  assertAllowedSystemPaths,
  diffValues,
  pathChangesToObject,
  previewChangeInputSchema,
  toolInputSchemas,
} from "../src/index.js";

describe("shared schemas", () => {
  it("rejects unknown fields", () => {
    const result = toolInputSchemas.create_actor.safeParse({
      dryRun: true,
      name: "Bad Actor",
      type: "npc",
      unexpected: true,
    });

    expect(result.success).toBe(false);
  });

  it("requires a matching preview change shape", () => {
    const result = previewChangeInputSchema.safeParse({
      change: {
        payload: {
          actorId: "actor-1",
          dryRun: true,
          title: "Nope",
        },
        toolName: "update_actor",
      },
    });

    expect(result.success).toBe(false);
  });
});

describe("allowlists", () => {
  it("rejects flag namespaces outside the allowlist", () => {
    expect(() =>
      assertAllowedNamespaces([{ key: "k", namespace: "other-module", value: true }], [MODULE_FLAG_NAMESPACE]),
    ).toThrow(/allowlisted/);
  });

  it("rejects system paths outside the allowlist", () => {
    expect(() =>
      assertAllowedSystemPaths([{ path: "attributes.hp.value", value: 10 }], ["details.biography.value"]),
    ).toThrow(/allowlisted/);
  });

  it("builds nested objects from dotted system paths", () => {
    expect(
      pathChangesToObject([
        { path: "details.biography.value", value: "Bridge text" },
        { path: "attributes.hp.value", value: 9 },
      ]),
    ).toEqual({
      attributes: { hp: { value: 9 } },
      details: { biography: { value: "Bridge text" } },
    });
  });
});

describe("diffing", () => {
  it("returns readable path diffs", () => {
    expect(diffValues({ name: "Before" }, { name: "After" })).toEqual([
      { after: "After", before: "Before", path: "name" },
    ]);
  });
});
