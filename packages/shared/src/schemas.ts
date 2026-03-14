import { z } from "zod";

import {
  CONTROL_TOOL_NAMES,
  DOCUMENT_TYPES,
  FOLDER_TYPES,
  MODULE_FLAG_NAMESPACE,
  READ_TOOL_NAMES,
  TOOL_NAMES,
  WRITE_TOOL_NAMES,
} from "./constants.js";

const timestampSchema = z.string().datetime({ offset: true });
const identifierSchema = z.string().min(1).max(200);
const maybeStringSchema = z.string().min(1).max(500).optional();
const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValueSchema), z.record(jsonValueSchema)]),
);

export const requestContextSchema = z
  .object({
    agentId: maybeStringSchema,
    agentName: maybeStringSchema,
    sessionId: maybeStringSchema,
    userId: maybeStringSchema,
  })
  .strict()
  .optional();

export const documentTypeSchema = z.enum(DOCUMENT_TYPES);
export const folderTypeSchema = z.enum(FOLDER_TYPES);
export const toolNameSchema = z.enum(TOOL_NAMES);
export const readToolNameSchema = z.enum(READ_TOOL_NAMES);
export const writeToolNameSchema = z.enum(WRITE_TOOL_NAMES);
export const controlToolNameSchema = z.enum(CONTROL_TOOL_NAMES);

export const documentRefSchema = z
  .object({
    type: documentTypeSchema,
    id: identifierSchema,
    actorId: identifierSchema.optional(),
    parentId: identifierSchema.optional(),
    sceneId: identifierSchema.optional(),
  })
  .strict();

export const flagChangeSchema = z
  .object({
    namespace: z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/).default(MODULE_FLAG_NAMESPACE),
    key: z.string().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/),
    value: jsonValueSchema,
  })
  .strict();

export const systemChangeSchema = z
  .object({
    path: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/),
    value: jsonValueSchema,
  })
  .strict();

export const prototypeTokenSubsetSchema = z
  .object({
    actorLink: z.boolean().optional(),
    displayBars: z.number().int().min(0).max(60).optional(),
    displayName: z.number().int().min(0).max(60).optional(),
    disposition: z.number().int().min(-1).max(1).optional(),
    name: z.string().min(1).max(200).optional(),
    vision: z.boolean().optional(),
  })
  .strict()
  .optional();

export const journalPageInputSchema = z
  .object({
    name: z.string().min(1).max(200),
    textContent: z.string().min(1),
  })
  .strict();

export const journalPageUpdateInputSchema = z
  .object({
    name: z.string().min(1).max(200),
    pageId: identifierSchema.optional(),
    textContent: z.string().min(1),
  })
  .strict();

export const writeControlSchema = z
  .object({
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    requestContext: requestContextSchema,
  })
  .strict();

export const findDocumentsInputSchema = z
  .object({
    documentTypes: z.array(documentTypeSchema).min(1).max(8).optional(),
    folderId: identifierSchema.optional(),
    includeContent: z.boolean().default(false),
    limit: z.number().int().min(1).max(100).default(25),
    query: z.string().min(1).max(200).optional(),
    requestContext: requestContextSchema,
  })
  .strict();

export const getDocumentInputSchema = z
  .object({
    includeContent: z.boolean().default(true),
    ref: documentRefSchema,
    requestContext: requestContextSchema,
  })
  .strict();

export const listFoldersInputSchema = z
  .object({
    documentType: folderTypeSchema.optional(),
    parentId: identifierSchema.optional(),
    requestContext: requestContextSchema,
  })
  .strict();

export const getSceneSummaryInputSchema = z
  .object({
    includeNotes: z.boolean().default(true),
    requestContext: requestContextSchema,
    sceneId: identifierSchema.optional(),
    sceneName: z.string().min(1).max(200).optional(),
  })
  .strict();

export const createJournalEntryInputSchema = z
  .object({
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    folderId: identifierSchema.optional(),
    pages: z.array(journalPageInputSchema).min(1).max(20).optional(),
    requestContext: requestContextSchema,
    title: z.string().min(1).max(200),
  })
  .strict();

