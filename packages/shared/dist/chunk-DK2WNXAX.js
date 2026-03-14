// src/constants.ts
var MODULE_ID = "foundryvtt-mcp-bridge-module";
var MODULE_FLAG_NAMESPACE = "foundryvtt-mcp-bridge-module";
var READ_TOOL_NAMES = [
  "find_documents",
  "get_document",
  "list_folders",
  "get_scene_summary"
];
var WRITE_TOOL_NAMES = [
  "create_journal_entry",
  "update_journal_entry",
  "create_actor",
  "update_actor",
  "create_actor_item",
  "update_actor_item",
  "create_scene_note",
  "set_document_flags"
];
var CONTROL_TOOL_NAMES = ["preview_change", "apply_approved_change"];
var TOOL_NAMES = [
  ...READ_TOOL_NAMES,
  ...WRITE_TOOL_NAMES,
  ...CONTROL_TOOL_NAMES
];
var DOCUMENT_TYPES = [
  "JournalEntry",
  "Actor",
  "Item",
  "Note",
  "Folder",
  "RollTable",
  "Playlist",
  "Scene"
];
var FOLDER_TYPES = [
  "JournalEntry",
  "Actor",
  "Item",
  "RollTable",
  "Playlist"
];
var DEFAULT_APPROVAL_TTL_SECONDS = 300;
var DEFAULT_REQUEST_TIMEOUT_MS = 15e3;

