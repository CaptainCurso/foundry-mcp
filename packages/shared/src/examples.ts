import {
  MODULE_FLAG_NAMESPACE,
  READ_TOOL_NAMES,
  WRITE_TOOL_NAMES,
} from "./constants.js";

export const TOOL_EXAMPLES = {
  apply_approved_change: {
    input: {
      approvalToken: "approval_xxxxxxxxxxxxxxxxxxxxx",
    },
  },
  create_actor: {
    input: {
      dryRun: true,
      flags: [{ key: "source", namespace: MODULE_FLAG_NAMESPACE, value: "codex" }],
      name: "Bridge Test Actor",
      systemChanges: [{ path: "details.biography.value", value: "Created through MCP bridge" }],
      type: "npc",
    },
  },
  create_actor_item: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      name: "Bridge Longsword",
      type: "weapon",
    },
  },
  create_journal_entry: {
    input: {
      dryRun: true,
      pages: [{ name: "Overview", textContent: "Bridge-created page content." }],
      title: "Bridge Journal",
    },
  },
  create_scene_note: {
    input: {
      dryRun: true,
      entryId: "JOURNAL_ID",
      label: "Bridge Note",
      sceneId: "SCENE_ID",
      x: 1200,
      y: 800,
    },
  },
  find_documents: {
    input: {
      documentTypes: ["Actor", "JournalEntry"],
      limit: 10,
      query: "bridge",
    },
  },
  get_document: {
    input: {
      includeContent: true,
      ref: { id: "JOURNAL_ID", type: "JournalEntry" },
    },
  },
  get_scene_summary: {
    input: {
      includeNotes: true,
      sceneId: "SCENE_ID",
    },
  },
  list_folders: {
    input: {
      documentType: "Actor",
    },
  },
  preview_change: {
    input: {
      change: {
        payload: {
          dryRun: true,
          pages: [{ name: "Overview", textContent: "Bridge-created page content." }],
          title: "Bridge Journal",
        },
        toolName: "create_journal_entry",
      },
    },
  },
  set_document_flags: {
    input: {
      dryRun: true,
      flags: [{ key: "approved", namespace: MODULE_FLAG_NAMESPACE, value: true }],
      ref: { id: "ACTOR_ID", type: "Actor" },
    },
  },
  update_actor: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      name: "Updated Bridge Actor",
    },
  },
  update_actor_item: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      itemId: "ITEM_ID",
      name: "Updated Bridge Longsword",
    },
  },
  update_journal_entry: {
    input: {
      dryRun: true,
      journalEntryId: "JOURNAL_ID",
      title: "Updated Bridge Journal",
    },
  },
} as const;

export const TOOL_GROUPS = {
  control: ["preview_change", "apply_approved_change"],
  read: [...READ_TOOL_NAMES],
  write: [...WRITE_TOOL_NAMES],
} as const;