export const updateJournalEntryInputSchema = z
  .object({
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    folderId: identifierSchema.optional(),
    journalEntryId: identifierSchema,
    pages: z.array(journalPageUpdateInputSchema).min(1).max(20).optional(),
    requestContext: requestContextSchema,
    title: z.string().min(1).max(200).optional(),
  })
  .strict();

export const createActorInputSchema = z
  .object({
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    folderId: identifierSchema.optional(),
    img: z.string().min(1).max(500).optional(),
    name: z.string().min(1).max(200),
    prototypeToken: prototypeTokenSubsetSchema,
    requestContext: requestContextSchema,
    systemChanges: z.array(systemChangeSchema).max(50).optional(),
    type: z.string().min(1).max(100),
  })
  .strict();

export const updateActorInputSchema = z
  .object({
    actorId: identifierSchema,
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    folderId: identifierSchema.optional(),
    img: z.string().min(1).max(500).optional(),
    name: z.string().min(1).max(200).optional(),
    prototypeToken: prototypeTokenSubsetSchema,
    requestContext: requestContextSchema,
    systemChanges: z.array(systemChangeSchema).max(50).optional(),
  })
  .strict();

export const createActorItemInputSchema = z
  .object({
    actorId: identifierSchema,
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    img: z.string().min(1).max(500).optional(),
    name: z.string().min(1).max(200),
    requestContext: requestContextSchema,
    systemChanges: z.array(systemChangeSchema).max(50).optional(),
    type: z.string().min(1).max(100),
  })
  .strict();

export const updateActorItemInputSchema = z
  .object({
    actorId: identifierSchema,
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).max(20).optional(),
    img: z.string().min(1).max(500).optional(),
    itemId: identifierSchema,
    name: z.string().min(1).max(200).optional(),
    requestContext: requestContextSchema,
    systemChanges: z.array(systemChangeSchema).max(50).optional(),
  })
  .strict();

export const createSceneNoteInputSchema = z
  .object({
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
    y: z.number(),
  })
  .strict();

export const setDocumentFlagsInputSchema = z
  .object({
    approvalToken: z.string().min(20).max(300).optional(),
    dryRun: z.boolean(),
    flags: z.array(flagChangeSchema).min(1).max(20),
    ref: documentRefSchema,
    requestContext: requestContextSchema,
  })
  .strict();

export const previewableChangeSchema = z.discriminatedUnion("toolName", [
  z.object({ payload: createJournalEntryInputSchema, toolName: z.literal("create_journal_entry") }).strict(),
  z.object({ payload: updateJournalEntryInputSchema, toolName: z.literal("update_journal_entry") }).strict(),
  z.object({ payload: createActorInputSchema, toolName: z.literal("create_actor") }).strict(),
  z.object({ payload: updateActorInputSchema, toolName: z.literal("update_actor") }).strict(),
  z.object({ payload: createActorItemInputSchema, toolName: z.literal("create_actor_item") }).strict(),
  z.object({ payload: updateActorItemInputSchema, toolName: z.literal("update_actor_item") }).strict(),
  z.object({ payload: createSceneNoteInputSchema, toolName: z.literal("create_scene_note") }).strict(),
  z.object({ payload: setDocumentFlagsInputSchema, toolName: z.literal("set_document_flags") }).strict(),
]);

export const previewChangeInputSchema = z
  .object({
    change: previewableChangeSchema,
    requestContext: requestContextSchema,
  })
  .strict();

export const applyApprovedChangeInputSchema = z
  .object({
    approvalToken: z.string().min(20).max(300),
    requestContext: requestContextSchema,
  })
  .strict();

export const auditMetadataSchema = z
  .object({
    agentId: maybeStringSchema,
    agentName: maybeStringSchema,
    foundrySessionId: maybeStringSchema,
    foundryUserId: maybeStringSchema,
    requestId: identifierSchema,
    timestamp: timestampSchema,
  })
  .strict();

export const diffEntrySchema = z
  .object({
    after: jsonValueSchema,
    before: jsonValueSchema,
    path: z.string().min(1),
  })
  .strict();

export const normalizedDocumentSummarySchema = z
  .object({
    id: identifierSchema,
    img: z.string().optional(),
    name: z.string(),
    parentId: identifierSchema.optional(),
    sceneId: identifierSchema.optional(),
    type: documentTypeSchema,
  })
  .strict();

