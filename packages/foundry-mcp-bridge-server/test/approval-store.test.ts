import { describe, expect, it } from "vitest";

import { ApprovalStore } from "../src/services/approval-store.js";

describe("ApprovalStore", () => {
  it("binds tokens to exact payloads", () => {
    const store = new ApprovalStore(300);
    const record = store.create("create_actor", { dryRun: false, name: "Bridge Actor", type: "npc" });

    expect(() =>
      store.consume(record.tokenId, "create_actor", {
        dryRun: false,
        name: "Different Actor",
        type: "npc",
      }),
    ).toThrow(/does not match this payload/);
  });

  it("rejects token reuse", () => {
    const store = new ApprovalStore(300);
    const record = store.create("create_actor", { dryRun: false, name: "Bridge Actor", type: "npc" });

    store.consume(record.tokenId, "create_actor", {
      dryRun: false,
      name: "Bridge Actor",
      type: "npc",
    });

    expect(() =>
      store.consume(record.tokenId, "create_actor", {
        dryRun: false,
        name: "Bridge Actor",
        type: "npc",
      }),
    ).toThrow(/already been used/);
  });

  it("expires old tokens", async () => {
    const store = new ApprovalStore(0);
    const record = store.create("create_actor", { dryRun: false, name: "Bridge Actor", type: "npc" });

    await new Promise((resolve) => setTimeout(resolve, 5));

    expect(() =>
      store.consume(record.tokenId, "create_actor", {
        dryRun: false,
        name: "Bridge Actor",
        type: "npc",
      }),
    ).toThrow(/expired/);
  });
});
