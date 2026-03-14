import {
  CONTROL_TOOL_NAMES,
  DEFAULT_APPROVAL_TTL_SECONDS,
  DEFAULT_REQUEST_TIMEOUT_MS,
  DOCUMENT_TYPES,
  FOLDER_TYPES,
  MODULE_FLAG_NAMESPACE,
  MODULE_ID,
  READ_TOOL_NAMES,
  TOOL_NAMES,
  WRITE_TOOL_NAMES,
  applyApprovedChangeDataSchema,
  applyApprovedChangeInputSchema,
  applyApprovedChangeOutputSchema,
  auditMetadataSchema,
  bridgeJobResultSchema,
  bridgeJobSchema,
  changeResultDataSchema,
  controlToolNameSchema,
  createActorInputSchema,
  createActorItemInputSchema,
  createEnvelopeSchema,
  createJournalEntryInputSchema,
  createSceneNoteInputSchema,
  diffEntrySchema,
  documentRefSchema,
  documentTypeSchema,
  errorSchema,
  findDocumentsInputSchema,
  findDocumentsOutputSchema,
  flagChangeSchema,
  folderTypeSchema,
  getDocumentInputSchema,
  getDocumentOutputSchema,
  getSceneSummaryInputSchema,
  getSceneSummaryOutputSchema,
  journalPageInputSchema,
  journalPageUpdateInputSchema,
  listFoldersInputSchema,
  listFoldersOutputSchema,
  normalizedDocumentSchema,
  normalizedDocumentSummarySchema,
  previewChangeDataSchema,
  previewChangeInputSchema,
  previewChangeOutputSchema,
  previewableChangeSchema,
  prototypeTokenSubsetSchema,
  readToolNameSchema,
  requestContextSchema,
  sceneSummarySchema,
  setDocumentFlagsInputSchema,
  systemChangeSchema,
  toolInputSchemas,
  toolNameSchema,
  toolOutputSchemas,
  updateActorInputSchema,
  updateActorItemInputSchema,
  updateJournalEntryInputSchema,
  writeControlSchema,
  writeToolNameSchema,
  writeToolOutputSchema
} from "./chunk-VQAL6FAF.js";

// src/errors.ts
var ERROR_CODES = {
  approvalExpired: "APPROVAL_EXPIRED",
  approvalMismatch: "APPROVAL_MISMATCH",
  approvalRequired: "APPROVAL_REQUIRED",
  approvalUsed: "APPROVAL_ALREADY_USED",
  bridgeOffline: "BRIDGE_OFFLINE",
  documentNotFound: "DOCUMENT_NOT_FOUND",
  forbiddenField: "FORBIDDEN_FIELD",
  forbiddenOperation: "FORBIDDEN_OPERATION",
  invalidAuth: "INVALID_AUTH",
  invalidPayload: "INVALID_PAYLOAD",
  invalidSession: "INVALID_SESSION",
  moduleError: "MODULE_ERROR",
  timeout: "REQUEST_TIMEOUT",
  unsupportedDocumentType: "UNSUPPORTED_DOCUMENT_TYPE"
};
var BridgeError = class extends Error {
  code;
  statusCode;
  details;
  constructor(code, message, statusCode = 400, details) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
};

// src/allowlists.ts
function assertAllowedNamespaces(flags, allowedNamespaces) {
  if (!flags?.length) {
    return;
  }
  const allowed = new Set(allowedNamespaces);
  for (const flag of flags) {
    if (!allowed.has(flag.namespace)) {
      throw new BridgeError(
        ERROR_CODES.forbiddenField,
        `Flag namespace "${flag.namespace}" is not allowlisted.`,
        400,
        { namespace: flag.namespace }
      );
    }
  }
}
function assertAllowedSystemPaths(systemChanges, allowedPaths) {
  if (!systemChanges?.length) {
    return;
  }
  const allowed = new Set(allowedPaths);
  for (const change of systemChanges) {
    if (!allowed.has(change.path)) {
      throw new BridgeError(
        ERROR_CODES.forbiddenField,
        `System path "${change.path}" is not allowlisted.`,
        400,
        { path: change.path }
      );
    }
  }
}
function assertAllowedFields(requestedFields, allowedFields, context) {
  const allowed = new Set(allowedFields);
  const forbidden = requestedFields.filter((field) => !allowed.has(field));
  if (forbidden.length > 0) {
    throw new BridgeError(
      ERROR_CODES.forbiddenField,
      `${context} contains non-allowlisted fields.`,
      400,
      { forbidden }
    );
  }
}
function pathChangesToObject(changes) {
  const result = {};
  for (const change of changes ?? []) {
    const segments = change.path.split(".");
    let cursor = result;
    for (const [index, segment] of segments.entries()) {
      if (index === segments.length - 1) {
        cursor[segment] = change.value;
        continue;
      }
      if (!(segment in cursor) || typeof cursor[segment] !== "object" || cursor[segment] === null) {
        cursor[segment] = {};
      }
      cursor = cursor[segment];
    }
  }
  return result;
}
function flagChangesToObject(flags) {
  const result = {};
  for (const flag of flags ?? []) {
    if (!(flag.namespace in result)) {
      result[flag.namespace] = {};
    }
    const namespace = result[flag.namespace];
    namespace[flag.key] = flag.value;
  }
  return result;
}