// src/schemas.ts
import { z } from "zod";
var timestampSchema = z.string().datetime({ offset: true });
var identifierSchema = z.string().min(1).max(200);
var maybeStringSchema = z.string().min(1).max(500).optional();
var jsonValueSchema = z.lazy(
  () => z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValueSchema), z.record(jsonValueSchema)])
);
var requestContextSchema = z.object({
  agentId: maybeStringSchema,
  agentName: maybeStringSchema,
  sessionId: maybeStringSchema,
  userId: maybeStringSchema
}).strict().optional();
var documentTypeSchema = z.enum(DOCUMENT_TYPES);
var folderTypeSchema = z.enum(FOLDER_TYPES);
var toolNameSchema = z.enum(TOOL_NAMES);
var readToolNameSchema = z.enum(READ_TOOL_NAMES);
var writeToolNameSchema = z.enum(WRITE_TOOL_NAMES);
var controlToolNameSchema = z.enum(CONTROL_TOOL_NAMES);
var documentRefSchema = z.object({
  type: documentTypeSchema,
  id: identifierSchema,
  actorId: identifierSchema.optional(),
  parentId: identifierSchema.optional(),
  sceneId: identifierSchema.optional()
}).strict();
var flagChangeSchema = z.object({
  namespace: z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/).default(MODULE_FLAG_NAMESPACE),
  key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/),
  value: jsonValueSchema
}).strict();
var systemChangeSchema = z.object({
  path: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/),
  value: jsonValueSchema
}).strict();
var prototypeTokenSubsetSchema = z.object({
  actorLink: z.boolean().optional(),
  displayBars: z.number().int().min(0).max(60).optional(),
  displayName: z.number().int().min(0).max(60).optional(),
  disposition: z.number().int().min(-1).max(1).optional(),
  name: z.string().min(1).max(200).optional(),
  vision: z.boolean().optional()
}).strict().optional();
var journalPageInputSchema = z.object({
  name: z.string().min(1).max(200),
  textContent: z.string().min(1)
}).strict();
var journalPageUpdateInputSchema = z.object({
  name: z.string().min(1).max(200),
  pageId: identifierSchema.optional(),
  textContent: z.string().min(1)
}).strict();
var writeControlSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  requestContext: requestContextSchema
}).strict();
var findDocumentsInputSchema = z.object({
  documentTypes: z.array(documentTypeSchema).min(1).max(8).optional(),
  folderId: identifierSchema.optional(),
  includeContent: z.boolean().default(false),
  limit: z.number().int().min(1).max(100).default(25),
  query: z.string().min(1).max(200).optional(),
  requestContext: requestContextSchema
}).strict();
var getDocumentInputSchema = z.object({
  includeContent: z.boolean().default(true),
  ref: documentRefSchema,
  requestContext: requestContextSchema
}).strict();
var listFoldersInputSchema = z.object({
  documentType: folderTypeSchema.optional(),
  parentId: identifierSchema.optional(),
  requestContext: requestContextSchema
}).strict();
var getSceneSummaryInputSchema = z.object({
  includeNotes: z.boolean().default(true),
  requestContext: requestContextSchema,
  sceneId: identifierSchema.optional(),
  sceneName: z.string().min(1).max(200).optional()
}).strict().refine((value) => Boolean(value.sceneId || value.sceneName), {
  message: "Provide sceneId or sceneName.",
  path: ["sceneId"]
});
var createJournalEntryInputSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  folderId: identifierSchema.optional(),
  pages: z.array(journalPageInputSchema).min(1).max(20).optional(),
  requestContext: requestContextSchema,
  title: z.string().min(1).max(200)
}).strict();
var updateJournalEntryInputSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  folderId: identifierSchema.optional(),
  journalEntryId: identifierSchema,
  pages: z.array(journalPageUpdateInputSchema).min(1).max(20).optional(),
  requestContext: requestContextSchema,
  title: z.string().min(1).max(200).optional()
}).strict();
var createActorInputSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  folderId: identifierSchema.optional(),
  img: z.string().min(1).max(500).optional(),
  name: z.string().min(1).max(200),
  prototypeToken: prototypeTokenSubsetSchema,
  requestContext: requestContextSchema,
  systemChanges: z.array(systemChangeSchema).max(50).optional(),
  type: z.string().min(1).max(100)
}).strict();
var updateActorInputSchema = z.object({
  actorId: identifierSchema,
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  folderId: identifierSchema.optional(),
  img: z.string().min(1).max(500).optional(),
  name: z.string().min(1).max(200).optional(),
  prototypeToken: prototypeTokenSubsetSchema,
  requestContext: requestContextSchema,
  systemChanges: z.array(systemChangeSchema).max(50).optional()
}).strict();
var createActorItemInputSchema = z.object({
  actorId: identifierSchema,
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  img: z.string().min(1).max(500).optional(),
  name: z.string().min(1).max(200),
  requestContext: requestContextSchema,
  systemChanges: z.array(systemChangeSchema).max(50).optional(),
  type: z.string().min(1).max(100)
}).strict();
var updateActorItemInputSchema = z.object({
  actorId: identifierSchema,
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).max(20).optional(),
  img: z.string().min(1).max(500).optional(),
  itemId: identifierSchema,
  name: z.string().min(1).max(200).optional(),
  requestContext: requestContextSchema,
  systemChanges: z.array(systemChangeSchema).max(50).optional()
}).strict();
var createSceneNoteInputSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  entryId: identifierSchema,
  flags: z.array(flagChangeSchema).max(20).optional(),
  icon: z.string().min(1).max(500).optional(),
  label: z.string().min(1).max(200).optional(),
  requestContext: requestContextSchema,
  sceneId: identifierSchema,
  text: z.string().min(1).max(500).optional(),
  x: z.number(),
  y: z.number()
}).strict();
var setDocumentFlagsInputSchema = z.object({
  approvalToken: z.string().min(20).max(300).optional(),
  dryRun: z.boolean(),
  flags: z.array(flagChangeSchema).min(1).max(20),
  ref: documentRefSchema,
  requestContext: requestContextSchema
}).strict();
var previewableChangeSchema = z.discriminatedUnion("toolName", [
  z.object({ payload: createJournalEntryInputSchema, toolName: z.literal("create_journal_entry") }).strict(),
  z.object({ payload: updateJournalEntryInputSchema, toolName: z.literal("update_journal_entry") }).strict(),
  z.object({ payload: createActorInputSchema, toolName: z.literal("create_actor") }).strict(),
  z.object({ payload: updateActorInputSchema, toolName: z.literal("update_actor") }).strict(),
  z.object({ payload: createActorItemInputSchema, toolName: z.literal("create_actor_item") }).strict(),
  z.object({ payload: updateActorItemInputSchema, toolName: z.literal("update_actor_item") }).strict(),
  z.object({ payload: createSceneNoteInputSchema, toolName: z.literal("create_scene_note") }).strict(),
  z.object({ payload: setDocumentFlagsInputSchema, toolName: z.literal("set_document_flags") }).strict()
]);
var previewChangeInputSchema = z.object({
  change: previewableChangeSchema,
  requestContext: requestContextSchema
}).strict();
var applyApprovedChangeInputSchema = z.object({
  approvalToken: z.string().min(20).max(300),
  requestContext: requestContextSchema
}).strict();
var bridgeJobSchema = z.object({
  dryRun: z.boolean(),
  jobId: identifierSchema,
  payload: z.record(jsonValueSchema),
  requestId: identifierSchema,
  toolName: toolNameSchema
}).strict();
var bridgeJobResultSchema = z.object({
  after: z.record(jsonValueSchema).nullable(),
  before: z.record(jsonValueSchema).nullable(),
  diff: z.array(diffEntrySchema),
  error: errorSchema.optional(),
  status: z.enum(["success", "error"]),
  warnings: z.array(z.string())
}).strict();
var auditMetadataSchema = z.object({
  agentId: maybeStringSchema,
  agentName: maybeStringSchema,
  foundrySessionId: maybeStringSchema,
  foundryUserId: maybeStringSchema,
  requestId: identifierSchema,
  timestamp: timestampSchema
}).strict();
var diffEntrySchema = z.object({
  after: jsonValueSchema,
  before: jsonValueSchema,
  path: z.string().min(1)
}).strict();
var normalizedDocumentSummarySchema = z.object({
  id: identifierSchema,
  img: z.string().optional(),
  name: z.string(),
  parentId: identifierSchema.optional(),
  sceneId: identifierSchema.optional(),
  type: documentTypeSchema
}).strict();
var normalizedDocumentSchema = normalizedDocumentSummarySchema.extend({
  flags: z.record(jsonValueSchema).optional(),
  folderId: identifierSchema.optional(),
  pages: z.array(
    z.object({
      id: identifierSchema.optional(),
      name: z.string(),
      textContent: z.string().optional()
    }).strict()
  ).optional(),
  system: z.record(jsonValueSchema).optional()
});
var sceneSummarySchema = z.object({
  active: z.boolean(),
  height: z.number().optional(),
  id: identifierSchema,
  name: z.string(),
  notes: z.array(normalizedDocumentSummarySchema),
  noteCount: z.number().int().nonnegative(),
  width: z.number().optional()
}).strict();
var changeResultDataSchema = z.object({
  after: normalizedDocumentSchema.nullable(),
  approvalRequired: z.boolean(),
  approved: z.boolean(),
  before: normalizedDocumentSchema.nullable(),
  diff: z.array(diffEntrySchema),
  dryRun: z.boolean(),
  warnings: z.array(z.string())
}).strict();
var previewChangeDataSchema = z.object({
  approvalToken: z.string().min(20).max(300),
  change: changeResultDataSchema,
  expiresAt: timestampSchema,
  toolName: writeToolNameSchema
}).strict();
var applyApprovedChangeDataSchema = changeResultDataSchema.extend({
  approvalTokenUsed: z.string().min(20).max(300),
  toolName: writeToolNameSchema
});
var errorSchema = z.object({
  code: z.string().min(1),
  details: jsonValueSchema.optional(),
  message: z.string().min(1)
}).strict();
function createEnvelopeSchema(dataSchema) {
  return z.object({
    audit: auditMetadataSchema,
    data: dataSchema,
    error: errorSchema.nullable(),
    ok: z.boolean(),
    requestId: identifierSchema,
    status: z.enum(["success", "error"]),
    timestamp: timestampSchema,
    tool: toolNameSchema
  }).strict();
}
var findDocumentsOutputSchema = createEnvelopeSchema(
  z.object({
    documents: z.array(normalizedDocumentSummarySchema)
  }).strict()
);
var getDocumentOutputSchema = createEnvelopeSchema(
  z.object({
    document: normalizedDocumentSchema
  }).strict()
);
var listFoldersOutputSchema = createEnvelopeSchema(
  z.object({
    folders: z.array(normalizedDocumentSummarySchema)
  }).strict()
);
var getSceneSummaryOutputSchema = createEnvelopeSchema(
  z.object({
    scene: sceneSummarySchema
  }).strict()
);
var writeToolOutputSchema = createEnvelopeSchema(changeResultDataSchema);
var previewChangeOutputSchema = createEnvelopeSchema(previewChangeDataSchema);
var applyApprovedChangeOutputSchema = createEnvelopeSchema(applyApprovedChangeDataSchema);
var toolInputSchemas = {
  apply_approved_change: applyApprovedChangeInputSchema,
  create_actor: createActorInputSchema,
  create_actor_item: createActorItemInputSchema,
  create_journal_entry: createJournalEntryInputSchema,
  create_scene_note: createSceneNoteInputSchema,
  find_documents: findDocumentsInputSchema,
  get_document: getDocumentInputSchema,
  get_scene_summary: getSceneSummaryInputSchema,
  list_folders: listFoldersInputSchema,
  preview_change: previewChangeInputSchema,
  set_document_flags: setDocumentFlagsInputSchema,
  update_actor: updateActorInputSchema,
  update_actor_item: updateActorItemInputSchema,
  update_journal_entry: updateJournalEntryInputSchema
};
var toolOutputSchemas = {
  apply_approved_change: applyApprovedChangeOutputSchema,
  create_actor: writeToolOutputSchema,
  create_actor_item: writeToolOutputSchema,
  create_journal_entry: writeToolOutputSchema,
  create_scene_note: writeToolOutputSchema,
  find_documents: findDocumentsOutputSchema,
  get_document: getDocumentOutputSchema,
  get_scene_summary: getSceneSummaryOutputSchema,
  list_folders: listFoldersOutputSchema,
  preview_change: previewChangeOutputSchema,
  set_document_flags: writeToolOutputSchema,
  update_actor: writeToolOutputSchema,
  update_actor_item: writeToolOutputSchema,
  update_journal_entry: writeToolOutputSchema
};

