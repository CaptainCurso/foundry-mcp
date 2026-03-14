import { TOOL_EXAMPLES } from "@foundry-mcp/shared";

export const TOOL_DEFINITIONS = {
  apply_approved_change: {
    description: "Consume a short-lived approval token and apply the exact previewed write.",
    title: "Apply Approved Change",
  },
  create_actor: {
    description: "Create an allowlisted Actor document through Foundry's public APIs.",
    title: "Create Actor",
  },
  create_actor_item: {
    description: "Create an allowlisted embedded Item on an Actor.",
    title: "Create Actor Item",
  },
  create_journal_entry: {
    description: "Create an allowlisted JournalEntry with optional pages and module-owned flags.",
    title: "Create Journal Entry",
  },
  create_scene_note: {
    description: "Create an allowlisted Scene Note linked to a JournalEntry.",
    title: "Create Scene Note",
  },
  find_documents: {
    description: "Search supported Foundry documents by type, folder, and case-insensitive text match.",
    title: "Find Documents",
  },
  get_document: {
    description: "Fetch one supported Foundry document by explicit reference.",
    title: "Get Document",
  },
  get_scene_summary: {
    description: "Return a stable summary for one Scene, including notes when requested.",
    title: "Get Scene Summary",
  },
  list_folders: {
    description: "List folders for one supported document type.",
    title: "List Folders",
  },
  preview_change: {
    description: "Preview one allowlisted write, return diffs, and mint a short-lived approval token.",
    title: "Preview Change",
  },
  set_document_flags: {
    description: "Set allowlisted document flags under configured namespaces.",
    title: "Set Document Flags",
  },
  update_actor: {
    description: "Update safe Actor fields only.",
    title: "Update Actor",
  },
  update_actor_item: {
    description: "Update safe embedded Item fields on an Actor.",
    title: "Update Actor Item",
  },
  update_journal_entry: {
    description: "Update safe JournalEntry fields only.",
    title: "Update Journal Entry",
  },
} as const;

export { TOOL_EXAMPLES };