// src/diff.ts
function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function diffValues(before, after, basePath = "") {
  if (Object.is(before, after)) {
    return [];
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    return [{ path: basePath || "$", before, after }];
  }
  if (isObject(before) && isObject(after)) {
    const keys = /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)]);
    const entries = [];
    for (const key of keys) {
      const nextPath = basePath ? `${basePath}.${key}` : key;
      entries.push(...diffValues(before[key], after[key], nextPath));
    }
    return entries;
  }
  return [{ path: basePath || "$", before, after }];
}

// src/examples.ts
var TOOL_EXAMPLES = {
  apply_approved_change: {
    input: {
      approvalToken: "approval_xxxxxxxxxxxxxxxxxxxxx"
    }
  },
  create_actor: {
    input: {
      dryRun: true,
      flags: [{ key: "source", namespace: MODULE_FLAG_NAMESPACE, value: "codex" }],
      name: "Bridge Test Actor",
      systemChanges: [{ path: "details.biography.value", value: "Created through MCP bridge" }],
      type: "npc"
    }
  },
  create_actor_item: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      name: "Bridge Longsword",
      type: "weapon"
    }
  },
  create_journal_entry: {
    input: {
      dryRun: true,
      pages: [{ name: "Overview", textContent: "Bridge-created page content." }],
      title: "Bridge Journal"
    }
  },
  create_scene_note: {
    input: {
      dryRun: true,
      entryId: "JOURNAL_ID",
      label: "Bridge Note",
      sceneId: "SCENE_ID",
      x: 1200,
      y: 800
    }
  },
  find_documents: {
    input: {
      documentTypes: ["Actor", "JournalEntry"],
      limit: 10,
      query: "bridge"
    }
  },
  get_document: {
    input: {
      includeContent: true,
      ref: { id: "JOURNAL_ID", type: "JournalEntry" }
    }
  },
  get_scene_summary: {
    input: {
      includeNotes: true,
      sceneId: "SCENE_ID"
    }
  },
  list_folders: {
    input: {
      documentType: "Actor"
    }
  },
  preview_change: {
    input: {
      change: {
        payload: {
          dryRun: true,
          pages: [{ name: "Overview", textContent: "Bridge-created page content." }],
          title: "Bridge Journal"
        },
        toolName: "create_journal_entry"
      }
    }
  },
  set_document_flags: {
    input: {
      dryRun: true,
      flags: [{ key: "approved", namespace: MODULE_FLAG_NAMESPACE, value: true }],
      ref: { id: "ACTOR_ID", type: "Actor" }
    }
  },
  update_actor: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      name: "Updated Bridge Actor"
    }
  },
  update_actor_item: {
    input: {
      actorId: "ACTOR_ID",
      dryRun: true,
      itemId: "ITEM_ID",
      name: "Updated Bridge Longsword"
    }
  },
  update_journal_entry: {
    input: {
      dryRun: true,
      journalEntryId: "JOURNAL_ID",
      title: "Updated Bridge Journal"
    }
  }
};
var TOOL_GROUPS = {
  control: ["preview_change", "apply_approved_change"],
  read: [...READ_TOOL_NAMES],
  write: [...WRITE_TOOL_NAMES]
};
export {
  BridgeError,
  CONTROL_TOOL_NAMES,
  DEFAULT_APPROVAL_TTL_SECONDS,
  DEFAULT_REQUEST_TIMEOUT_MS,
  DOCUMENT_TYPES,
  ERROR_CODES,
  FOLDER_TYPES,
  MODULE_FLAG_NAMESPACE,
  MODULE_ID,
  READ_TOOL_NAMES,
  TOOL_EXAMPLES,
  TOOL_GROUPS,
  TOOL_NAMES,
  WRITE_TOOL_NAMES,
  applyApprovedChangeDataSchema,
  applyApprovedChangeInputSchema,
  applyApprovedChangeOutputSchema,
  assertAllowedFields,
  assertAllowedNamespaces,
  assertAllowedSystemPaths,
  auditMetadataSchema,
  bridgeJobResultSchema,
  bridgeJobSchema,
  changeResultDataSchema,
  controlToolNameSchema,
  createActorInputSchema,
  createActorItemInputSchema,
  createEnvelopeSchema,
  createJournalEntryInputSchema,
  createSceneNoteInputSchema,
  diffEntrySchema,
  diffValues,
  documentRefSchema,
  documentTypeSchema,
  errorSchema,
  findDocumentsInputSchema,
  findDocumentsOutputSchema,
  flagChangeSchema,
  flagChangesToObject,
  folderTypeSchema,
  getDocumentInputSchema,
  getDocumentOutputSchema,
  getSceneSummaryInputSchema,
  getSceneSummaryOutputSchema,
  journalPageInputSchema,
  journalPageUpdateInputSchema,
  listFoldersInputSchema,
  listFoldersOutputSchema,
  normalizedDocumentSchema,
  normalizedDocumentSummarySchema,
  pathChangesToObject,
  previewChangeDataSchema,
  previewChangeInputSchema,
  previewChangeOutputSchema,
  previewableChangeSchema,
  prototypeTokenSubsetSchema,
  readToolNameSchema,
  requestContextSchema,
  sceneSummarySchema,
  setDocumentFlagsInputSchema,
  systemChangeSchema,
  toolInputSchemas,
  toolNameSchema,
  toolOutputSchemas,
  updateActorInputSchema,
  updateActorItemInputSchema,
  updateJournalEntryInputSchema,
  writeControlSchema,
  writeToolNameSchema,
  writeToolOutputSchema
};
