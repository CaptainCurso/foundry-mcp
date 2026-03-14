export const MODULE_ID = "foundryvtt-mcp-bridge-module";
export const MODULE_FLAG_NAMESPACE = "foundryvtt-mcp-bridge-module";

export const READ_TOOL_NAMES = [
  "find_documents",
  "get_document",
  "list_folders",
  "get_scene_summary",
] as const;

export const WRITE_TOOL_NAMES = [
  "create_journal_entry",
  "update_journal_entry",
  "create_actor",
  "update_actor",
  "create_actor_item",
  "update_actor_item",
  "create_scene_note",
  "set_document_flags",
] as const;

export const CONTROL_TOOL_NAMES = ["preview_change", "apply_approved_change"] as const;

export const TOOL_NAMES = [
  ...READ_TOOL_NAMES,
  ...WRITE_TOOL_NAMES,
  ...CONTROL_TOOL_NAMES,
] as const;

export const DOCUMENT_TYPES = [
  "JournalEntry",
  "Actor",
  "Item",
  "Note",
  "Folder",
  "RollTable",
  "Playlist",
  "Scene",
] as const;

export const FOLDER_TYPES = [
  "JournalEntry",
  "Actor",
  "Item",
  "RollTable",
  "Playlist",
] as const;

export const DEFAULT_APPROVAL_TTL_SECONDS = 300;
export const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;