export {
  MODULE_ID,
  MODULE_FLAG_NAMESPACE,
  READ_TOOL_NAMES,
  WRITE_TOOL_NAMES,
  CONTROL_TOOL_NAMES,
  TOOL_NAMES,
  DOCUMENT_TYPES,
  FOLDER_TYPES,
  DEFAULT_APPROVAL_TTL_SECONDS,
  DEFAULT_REQUEST_TIMEOUT_MS,
  requestContextSchema,
  documentTypeSchema,
  folderTypeSchema,
  toolNameSchema,
  readToolNameSchema,
  writeToolNameSchema,
  controlToolNameSchema,
  documentRefSchema,
  flagChangeSchema,
  systemChangeSchema,
  prototypeTokenSubsetSchema,
  journalPageInputSchema,
  journalPageUpdateInputSchema,
  writeControlSchema,
  findDocumentsInputSchema,
  getDocumentInputSchema,
  listFoldersInputSchema,
  getSceneSummaryInputSchema,
  createJournalEntryInputSchema,
  updateJournalEntryInputSchema,
  createActorInputSchema,
  updateActorInputSchema,
  createActorItemInputSchema,
  updateActorItemInputSchema,
  createSceneNoteInputSchema,
  setDocumentFlagsInputSchema,
  previewableChangeSchema,
  previewChangeInputSchema,
  applyApprovedChangeInputSchema,
  bridgeJobSchema,
  bridgeJobResultSchema,
  auditMetadataSchema,
  diffEntrySchema,
  normalizedDocumentSummarySchema,
  normalizedDocumentSchema,
  sceneSummarySchema,
  changeResultDataSchema,
  previewChangeDataSchema,
  applyApprovedChangeDataSchema,
  errorSchema,
  createEnvelopeSchema,
  findDocumentsOutputSchema,
  getDocumentOutputSchema,
  listFoldersOutputSchema,
  getSceneSummaryOutputSchema,
  writeToolOutputSchema,
  previewChangeOutputSchema,
  applyApprovedChangeOutputSchema,
  toolInputSchemas,
  toolOutputSchemas
};