export const normalizedDocumentSchema = normalizedDocumentSummarySchema.extend({
  flags: z.record(jsonValueSchema).optional(),
  folderId: identifierSchema.optional(),
  pages: z
    .array(
      z
        .object({
          id: identifierSchema.optional(),
          name: z.string(),
          textContent: z.string().optional(),
        })
        .strict(),
    )
    .optional(),
  system: z.record(jsonValueSchema).optional(),
});

export const sceneSummarySchema = z
  .object({
    active: z.boolean(),
    height: z.number().optional(),
    id: identifierSchema,
    name: z.string(),
    notes: z.array(normalizedDocumentSummarySchema),
    noteCount: z.number().int().nonnegative(),
    width: z.number().optional(),
  })
  .strict();

export const changeResultDataSchema = z
  .object({
    after: normalizedDocumentSchema.nullable(),
    approvalRequired: z.boolean(),
    approved: z.boolean(),
    before: normalizedDocumentSchema.nullable(),
    diff: z.array(diffEntrySchema),
    dryRun: z.boolean(),
    warnings: z.array(z.string()),
  })
  .strict();

export const previewChangeDataSchema = z
  .object({
    approvalToken: z.string().min(20).max(300),
    change: changeResultDataSchema,
    expiresAt: timestampSchema,
    toolName: writeToolNameSchema,
  })
  .strict();

export const applyApprovedChangeDataSchema = changeResultDataSchema.extend({
  approvalTokenUsed: z.string().min(20).max(300),
  toolName: writeToolNameSchema,
});

export const errorSchema = z
  .object({
    code: z.string().min(1),
    details: jsonValueSchema.optional(),
    message: z.string().min(1),
  })
  .strict();

export const bridgeJobSchema = z
  .object({
    dryRun: z.boolean(),
    jobId: identifierSchema,
    payload: z.record(jsonValueSchema),
    requestId: identifierSchema,
    toolName: toolNameSchema,
  })
  .strict();

export const bridgeJobResultSchema = z
  .object({
    after: z.record(jsonValueSchema).nullable(),
    before: z.record(jsonValueSchema).nullable(),
    diff: z.array(diffEntrySchema),
    error: errorSchema.optional(),
    status: z.enum(["success", "error"]),
    warnings: z.array(z.string()),
  })
  .strict();

export function createEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      audit: auditMetadataSchema,
      data: dataSchema,
      error: errorSchema.nullable(),
      ok: z.boolean(),
      requestId: identifierSchema,
      status: z.enum(["success", "error"]),
      timestamp: timestampSchema,
      tool: toolNameSchema,
    })
    .strict();
}

export const findDocumentsOutputSchema = createEnvelopeSchema(
  z
    .object({
      documents: z.array(normalizedDocumentSummarySchema),
    })
    .strict(),
);

export const getDocumentOutputSchema = createEnvelopeSchema(
  z
    .object({
      document: normalizedDocumentSchema,
    })
    .strict(),
);

export const listFoldersOutputSchema = createEnvelopeSchema(
  z
    .object({
      folders: z.array(normalizedDocumentSummarySchema),
    })
    .strict(),
);

export const getSceneSummaryOutputSchema = createEnvelopeSchema(
  z
    .object({
      scene: sceneSummarySchema,
    })
    .strict(),
);

export const writeToolOutputSchema = createEnvelopeSchema(changeResultDataSchema);
export const previewChangeOutputSchema = createEnvelopeSchema(previewChangeDataSchema);
export const applyApprovedChangeOutputSchema = createEnvelopeSchema(applyApprovedChangeDataSchema);

export const toolInputSchemas = {
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
  update_journal_entry: updateJournalEntryInputSchema,
} as const;

export const toolOutputSchemas = {
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
  update_journal_entry: writeToolOutputSchema,
} as const;

export type ToolName = z.infer<typeof toolNameSchema>;
export type WriteToolName = z.infer<typeof writeToolNameSchema>;
export type DocumentRef = z.infer<typeof documentRefSchema>;
export type RequestContext = z.infer<typeof requestContextSchema>;
export type ChangeResultData = z.infer<typeof changeResultDataSchema>;
export type BridgeJob = z.infer<typeof bridgeJobSchema>;
export type BridgeJobResult = z.infer<typeof bridgeJobResultSchema>;
