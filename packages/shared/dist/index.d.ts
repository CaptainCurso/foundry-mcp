import { z } from 'zod';

interface SystemChange {
    path: string;
    value: unknown;
}
interface FlagChange {
    namespace: string;
    key: string;
    value: unknown;
}
declare function assertAllowedNamespaces(flags: FlagChange[] | undefined, allowedNamespaces: string[]): void;
declare function assertAllowedSystemPaths(systemChanges: SystemChange[] | undefined, allowedPaths: string[]): void;
declare function assertAllowedFields(requestedFields: string[], allowedFields: string[], context: string): void;
declare function pathChangesToObject(changes: SystemChange[] | undefined): Record<string, unknown>;
declare function flagChangesToObject(flags: FlagChange[] | undefined): Record<string, unknown>;

declare const MODULE_ID = "foundryvtt-mcp-bridge-module";
declare const MODULE_FLAG_NAMESPACE = "foundryvtt-mcp-bridge-module";
declare const READ_TOOL_NAMES: readonly ["find_documents", "get_document", "list_folders", "get_scene_summary"];
declare const WRITE_TOOL_NAMES: readonly ["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"];
declare const CONTROL_TOOL_NAMES: readonly ["preview_change", "apply_approved_change"];
declare const TOOL_NAMES: readonly ["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"];
declare const DOCUMENT_TYPES: readonly ["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"];
declare const FOLDER_TYPES: readonly ["JournalEntry", "Actor", "Item", "RollTable", "Playlist"];
declare const DEFAULT_APPROVAL_TTL_SECONDS = 300;
declare const DEFAULT_REQUEST_TIMEOUT_MS = 15000;

interface DiffEntry {
    path: string;
    before: unknown;
    after: unknown;
}
declare function diffValues(before: unknown, after: unknown, basePath?: string): DiffEntry[];

declare const ERROR_CODES: {
    readonly approvalExpired: "APPROVAL_EXPIRED";
    readonly approvalMismatch: "APPROVAL_MISMATCH";
    readonly approvalRequired: "APPROVAL_REQUIRED";
    readonly approvalUsed: "APPROVAL_ALREADY_USED";
    readonly bridgeOffline: "BRIDGE_OFFLINE";
    readonly documentNotFound: "DOCUMENT_NOT_FOUND";
    readonly forbiddenField: "FORBIDDEN_FIELD";
    readonly forbiddenOperation: "FORBIDDEN_OPERATION";
    readonly invalidAuth: "INVALID_AUTH";
    readonly invalidPayload: "INVALID_PAYLOAD";
    readonly invalidSession: "INVALID_SESSION";
    readonly moduleError: "MODULE_ERROR";
    readonly timeout: "REQUEST_TIMEOUT";
    readonly unsupportedDocumentType: "UNSUPPORTED_DOCUMENT_TYPE";
};
type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
declare class BridgeError extends Error {
    code: ErrorCode;
    statusCode: number;
    details?: unknown;
    constructor(code: ErrorCode, message: string, statusCode?: number, details?: unknown);
}

declare const TOOL_EXAMPLES: {
    readonly apply_approved_change: {
        readonly input: {
            readonly approvalToken: "approval_xxxxxxxxxxxxxxxxxxxxx";
        };
    };
    readonly create_actor: {
        readonly input: {
            readonly dryRun: true;
            readonly flags: readonly [{
                readonly key: "source";
                readonly namespace: "foundryvtt-mcp-bridge-module";
                readonly value: "codex";
            }];
            readonly name: "Bridge Test Actor";
            readonly systemChanges: readonly [{
                readonly path: "details.biography.value";
                readonly value: "Created through MCP bridge";
            }];
            readonly type: "npc";
        };
    };
    readonly create_actor_item: {
        readonly input: {
            readonly actorId: "ACTOR_ID";
            readonly dryRun: true;
            readonly name: "Bridge Longsword";
            readonly type: "weapon";
        };
    };
    readonly create_journal_entry: {
        readonly input: {
            readonly dryRun: true;
            readonly pages: readonly [{
                readonly name: "Overview";
                readonly textContent: "Bridge-created page content.";
            }];
            readonly title: "Bridge Journal";
        };
    };
    readonly create_scene_note: {
        readonly input: {
            readonly dryRun: true;
            readonly entryId: "JOURNAL_ID";
            readonly label: "Bridge Note";
            readonly sceneId: "SCENE_ID";
            readonly x: 1200;
            readonly y: 800;
        };
    };
    readonly find_documents: {
        readonly input: {
            readonly documentTypes: readonly ["Actor", "JournalEntry"];
            readonly limit: 10;
            readonly query: "bridge";
        };
    };
    readonly get_document: {
        readonly input: {
            readonly includeContent: true;
            readonly ref: {
                readonly id: "JOURNAL_ID";
                readonly type: "JournalEntry";
            };
        };
    };
    readonly get_scene_summary: {
        readonly input: {
            readonly includeNotes: true;
            readonly sceneId: "SCENE_ID";
        };
    };
    readonly list_folders: {
        readonly input: {
            readonly documentType: "Actor";
        };
    };
    readonly preview_change: {
        readonly input: {
            readonly change: {
                readonly payload: {
                    readonly dryRun: true;
                    readonly pages: readonly [{
                        readonly name: "Overview";
                        readonly textContent: "Bridge-created page content.";
                    }];
                    readonly title: "Bridge Journal";
                };
                readonly toolName: "create_journal_entry";
            };
        };
    };
    readonly set_document_flags: {
        readonly input: {
            readonly dryRun: true;
            readonly flags: readonly [{
                readonly key: "approved";
                readonly namespace: "foundryvtt-mcp-bridge-module";
                readonly value: true;
            }];
            readonly ref: {
                readonly id: "ACTOR_ID";
                readonly type: "Actor";
            };
        };
    };
    readonly update_actor: {
        readonly input: {
            readonly actorId: "ACTOR_ID";
            readonly dryRun: true;
            readonly name: "Updated Bridge Actor";
        };
    };
    readonly update_actor_item: {
        readonly input: {
            readonly actorId: "ACTOR_ID";
            readonly dryRun: true;
            readonly itemId: "ITEM_ID";
            readonly name: "Updated Bridge Longsword";
        };
    };
    readonly update_journal_entry: {
        readonly input: {
            readonly dryRun: true;
            readonly journalEntryId: "JOURNAL_ID";
            readonly title: "Updated Bridge Journal";
        };
    };
};
declare const TOOL_GROUPS: {
    readonly control: readonly ["preview_change", "apply_approved_change"];
    readonly read: readonly ["find_documents", "get_document", "list_folders", "get_scene_summary"];
    readonly write: readonly ["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"];
};

declare const requestContextSchema: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
    agentName: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    agentId?: string | undefined;
    agentName?: string | undefined;
    sessionId?: string | undefined;
    userId?: string | undefined;
}, {
    agentId?: string | undefined;
    agentName?: string | undefined;
    sessionId?: string | undefined;
    userId?: string | undefined;
}>>;
declare const documentTypeSchema: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
declare const folderTypeSchema: z.ZodEnum<["JournalEntry", "Actor", "Item", "RollTable", "Playlist"]>;
declare const toolNameSchema: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
declare const readToolNameSchema: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary"]>;
declare const writeToolNameSchema: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
declare const controlToolNameSchema: z.ZodEnum<["preview_change", "apply_approved_change"]>;
declare const documentRefSchema: z.ZodObject<{
    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    id: z.ZodString;
    actorId: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    sceneId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    actorId?: string | undefined;
    parentId?: string | undefined;
    sceneId?: string | undefined;
}, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    actorId?: string | undefined;
    parentId?: string | undefined;
    sceneId?: string | undefined;
}>;
declare const flagChangeSchema: z.ZodObject<{
    namespace: z.ZodDefault<z.ZodString>;
    key: z.ZodString;
    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
}, "strict", z.ZodTypeAny, {
    namespace: string;
    key: string;
    value?: unknown;
}, {
    key: string;
    value?: unknown;
    namespace?: string | undefined;
}>;
declare const systemChangeSchema: z.ZodObject<{
    path: z.ZodString;
    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
}, "strict", z.ZodTypeAny, {
    path: string;
    value?: unknown;
}, {
    path: string;
    value?: unknown;
}>;
declare const prototypeTokenSubsetSchema: z.ZodOptional<z.ZodObject<{
    actorLink: z.ZodOptional<z.ZodBoolean>;
    displayBars: z.ZodOptional<z.ZodNumber>;
    displayName: z.ZodOptional<z.ZodNumber>;
    disposition: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    vision: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    actorLink?: boolean | undefined;
    displayBars?: number | undefined;
    displayName?: number | undefined;
    disposition?: number | undefined;
    name?: string | undefined;
    vision?: boolean | undefined;
}, {
    actorLink?: boolean | undefined;
    displayBars?: number | undefined;
    displayName?: number | undefined;
    disposition?: number | undefined;
    name?: string | undefined;
    vision?: boolean | undefined;
}>>;
declare const journalPageInputSchema: z.ZodObject<{
    name: z.ZodString;
    textContent: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
    textContent: string;
}, {
    name: string;
    textContent: string;
}>;
declare const journalPageUpdateInputSchema: z.ZodObject<{
    name: z.ZodString;
    pageId: z.ZodOptional<z.ZodString>;
    textContent: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
    textContent: string;
    pageId?: string | undefined;
}, {
    name: string;
    textContent: string;
    pageId?: string | undefined;
}>;
declare const writeControlSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}, {
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}>;
declare const findDocumentsInputSchema: z.ZodObject<{
    documentTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>, "many">>;
    folderId: z.ZodOptional<z.ZodString>;
    includeContent: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    includeContent: boolean;
    limit: number;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    documentTypes?: ("JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene")[] | undefined;
    folderId?: string | undefined;
    query?: string | undefined;
}, {
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    documentTypes?: ("JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene")[] | undefined;
    folderId?: string | undefined;
    includeContent?: boolean | undefined;
    limit?: number | undefined;
    query?: string | undefined;
}>;
declare const getDocumentInputSchema: z.ZodObject<{
    includeContent: z.ZodDefault<z.ZodBoolean>;
    ref: z.ZodObject<{
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        id: z.ZodString;
        actorId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    }>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    includeContent: boolean;
    ref: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    };
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}, {
    ref: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    };
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    includeContent?: boolean | undefined;
}>;
declare const listFoldersInputSchema: z.ZodObject<{
    documentType: z.ZodOptional<z.ZodEnum<["JournalEntry", "Actor", "Item", "RollTable", "Playlist"]>>;
    parentId: z.ZodOptional<z.ZodString>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    parentId?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    documentType?: "JournalEntry" | "Actor" | "Item" | "RollTable" | "Playlist" | undefined;
}, {
    parentId?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    documentType?: "JournalEntry" | "Actor" | "Item" | "RollTable" | "Playlist" | undefined;
}>;
declare const getSceneSummaryInputSchema: z.ZodObject<{
    includeNotes: z.ZodDefault<z.ZodBoolean>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    sceneId: z.ZodOptional<z.ZodString>;
    sceneName: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    includeNotes: boolean;
    sceneId?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    sceneName?: string | undefined;
}, {
    sceneId?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    includeNotes?: boolean | undefined;
    sceneName?: string | undefined;
}>;
declare const createJournalEntryInputSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    folderId: z.ZodOptional<z.ZodString>;
    pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        textContent: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        textContent: string;
    }, {
        name: string;
        textContent: string;
    }>, "many">>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    title: z.ZodString;
}, "strict", z.ZodTypeAny, {
    dryRun: boolean;
    title: string;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    pages?: {
        name: string;
        textContent: string;
    }[] | undefined;
}, {
    dryRun: boolean;
    title: string;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    pages?: {
        name: string;
        textContent: string;
    }[] | undefined;
}>;
declare const updateJournalEntryInputSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    folderId: z.ZodOptional<z.ZodString>;
    journalEntryId: z.ZodString;
    pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        pageId: z.ZodOptional<z.ZodString>;
        textContent: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
        textContent: string;
        pageId?: string | undefined;
    }, {
        name: string;
        textContent: string;
        pageId?: string | undefined;
    }>, "many">>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    title: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    dryRun: boolean;
    journalEntryId: string;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    pages?: {
        name: string;
        textContent: string;
        pageId?: string | undefined;
    }[] | undefined;
    title?: string | undefined;
}, {
    dryRun: boolean;
    journalEntryId: string;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    pages?: {
        name: string;
        textContent: string;
        pageId?: string | undefined;
    }[] | undefined;
    title?: string | undefined;
}>;
declare const createActorInputSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    folderId: z.ZodOptional<z.ZodString>;
    img: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    prototypeToken: z.ZodOptional<z.ZodObject<{
        actorLink: z.ZodOptional<z.ZodBoolean>;
        displayBars: z.ZodOptional<z.ZodNumber>;
        displayName: z.ZodOptional<z.ZodNumber>;
        disposition: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        vision: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    }, {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    }>>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        value?: unknown;
    }, {
        path: string;
        value?: unknown;
    }>, "many">>;
    type: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: string;
    name: string;
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    img?: string | undefined;
    prototypeToken?: {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    } | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}, {
    type: string;
    name: string;
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    prototypeToken?: {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    } | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}>;
declare const updateActorInputSchema: z.ZodObject<{
    actorId: z.ZodString;
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    folderId: z.ZodOptional<z.ZodString>;
    img: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    prototypeToken: z.ZodOptional<z.ZodObject<{
        actorLink: z.ZodOptional<z.ZodBoolean>;
        displayBars: z.ZodOptional<z.ZodNumber>;
        displayName: z.ZodOptional<z.ZodNumber>;
        disposition: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        vision: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    }, {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    }>>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        value?: unknown;
    }, {
        path: string;
        value?: unknown;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    actorId: string;
    dryRun: boolean;
    name?: string | undefined;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    img?: string | undefined;
    prototypeToken?: {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    } | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}, {
    actorId: string;
    dryRun: boolean;
    name?: string | undefined;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    folderId?: string | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    prototypeToken?: {
        actorLink?: boolean | undefined;
        displayBars?: number | undefined;
        displayName?: number | undefined;
        disposition?: number | undefined;
        name?: string | undefined;
        vision?: boolean | undefined;
    } | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}>;
declare const createActorItemInputSchema: z.ZodObject<{
    actorId: z.ZodString;
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    img: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        value?: unknown;
    }, {
        path: string;
        value?: unknown;
    }>, "many">>;
    type: z.ZodString;
}, "strict", z.ZodTypeAny, {
    type: string;
    actorId: string;
    name: string;
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    img?: string | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}, {
    type: string;
    actorId: string;
    name: string;
    dryRun: boolean;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}>;
declare const updateActorItemInputSchema: z.ZodObject<{
    actorId: z.ZodString;
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    img: z.ZodOptional<z.ZodString>;
    itemId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        path: string;
        value?: unknown;
    }, {
        path: string;
        value?: unknown;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    actorId: string;
    dryRun: boolean;
    itemId: string;
    name?: string | undefined;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    img?: string | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}, {
    actorId: string;
    dryRun: boolean;
    itemId: string;
    name?: string | undefined;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    systemChanges?: {
        path: string;
        value?: unknown;
    }[] | undefined;
}>;
declare const createSceneNoteInputSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    entryId: z.ZodString;
    flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">>;
    icon: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
    sceneId: z.ZodString;
    text: z.ZodOptional<z.ZodString>;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    sceneId: string;
    dryRun: boolean;
    entryId: string;
    x: number;
    y: number;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        namespace: string;
        key: string;
        value?: unknown;
    }[] | undefined;
    icon?: string | undefined;
    label?: string | undefined;
    text?: string | undefined;
}, {
    sceneId: string;
    dryRun: boolean;
    entryId: string;
    x: number;
    y: number;
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
    flags?: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[] | undefined;
    icon?: string | undefined;
    label?: string | undefined;
    text?: string | undefined;
}>;
declare const setDocumentFlagsInputSchema: z.ZodObject<{
    approvalToken: z.ZodOptional<z.ZodString>;
    dryRun: z.ZodBoolean;
    flags: z.ZodArray<z.ZodObject<{
        namespace: z.ZodDefault<z.ZodString>;
        key: z.ZodString;
        value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    }, "strict", z.ZodTypeAny, {
        namespace: string;
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }>, "many">;
    ref: z.ZodObject<{
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        id: z.ZodString;
        actorId: z.ZodOptional<z.ZodString>;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    }>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    dryRun: boolean;
    ref: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    };
    flags: {
        namespace: string;
        key: string;
        value?: unknown;
    }[];
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}, {
    dryRun: boolean;
    ref: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        actorId?: string | undefined;
        parentId?: string | undefined;
        sceneId?: string | undefined;
    };
    flags: {
        key: string;
        value?: unknown;
        namespace?: string | undefined;
    }[];
    approvalToken?: string | undefined;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}>;
declare const previewableChangeSchema: z.ZodDiscriminatedUnion<"toolName", [z.ZodObject<{
    payload: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            textContent: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            textContent: string;
        }, {
            name: string;
            textContent: string;
        }>, "many">>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        title: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    }, {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    }>;
    toolName: z.ZodLiteral<"create_journal_entry">;
}, "strict", z.ZodTypeAny, {
    toolName: "create_journal_entry";
    payload: {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    };
}, {
    toolName: "create_journal_entry";
    payload: {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        journalEntryId: z.ZodString;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            pageId: z.ZodOptional<z.ZodString>;
            textContent: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }, {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }>, "many">>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        title: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    }, {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    }>;
    toolName: z.ZodLiteral<"update_journal_entry">;
}, "strict", z.ZodTypeAny, {
    toolName: "update_journal_entry";
    payload: {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    };
}, {
    toolName: "update_journal_entry";
    payload: {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        prototypeToken: z.ZodOptional<z.ZodObject<{
            actorLink: z.ZodOptional<z.ZodBoolean>;
            displayBars: z.ZodOptional<z.ZodNumber>;
            displayName: z.ZodOptional<z.ZodNumber>;
            disposition: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            vision: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }>>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
        type: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    toolName: z.ZodLiteral<"create_actor">;
}, "strict", z.ZodTypeAny, {
    toolName: "create_actor";
    payload: {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}, {
    toolName: "create_actor";
    payload: {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        prototypeToken: z.ZodOptional<z.ZodObject<{
            actorLink: z.ZodOptional<z.ZodBoolean>;
            displayBars: z.ZodOptional<z.ZodNumber>;
            displayName: z.ZodOptional<z.ZodNumber>;
            disposition: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            vision: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }>>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    toolName: z.ZodLiteral<"update_actor">;
}, "strict", z.ZodTypeAny, {
    toolName: "update_actor";
    payload: {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}, {
    toolName: "update_actor";
    payload: {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
        type: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    toolName: z.ZodLiteral<"create_actor_item">;
}, "strict", z.ZodTypeAny, {
    toolName: "create_actor_item";
    payload: {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}, {
    toolName: "create_actor_item";
    payload: {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        img: z.ZodOptional<z.ZodString>;
        itemId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    toolName: z.ZodLiteral<"update_actor_item">;
}, "strict", z.ZodTypeAny, {
    toolName: "update_actor_item";
    payload: {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}, {
    toolName: "update_actor_item";
    payload: {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        entryId: z.ZodString;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        icon: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        sceneId: z.ZodString;
        text: z.ZodOptional<z.ZodString>;
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    }, {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    }>;
    toolName: z.ZodLiteral<"create_scene_note">;
}, "strict", z.ZodTypeAny, {
    toolName: "create_scene_note";
    payload: {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    };
}, {
    toolName: "create_scene_note";
    payload: {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    };
}>, z.ZodObject<{
    payload: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">;
        ref: z.ZodObject<{
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            id: z.ZodString;
            actorId: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            namespace: string;
            key: string;
            value?: unknown;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }, {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }>;
    toolName: z.ZodLiteral<"set_document_flags">;
}, "strict", z.ZodTypeAny, {
    toolName: "set_document_flags";
    payload: {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            namespace: string;
            key: string;
            value?: unknown;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    };
}, {
    toolName: "set_document_flags";
    payload: {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    };
}>]>;
declare const previewChangeInputSchema: z.ZodObject<{
    change: z.ZodDiscriminatedUnion<"toolName", [z.ZodObject<{
        payload: z.ZodObject<{
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                textContent: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                textContent: string;
            }, {
                name: string;
                textContent: string;
            }>, "many">>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            title: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        }, {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        }>;
        toolName: z.ZodLiteral<"create_journal_entry">;
    }, "strict", z.ZodTypeAny, {
        toolName: "create_journal_entry";
        payload: {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        };
    }, {
        toolName: "create_journal_entry";
        payload: {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            folderId: z.ZodOptional<z.ZodString>;
            journalEntryId: z.ZodString;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                pageId: z.ZodOptional<z.ZodString>;
                textContent: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }, {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }>, "many">>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            title: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        }, {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        }>;
        toolName: z.ZodLiteral<"update_journal_entry">;
    }, "strict", z.ZodTypeAny, {
        toolName: "update_journal_entry";
        payload: {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        };
    }, {
        toolName: "update_journal_entry";
        payload: {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            folderId: z.ZodOptional<z.ZodString>;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            prototypeToken: z.ZodOptional<z.ZodObject<{
                actorLink: z.ZodOptional<z.ZodBoolean>;
                displayBars: z.ZodOptional<z.ZodNumber>;
                displayName: z.ZodOptional<z.ZodNumber>;
                disposition: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                vision: z.ZodOptional<z.ZodBoolean>;
            }, "strict", z.ZodTypeAny, {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            }, {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            }>>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                path: string;
                value?: unknown;
            }, {
                path: string;
                value?: unknown;
            }>, "many">>;
            type: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }, {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }>;
        toolName: z.ZodLiteral<"create_actor">;
    }, "strict", z.ZodTypeAny, {
        toolName: "create_actor";
        payload: {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }, {
        toolName: "create_actor";
        payload: {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            actorId: z.ZodString;
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            folderId: z.ZodOptional<z.ZodString>;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            prototypeToken: z.ZodOptional<z.ZodObject<{
                actorLink: z.ZodOptional<z.ZodBoolean>;
                displayBars: z.ZodOptional<z.ZodNumber>;
                displayName: z.ZodOptional<z.ZodNumber>;
                disposition: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                vision: z.ZodOptional<z.ZodBoolean>;
            }, "strict", z.ZodTypeAny, {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            }, {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            }>>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                path: string;
                value?: unknown;
            }, {
                path: string;
                value?: unknown;
            }>, "many">>;
        }, "strict", z.ZodTypeAny, {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }, {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }>;
        toolName: z.ZodLiteral<"update_actor">;
    }, "strict", z.ZodTypeAny, {
        toolName: "update_actor";
        payload: {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }, {
        toolName: "update_actor";
        payload: {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            actorId: z.ZodString;
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                path: string;
                value?: unknown;
            }, {
                path: string;
                value?: unknown;
            }>, "many">>;
            type: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }, {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }>;
        toolName: z.ZodLiteral<"create_actor_item">;
    }, "strict", z.ZodTypeAny, {
        toolName: "create_actor_item";
        payload: {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }, {
        toolName: "create_actor_item";
        payload: {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            actorId: z.ZodString;
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            img: z.ZodOptional<z.ZodString>;
            itemId: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                path: string;
                value?: unknown;
            }, {
                path: string;
                value?: unknown;
            }>, "many">>;
        }, "strict", z.ZodTypeAny, {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }, {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        }>;
        toolName: z.ZodLiteral<"update_actor_item">;
    }, "strict", z.ZodTypeAny, {
        toolName: "update_actor_item";
        payload: {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }, {
        toolName: "update_actor_item";
        payload: {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            entryId: z.ZodString;
            flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">>;
            icon: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
            sceneId: z.ZodString;
            text: z.ZodOptional<z.ZodString>;
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        }, {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        }>;
        toolName: z.ZodLiteral<"create_scene_note">;
    }, "strict", z.ZodTypeAny, {
        toolName: "create_scene_note";
        payload: {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        };
    }, {
        toolName: "create_scene_note";
        payload: {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        };
    }>, z.ZodObject<{
        payload: z.ZodObject<{
            approvalToken: z.ZodOptional<z.ZodString>;
            dryRun: z.ZodBoolean;
            flags: z.ZodArray<z.ZodObject<{
                namespace: z.ZodDefault<z.ZodString>;
                key: z.ZodString;
                value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            }, "strict", z.ZodTypeAny, {
                namespace: string;
                key: string;
                value?: unknown;
            }, {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }>, "many">;
            ref: z.ZodObject<{
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
                id: z.ZodString;
                actorId: z.ZodOptional<z.ZodString>;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            }>;
            requestContext: z.ZodOptional<z.ZodObject<{
                agentId: z.ZodOptional<z.ZodString>;
                agentName: z.ZodOptional<z.ZodString>;
                sessionId: z.ZodOptional<z.ZodString>;
                userId: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }, {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                namespace: string;
                key: string;
                value?: unknown;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        }, {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        }>;
        toolName: z.ZodLiteral<"set_document_flags">;
    }, "strict", z.ZodTypeAny, {
        toolName: "set_document_flags";
        payload: {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                namespace: string;
                key: string;
                value?: unknown;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        };
    }, {
        toolName: "set_document_flags";
        payload: {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        };
    }>]>;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    change: {
        toolName: "create_journal_entry";
        payload: {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        };
    } | {
        toolName: "update_journal_entry";
        payload: {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        };
    } | {
        toolName: "create_actor";
        payload: {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "update_actor";
        payload: {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "create_actor_item";
        payload: {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "update_actor_item";
        payload: {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "create_scene_note";
        payload: {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                namespace: string;
                key: string;
                value?: unknown;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        };
    } | {
        toolName: "set_document_flags";
        payload: {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                namespace: string;
                key: string;
                value?: unknown;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        };
    };
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}, {
    change: {
        toolName: "create_journal_entry";
        payload: {
            dryRun: boolean;
            title: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
            }[] | undefined;
        };
    } | {
        toolName: "update_journal_entry";
        payload: {
            dryRun: boolean;
            journalEntryId: string;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            pages?: {
                name: string;
                textContent: string;
                pageId?: string | undefined;
            }[] | undefined;
            title?: string | undefined;
        };
    } | {
        toolName: "create_actor";
        payload: {
            type: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "update_actor";
        payload: {
            actorId: string;
            dryRun: boolean;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            folderId?: string | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            prototypeToken?: {
                actorLink?: boolean | undefined;
                displayBars?: number | undefined;
                displayName?: number | undefined;
                disposition?: number | undefined;
                name?: string | undefined;
                vision?: boolean | undefined;
            } | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "create_actor_item";
        payload: {
            type: string;
            actorId: string;
            name: string;
            dryRun: boolean;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "update_actor_item";
        payload: {
            actorId: string;
            dryRun: boolean;
            itemId: string;
            name?: string | undefined;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            systemChanges?: {
                path: string;
                value?: unknown;
            }[] | undefined;
        };
    } | {
        toolName: "create_scene_note";
        payload: {
            sceneId: string;
            dryRun: boolean;
            entryId: string;
            x: number;
            y: number;
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
            flags?: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[] | undefined;
            icon?: string | undefined;
            label?: string | undefined;
            text?: string | undefined;
        };
    } | {
        toolName: "set_document_flags";
        payload: {
            dryRun: boolean;
            ref: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                actorId?: string | undefined;
                parentId?: string | undefined;
                sceneId?: string | undefined;
            };
            flags: {
                key: string;
                value?: unknown;
                namespace?: string | undefined;
            }[];
            approvalToken?: string | undefined;
            requestContext?: {
                agentId?: string | undefined;
                agentName?: string | undefined;
                sessionId?: string | undefined;
                userId?: string | undefined;
            } | undefined;
        };
    };
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}>;
declare const applyApprovedChangeInputSchema: z.ZodObject<{
    approvalToken: z.ZodString;
    requestContext: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }, {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    approvalToken: string;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}, {
    approvalToken: string;
    requestContext?: {
        agentId?: string | undefined;
        agentName?: string | undefined;
        sessionId?: string | undefined;
        userId?: string | undefined;
    } | undefined;
}>;
declare const auditMetadataSchema: z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
    agentName: z.ZodOptional<z.ZodString>;
    foundrySessionId: z.ZodOptional<z.ZodString>;
    foundryUserId: z.ZodOptional<z.ZodString>;
    requestId: z.ZodString;
    timestamp: z.ZodString;
}, "strict", z.ZodTypeAny, {
    requestId: string;
    timestamp: string;
    agentId?: string | undefined;
    agentName?: string | undefined;
    foundrySessionId?: string | undefined;
    foundryUserId?: string | undefined;
}, {
    requestId: string;
    timestamp: string;
    agentId?: string | undefined;
    agentName?: string | undefined;
    foundrySessionId?: string | undefined;
    foundryUserId?: string | undefined;
}>;
declare const diffEntrySchema: z.ZodObject<{
    after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    path: z.ZodString;
}, "strict", z.ZodTypeAny, {
    path: string;
    after?: unknown;
    before?: unknown;
}, {
    path: string;
    after?: unknown;
    before?: unknown;
}>;
declare const normalizedDocumentSummarySchema: z.ZodObject<{
    id: z.ZodString;
    img: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    sceneId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
}, "strict", z.ZodTypeAny, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    name: string;
    parentId?: string | undefined;
    sceneId?: string | undefined;
    img?: string | undefined;
}, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    name: string;
    parentId?: string | undefined;
    sceneId?: string | undefined;
    img?: string | undefined;
}>;
declare const normalizedDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    img: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    sceneId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
} & {
    flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    folderId: z.ZodOptional<z.ZodString>;
    pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        textContent: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        id?: string | undefined;
        textContent?: string | undefined;
    }, {
        name: string;
        id?: string | undefined;
        textContent?: string | undefined;
    }>, "many">>;
    system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
}, "strict", z.ZodTypeAny, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    name: string;
    parentId?: string | undefined;
    sceneId?: string | undefined;
    folderId?: string | undefined;
    flags?: Record<string, unknown> | undefined;
    pages?: {
        name: string;
        id?: string | undefined;
        textContent?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    system?: Record<string, unknown> | undefined;
}, {
    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
    id: string;
    name: string;
    parentId?: string | undefined;
    sceneId?: string | undefined;
    folderId?: string | undefined;
    flags?: Record<string, unknown> | undefined;
    pages?: {
        name: string;
        id?: string | undefined;
        textContent?: string | undefined;
    }[] | undefined;
    img?: string | undefined;
    system?: Record<string, unknown> | undefined;
}>;
declare const sceneSummarySchema: z.ZodObject<{
    active: z.ZodBoolean;
    height: z.ZodOptional<z.ZodNumber>;
    id: z.ZodString;
    name: z.ZodString;
    notes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        img?: string | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        img?: string | undefined;
    }>, "many">;
    noteCount: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    id: string;
    name: string;
    active: boolean;
    notes: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        img?: string | undefined;
    }[];
    noteCount: number;
    height?: number | undefined;
    width?: number | undefined;
}, {
    id: string;
    name: string;
    active: boolean;
    notes: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        img?: string | undefined;
    }[];
    noteCount: number;
    height?: number | undefined;
    width?: number | undefined;
}>;
declare const changeResultDataSchema: z.ZodObject<{
    after: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    } & {
        flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            textContent: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }>, "many">>;
        system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }>>;
    approvalRequired: z.ZodBoolean;
    approved: z.ZodBoolean;
    before: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    } & {
        flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            textContent: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }>, "many">>;
        system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }>>;
    diff: z.ZodArray<z.ZodObject<{
        after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        path: string;
        after?: unknown;
        before?: unknown;
    }, {
        path: string;
        after?: unknown;
        before?: unknown;
    }>, "many">;
    dryRun: z.ZodBoolean;
    warnings: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    approvalRequired: boolean;
    approved: boolean;
    dryRun: boolean;
    after: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    before: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
}, {
    approvalRequired: boolean;
    approved: boolean;
    dryRun: boolean;
    after: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    before: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
}>;
declare const previewChangeDataSchema: z.ZodObject<{
    approvalToken: z.ZodString;
    change: z.ZodObject<{
        after: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        approvalRequired: z.ZodBoolean;
        approved: z.ZodBoolean;
        before: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        diff: z.ZodArray<z.ZodObject<{
            after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            path: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            path: string;
            after?: unknown;
            before?: unknown;
        }, {
            path: string;
            after?: unknown;
            before?: unknown;
        }>, "many">;
        dryRun: z.ZodBoolean;
        warnings: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    }, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    }>;
    expiresAt: z.ZodString;
    toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
}, "strict", z.ZodTypeAny, {
    approvalToken: string;
    toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
    change: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    };
    expiresAt: string;
}, {
    approvalToken: string;
    toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
    change: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    };
    expiresAt: string;
}>;
declare const applyApprovedChangeDataSchema: z.ZodObject<{
    after: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    } & {
        flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            textContent: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }>, "many">>;
        system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }>>;
    approvalRequired: z.ZodBoolean;
    approved: z.ZodBoolean;
    before: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        parentId: z.ZodOptional<z.ZodString>;
        sceneId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
    } & {
        flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            textContent: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }, {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }>, "many">>;
        system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    }, "strict", z.ZodTypeAny, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }, {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    }>>;
    diff: z.ZodArray<z.ZodObject<{
        after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        path: string;
        after?: unknown;
        before?: unknown;
    }, {
        path: string;
        after?: unknown;
        before?: unknown;
    }>, "many">;
    dryRun: z.ZodBoolean;
    warnings: z.ZodArray<z.ZodString, "many">;
} & {
    approvalTokenUsed: z.ZodString;
    toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
}, "strict", z.ZodTypeAny, {
    approvalRequired: boolean;
    approved: boolean;
    dryRun: boolean;
    toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
    after: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    before: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
    approvalTokenUsed: string;
}, {
    approvalRequired: boolean;
    approved: boolean;
    dryRun: boolean;
    toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
    after: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    before: {
        type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
        id: string;
        name: string;
        parentId?: string | undefined;
        sceneId?: string | undefined;
        folderId?: string | undefined;
        flags?: Record<string, unknown> | undefined;
        pages?: {
            name: string;
            id?: string | undefined;
            textContent?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        system?: Record<string, unknown> | undefined;
    } | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
    approvalTokenUsed: string;
}>;
declare const errorSchema: z.ZodObject<{
    code: z.ZodString;
    details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
    message: z.ZodString;
}, "strict", z.ZodTypeAny, {
    code: string;
    message: string;
    details?: unknown;
}, {
    code: string;
    message: string;
    details?: unknown;
}>;
declare const bridgeJobSchema: z.ZodObject<{
    dryRun: z.ZodBoolean;
    jobId: z.ZodString;
    payload: z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>;
    requestId: z.ZodString;
    toolName: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    dryRun: boolean;
    toolName: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    payload: Record<string, unknown>;
    requestId: string;
    jobId: string;
}, {
    dryRun: boolean;
    toolName: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    payload: Record<string, unknown>;
    requestId: string;
    jobId: string;
}>;
declare const bridgeJobResultSchema: z.ZodObject<{
    after: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    before: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    diff: z.ZodArray<z.ZodObject<{
        after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        path: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        path: string;
        after?: unknown;
        before?: unknown;
    }, {
        path: string;
        after?: unknown;
        before?: unknown;
    }>, "many">;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    status: z.ZodEnum<["success", "error"]>;
    warnings: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    after: Record<string, unknown> | null;
    before: Record<string, unknown> | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
    error?: {
        code: string;
        message: string;
        details?: unknown;
    } | undefined;
}, {
    status: "error" | "success";
    after: Record<string, unknown> | null;
    before: Record<string, unknown> | null;
    diff: {
        path: string;
        after?: unknown;
        before?: unknown;
    }[];
    warnings: string[];
    error?: {
        code: string;
        message: string;
        details?: unknown;
    } | undefined;
}>;
declare function createEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T): z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: T;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: T;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: T;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
declare const findDocumentsOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        documents: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        documents: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    }, {
        documents: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        documents: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        documents: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const getDocumentOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        document: z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        document: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        };
    }, {
        document: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        };
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        document: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        };
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        document: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        };
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const listFoldersOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        folders: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        folders: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    }, {
        folders: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        folders: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        folders: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            img?: string | undefined;
        }[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const getSceneSummaryOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        scene: z.ZodObject<{
            active: z.ZodBoolean;
            height: z.ZodOptional<z.ZodNumber>;
            id: z.ZodString;
            name: z.ZodString;
            notes: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }>, "many">;
            noteCount: z.ZodNumber;
            width: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        }, {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        scene: {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        };
    }, {
        scene: {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        };
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        scene: {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        };
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        scene: {
            id: string;
            name: string;
            active: boolean;
            notes: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
            noteCount: number;
            height?: number | undefined;
            width?: number | undefined;
        };
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const writeToolOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        after: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        approvalRequired: z.ZodBoolean;
        approved: z.ZodBoolean;
        before: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        diff: z.ZodArray<z.ZodObject<{
            after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            path: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            path: string;
            after?: unknown;
            before?: unknown;
        }, {
            path: string;
            after?: unknown;
            before?: unknown;
        }>, "many">;
        dryRun: z.ZodBoolean;
        warnings: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    }, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const previewChangeOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        approvalToken: z.ZodString;
        change: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        expiresAt: z.ZodString;
        toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
    }, "strict", z.ZodTypeAny, {
        approvalToken: string;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        change: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        expiresAt: string;
    }, {
        approvalToken: string;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        change: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        expiresAt: string;
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalToken: string;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        change: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        expiresAt: string;
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalToken: string;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        change: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        expiresAt: string;
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const applyApprovedChangeOutputSchema: z.ZodObject<{
    audit: z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
        agentName: z.ZodOptional<z.ZodString>;
        foundrySessionId: z.ZodOptional<z.ZodString>;
        foundryUserId: z.ZodOptional<z.ZodString>;
        requestId: z.ZodString;
        timestamp: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }, {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    }>;
    data: z.ZodObject<{
        after: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        approvalRequired: z.ZodBoolean;
        approved: z.ZodBoolean;
        before: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            img: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
        } & {
            flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            folderId: z.ZodOptional<z.ZodString>;
            pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                textContent: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }, {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }>, "many">>;
            system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        }>>;
        diff: z.ZodArray<z.ZodObject<{
            after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
            path: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            path: string;
            after?: unknown;
            before?: unknown;
        }, {
            path: string;
            after?: unknown;
            before?: unknown;
        }>, "many">;
        dryRun: z.ZodBoolean;
        warnings: z.ZodArray<z.ZodString, "many">;
    } & {
        approvalTokenUsed: z.ZodString;
        toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
    }, "strict", z.ZodTypeAny, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
        approvalTokenUsed: string;
    }, {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
        approvalTokenUsed: string;
    }>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
        message: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: unknown;
    }, {
        code: string;
        message: string;
        details?: unknown;
    }>>;
    ok: z.ZodBoolean;
    requestId: z.ZodString;
    status: z.ZodEnum<["success", "error"]>;
    timestamp: z.ZodString;
    tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
}, "strict", z.ZodTypeAny, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
        approvalTokenUsed: string;
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}, {
    status: "error" | "success";
    requestId: string;
    timestamp: string;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    audit: {
        requestId: string;
        timestamp: string;
        agentId?: string | undefined;
        agentName?: string | undefined;
        foundrySessionId?: string | undefined;
        foundryUserId?: string | undefined;
    };
    data: {
        approvalRequired: boolean;
        approved: boolean;
        dryRun: boolean;
        toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
        after: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        before: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            name: string;
            parentId?: string | undefined;
            sceneId?: string | undefined;
            folderId?: string | undefined;
            flags?: Record<string, unknown> | undefined;
            pages?: {
                name: string;
                id?: string | undefined;
                textContent?: string | undefined;
            }[] | undefined;
            img?: string | undefined;
            system?: Record<string, unknown> | undefined;
        } | null;
        diff: {
            path: string;
            after?: unknown;
            before?: unknown;
        }[];
        warnings: string[];
        approvalTokenUsed: string;
    };
    ok: boolean;
    tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
}>;
declare const toolInputSchemas: {
    readonly apply_approved_change: z.ZodObject<{
        approvalToken: z.ZodString;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        approvalToken: string;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }, {
        approvalToken: string;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }>;
    readonly create_actor: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        prototypeToken: z.ZodOptional<z.ZodObject<{
            actorLink: z.ZodOptional<z.ZodBoolean>;
            displayBars: z.ZodOptional<z.ZodNumber>;
            displayName: z.ZodOptional<z.ZodNumber>;
            disposition: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            vision: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }>>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
        type: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        type: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    readonly create_actor_item: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
        type: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        type: string;
        actorId: string;
        name: string;
        dryRun: boolean;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    readonly create_journal_entry: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            textContent: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            textContent: string;
        }, {
            name: string;
            textContent: string;
        }>, "many">>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        title: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    }, {
        dryRun: boolean;
        title: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
        }[] | undefined;
    }>;
    readonly create_scene_note: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        entryId: z.ZodString;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        icon: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        sceneId: z.ZodString;
        text: z.ZodOptional<z.ZodString>;
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    }, {
        sceneId: string;
        dryRun: boolean;
        entryId: string;
        x: number;
        y: number;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        icon?: string | undefined;
        label?: string | undefined;
        text?: string | undefined;
    }>;
    readonly find_documents: z.ZodObject<{
        documentTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        includeContent: z.ZodDefault<z.ZodBoolean>;
        limit: z.ZodDefault<z.ZodNumber>;
        query: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        includeContent: boolean;
        limit: number;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        documentTypes?: ("JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene")[] | undefined;
        folderId?: string | undefined;
        query?: string | undefined;
    }, {
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        documentTypes?: ("JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene")[] | undefined;
        folderId?: string | undefined;
        includeContent?: boolean | undefined;
        limit?: number | undefined;
        query?: string | undefined;
    }>;
    readonly get_document: z.ZodObject<{
        includeContent: z.ZodDefault<z.ZodBoolean>;
        ref: z.ZodObject<{
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            id: z.ZodString;
            actorId: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        includeContent: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }, {
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        includeContent?: boolean | undefined;
    }>;
    readonly get_scene_summary: z.ZodObject<{
        includeNotes: z.ZodDefault<z.ZodBoolean>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        sceneId: z.ZodOptional<z.ZodString>;
        sceneName: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        includeNotes: boolean;
        sceneId?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        sceneName?: string | undefined;
    }, {
        sceneId?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        includeNotes?: boolean | undefined;
        sceneName?: string | undefined;
    }>;
    readonly list_folders: z.ZodObject<{
        documentType: z.ZodOptional<z.ZodEnum<["JournalEntry", "Actor", "Item", "RollTable", "Playlist"]>>;
        parentId: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        parentId?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        documentType?: "JournalEntry" | "Actor" | "Item" | "RollTable" | "Playlist" | undefined;
    }, {
        parentId?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        documentType?: "JournalEntry" | "Actor" | "Item" | "RollTable" | "Playlist" | undefined;
    }>;
    readonly preview_change: z.ZodObject<{
        change: z.ZodDiscriminatedUnion<"toolName", [z.ZodObject<{
            payload: z.ZodObject<{
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    textContent: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    textContent: string;
                }, {
                    name: string;
                    textContent: string;
                }>, "many">>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                title: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            }, {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            }>;
            toolName: z.ZodLiteral<"create_journal_entry">;
        }, "strict", z.ZodTypeAny, {
            toolName: "create_journal_entry";
            payload: {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            };
        }, {
            toolName: "create_journal_entry";
            payload: {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                folderId: z.ZodOptional<z.ZodString>;
                journalEntryId: z.ZodString;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    pageId: z.ZodOptional<z.ZodString>;
                    textContent: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }, {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }>, "many">>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                title: z.ZodOptional<z.ZodString>;
            }, "strict", z.ZodTypeAny, {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            }, {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            }>;
            toolName: z.ZodLiteral<"update_journal_entry">;
        }, "strict", z.ZodTypeAny, {
            toolName: "update_journal_entry";
            payload: {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            };
        }, {
            toolName: "update_journal_entry";
            payload: {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                folderId: z.ZodOptional<z.ZodString>;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                prototypeToken: z.ZodOptional<z.ZodObject<{
                    actorLink: z.ZodOptional<z.ZodBoolean>;
                    displayBars: z.ZodOptional<z.ZodNumber>;
                    displayName: z.ZodOptional<z.ZodNumber>;
                    disposition: z.ZodOptional<z.ZodNumber>;
                    name: z.ZodOptional<z.ZodString>;
                    vision: z.ZodOptional<z.ZodBoolean>;
                }, "strict", z.ZodTypeAny, {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                }, {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                }>>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    path: string;
                    value?: unknown;
                }, {
                    path: string;
                    value?: unknown;
                }>, "many">>;
                type: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }, {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }>;
            toolName: z.ZodLiteral<"create_actor">;
        }, "strict", z.ZodTypeAny, {
            toolName: "create_actor";
            payload: {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }, {
            toolName: "create_actor";
            payload: {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                actorId: z.ZodString;
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                folderId: z.ZodOptional<z.ZodString>;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                prototypeToken: z.ZodOptional<z.ZodObject<{
                    actorLink: z.ZodOptional<z.ZodBoolean>;
                    displayBars: z.ZodOptional<z.ZodNumber>;
                    displayName: z.ZodOptional<z.ZodNumber>;
                    disposition: z.ZodOptional<z.ZodNumber>;
                    name: z.ZodOptional<z.ZodString>;
                    vision: z.ZodOptional<z.ZodBoolean>;
                }, "strict", z.ZodTypeAny, {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                }, {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                }>>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    path: string;
                    value?: unknown;
                }, {
                    path: string;
                    value?: unknown;
                }>, "many">>;
            }, "strict", z.ZodTypeAny, {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }, {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }>;
            toolName: z.ZodLiteral<"update_actor">;
        }, "strict", z.ZodTypeAny, {
            toolName: "update_actor";
            payload: {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }, {
            toolName: "update_actor";
            payload: {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                actorId: z.ZodString;
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    path: string;
                    value?: unknown;
                }, {
                    path: string;
                    value?: unknown;
                }>, "many">>;
                type: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }, {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }>;
            toolName: z.ZodLiteral<"create_actor_item">;
        }, "strict", z.ZodTypeAny, {
            toolName: "create_actor_item";
            payload: {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }, {
            toolName: "create_actor_item";
            payload: {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                actorId: z.ZodString;
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                img: z.ZodOptional<z.ZodString>;
                itemId: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    path: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    path: string;
                    value?: unknown;
                }, {
                    path: string;
                    value?: unknown;
                }>, "many">>;
            }, "strict", z.ZodTypeAny, {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }, {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            }>;
            toolName: z.ZodLiteral<"update_actor_item">;
        }, "strict", z.ZodTypeAny, {
            toolName: "update_actor_item";
            payload: {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }, {
            toolName: "update_actor_item";
            payload: {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                entryId: z.ZodString;
                flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">>;
                icon: z.ZodOptional<z.ZodString>;
                label: z.ZodOptional<z.ZodString>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
                sceneId: z.ZodString;
                text: z.ZodOptional<z.ZodString>;
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            }, {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            }>;
            toolName: z.ZodLiteral<"create_scene_note">;
        }, "strict", z.ZodTypeAny, {
            toolName: "create_scene_note";
            payload: {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            };
        }, {
            toolName: "create_scene_note";
            payload: {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            };
        }>, z.ZodObject<{
            payload: z.ZodObject<{
                approvalToken: z.ZodOptional<z.ZodString>;
                dryRun: z.ZodBoolean;
                flags: z.ZodArray<z.ZodObject<{
                    namespace: z.ZodDefault<z.ZodString>;
                    key: z.ZodString;
                    value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                }, "strict", z.ZodTypeAny, {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }, {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }>, "many">;
                ref: z.ZodObject<{
                    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
                    id: z.ZodString;
                    actorId: z.ZodOptional<z.ZodString>;
                    parentId: z.ZodOptional<z.ZodString>;
                    sceneId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                }, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                }>;
                requestContext: z.ZodOptional<z.ZodObject<{
                    agentId: z.ZodOptional<z.ZodString>;
                    agentName: z.ZodOptional<z.ZodString>;
                    sessionId: z.ZodOptional<z.ZodString>;
                    userId: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }, {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                }>>;
            }, "strict", z.ZodTypeAny, {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            }, {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            }>;
            toolName: z.ZodLiteral<"set_document_flags">;
        }, "strict", z.ZodTypeAny, {
            toolName: "set_document_flags";
            payload: {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            };
        }, {
            toolName: "set_document_flags";
            payload: {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            };
        }>]>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        change: {
            toolName: "create_journal_entry";
            payload: {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            };
        } | {
            toolName: "update_journal_entry";
            payload: {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            };
        } | {
            toolName: "create_actor";
            payload: {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "update_actor";
            payload: {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "create_actor_item";
            payload: {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "update_actor_item";
            payload: {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "create_scene_note";
            payload: {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            };
        } | {
            toolName: "set_document_flags";
            payload: {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    namespace: string;
                    key: string;
                    value?: unknown;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            };
        };
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }, {
        change: {
            toolName: "create_journal_entry";
            payload: {
                dryRun: boolean;
                title: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                }[] | undefined;
            };
        } | {
            toolName: "update_journal_entry";
            payload: {
                dryRun: boolean;
                journalEntryId: string;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                pages?: {
                    name: string;
                    textContent: string;
                    pageId?: string | undefined;
                }[] | undefined;
                title?: string | undefined;
            };
        } | {
            toolName: "create_actor";
            payload: {
                type: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "update_actor";
            payload: {
                actorId: string;
                dryRun: boolean;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                folderId?: string | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                prototypeToken?: {
                    actorLink?: boolean | undefined;
                    displayBars?: number | undefined;
                    displayName?: number | undefined;
                    disposition?: number | undefined;
                    name?: string | undefined;
                    vision?: boolean | undefined;
                } | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "create_actor_item";
            payload: {
                type: string;
                actorId: string;
                name: string;
                dryRun: boolean;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "update_actor_item";
            payload: {
                actorId: string;
                dryRun: boolean;
                itemId: string;
                name?: string | undefined;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                systemChanges?: {
                    path: string;
                    value?: unknown;
                }[] | undefined;
            };
        } | {
            toolName: "create_scene_note";
            payload: {
                sceneId: string;
                dryRun: boolean;
                entryId: string;
                x: number;
                y: number;
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
                flags?: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[] | undefined;
                icon?: string | undefined;
                label?: string | undefined;
                text?: string | undefined;
            };
        } | {
            toolName: "set_document_flags";
            payload: {
                dryRun: boolean;
                ref: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    actorId?: string | undefined;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                };
                flags: {
                    key: string;
                    value?: unknown;
                    namespace?: string | undefined;
                }[];
                approvalToken?: string | undefined;
                requestContext?: {
                    agentId?: string | undefined;
                    agentName?: string | undefined;
                    sessionId?: string | undefined;
                    userId?: string | undefined;
                } | undefined;
            };
        };
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }>;
    readonly set_document_flags: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">;
        ref: z.ZodObject<{
            type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            id: z.ZodString;
            actorId: z.ZodOptional<z.ZodString>;
            parentId: z.ZodOptional<z.ZodString>;
            sceneId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }, {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        }>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            namespace: string;
            key: string;
            value?: unknown;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }, {
        dryRun: boolean;
        ref: {
            type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
            id: string;
            actorId?: string | undefined;
            parentId?: string | undefined;
            sceneId?: string | undefined;
        };
        flags: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[];
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
    }>;
    readonly update_actor: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        img: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        prototypeToken: z.ZodOptional<z.ZodObject<{
            actorLink: z.ZodOptional<z.ZodBoolean>;
            displayBars: z.ZodOptional<z.ZodNumber>;
            displayName: z.ZodOptional<z.ZodNumber>;
            disposition: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            vision: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }, {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        }>>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        actorId: string;
        dryRun: boolean;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        prototypeToken?: {
            actorLink?: boolean | undefined;
            displayBars?: number | undefined;
            displayName?: number | undefined;
            disposition?: number | undefined;
            name?: string | undefined;
            vision?: boolean | undefined;
        } | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    readonly update_actor_item: z.ZodObject<{
        actorId: z.ZodString;
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        img: z.ZodOptional<z.ZodString>;
        itemId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        systemChanges: z.ZodOptional<z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            path: string;
            value?: unknown;
        }, {
            path: string;
            value?: unknown;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }, {
        actorId: string;
        dryRun: boolean;
        itemId: string;
        name?: string | undefined;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        img?: string | undefined;
        systemChanges?: {
            path: string;
            value?: unknown;
        }[] | undefined;
    }>;
    readonly update_journal_entry: z.ZodObject<{
        approvalToken: z.ZodOptional<z.ZodString>;
        dryRun: z.ZodBoolean;
        flags: z.ZodOptional<z.ZodArray<z.ZodObject<{
            namespace: z.ZodDefault<z.ZodString>;
            key: z.ZodString;
            value: z.ZodType<unknown, z.ZodTypeDef, unknown>;
        }, "strict", z.ZodTypeAny, {
            namespace: string;
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }>, "many">>;
        folderId: z.ZodOptional<z.ZodString>;
        journalEntryId: z.ZodString;
        pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            pageId: z.ZodOptional<z.ZodString>;
            textContent: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }, {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }>, "many">>;
        requestContext: z.ZodOptional<z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            sessionId: z.ZodOptional<z.ZodString>;
            userId: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }, {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        }>>;
        title: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            namespace: string;
            key: string;
            value?: unknown;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    }, {
        dryRun: boolean;
        journalEntryId: string;
        approvalToken?: string | undefined;
        requestContext?: {
            agentId?: string | undefined;
            agentName?: string | undefined;
            sessionId?: string | undefined;
            userId?: string | undefined;
        } | undefined;
        folderId?: string | undefined;
        flags?: {
            key: string;
            value?: unknown;
            namespace?: string | undefined;
        }[] | undefined;
        pages?: {
            name: string;
            textContent: string;
            pageId?: string | undefined;
        }[] | undefined;
        title?: string | undefined;
    }>;
};
declare const toolOutputSchemas: {
    readonly apply_approved_change: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        } & {
            approvalTokenUsed: z.ZodString;
            toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
            approvalTokenUsed: string;
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
            approvalTokenUsed: string;
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
            approvalTokenUsed: string;
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
            approvalTokenUsed: string;
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly create_actor: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly create_actor_item: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly create_journal_entry: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly create_scene_note: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly find_documents: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            documents: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            documents: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        }, {
            documents: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            documents: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            documents: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly get_document: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            document: z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>;
        }, "strict", z.ZodTypeAny, {
            document: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            };
        }, {
            document: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            };
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            document: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            };
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            document: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            };
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly get_scene_summary: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            scene: z.ZodObject<{
                active: z.ZodBoolean;
                height: z.ZodOptional<z.ZodNumber>;
                id: z.ZodString;
                name: z.ZodString;
                notes: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    img: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    parentId: z.ZodOptional<z.ZodString>;
                    sceneId: z.ZodOptional<z.ZodString>;
                    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
                }, "strict", z.ZodTypeAny, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }>, "many">;
                noteCount: z.ZodNumber;
                width: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            }, {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            }>;
        }, "strict", z.ZodTypeAny, {
            scene: {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            };
        }, {
            scene: {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            };
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            scene: {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            };
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            scene: {
                id: string;
                name: string;
                active: boolean;
                notes: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    img?: string | undefined;
                }[];
                noteCount: number;
                height?: number | undefined;
                width?: number | undefined;
            };
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly list_folders: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            folders: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            folders: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        }, {
            folders: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            folders: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            folders: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                img?: string | undefined;
            }[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly preview_change: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            approvalToken: z.ZodString;
            change: z.ZodObject<{
                after: z.ZodNullable<z.ZodObject<{
                    id: z.ZodString;
                    img: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    parentId: z.ZodOptional<z.ZodString>;
                    sceneId: z.ZodOptional<z.ZodString>;
                    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
                } & {
                    flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                    folderId: z.ZodOptional<z.ZodString>;
                    pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        name: z.ZodString;
                        textContent: z.ZodOptional<z.ZodString>;
                    }, "strict", z.ZodTypeAny, {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }, {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }>, "many">>;
                    system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                }, "strict", z.ZodTypeAny, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                }, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                }>>;
                approvalRequired: z.ZodBoolean;
                approved: z.ZodBoolean;
                before: z.ZodNullable<z.ZodObject<{
                    id: z.ZodString;
                    img: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    parentId: z.ZodOptional<z.ZodString>;
                    sceneId: z.ZodOptional<z.ZodString>;
                    type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
                } & {
                    flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                    folderId: z.ZodOptional<z.ZodString>;
                    pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        name: z.ZodString;
                        textContent: z.ZodOptional<z.ZodString>;
                    }, "strict", z.ZodTypeAny, {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }, {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }>, "many">>;
                    system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                }, "strict", z.ZodTypeAny, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                }, {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                }>>;
                diff: z.ZodArray<z.ZodObject<{
                    after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                    before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                    path: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }, {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }>, "many">;
                dryRun: z.ZodBoolean;
                warnings: z.ZodArray<z.ZodString, "many">;
            }, "strict", z.ZodTypeAny, {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            }, {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            }>;
            expiresAt: z.ZodString;
            toolName: z.ZodEnum<["create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags"]>;
        }, "strict", z.ZodTypeAny, {
            approvalToken: string;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            change: {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            };
            expiresAt: string;
        }, {
            approvalToken: string;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            change: {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            };
            expiresAt: string;
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalToken: string;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            change: {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            };
            expiresAt: string;
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalToken: string;
            toolName: "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags";
            change: {
                approvalRequired: boolean;
                approved: boolean;
                dryRun: boolean;
                after: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                before: {
                    type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                    id: string;
                    name: string;
                    parentId?: string | undefined;
                    sceneId?: string | undefined;
                    folderId?: string | undefined;
                    flags?: Record<string, unknown> | undefined;
                    pages?: {
                        name: string;
                        id?: string | undefined;
                        textContent?: string | undefined;
                    }[] | undefined;
                    img?: string | undefined;
                    system?: Record<string, unknown> | undefined;
                } | null;
                diff: {
                    path: string;
                    after?: unknown;
                    before?: unknown;
                }[];
                warnings: string[];
            };
            expiresAt: string;
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly set_document_flags: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly update_actor: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly update_actor_item: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
    readonly update_journal_entry: z.ZodObject<{
        audit: z.ZodObject<{
            agentId: z.ZodOptional<z.ZodString>;
            agentName: z.ZodOptional<z.ZodString>;
            foundrySessionId: z.ZodOptional<z.ZodString>;
            foundryUserId: z.ZodOptional<z.ZodString>;
            requestId: z.ZodString;
            timestamp: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }, {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        }>;
        data: z.ZodObject<{
            after: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            approvalRequired: z.ZodBoolean;
            approved: z.ZodBoolean;
            before: z.ZodNullable<z.ZodObject<{
                id: z.ZodString;
                img: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                parentId: z.ZodOptional<z.ZodString>;
                sceneId: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["JournalEntry", "Actor", "Item", "Note", "Folder", "RollTable", "Playlist", "Scene"]>;
            } & {
                flags: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
                folderId: z.ZodOptional<z.ZodString>;
                pages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodString;
                    textContent: z.ZodOptional<z.ZodString>;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }, {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }>, "many">>;
                system: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
            }, "strict", z.ZodTypeAny, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }, {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            }>>;
            diff: z.ZodArray<z.ZodObject<{
                after: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                before: z.ZodType<unknown, z.ZodTypeDef, unknown>;
                path: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                path: string;
                after?: unknown;
                before?: unknown;
            }, {
                path: string;
                after?: unknown;
                before?: unknown;
            }>, "many">;
            dryRun: z.ZodBoolean;
            warnings: z.ZodArray<z.ZodString, "many">;
        }, "strict", z.ZodTypeAny, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }, {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        }>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            details: z.ZodOptional<z.ZodType<unknown, z.ZodTypeDef, unknown>>;
            message: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: unknown;
        }, {
            code: string;
            message: string;
            details?: unknown;
        }>>;
        ok: z.ZodBoolean;
        requestId: z.ZodString;
        status: z.ZodEnum<["success", "error"]>;
        timestamp: z.ZodString;
        tool: z.ZodEnum<["find_documents", "get_document", "list_folders", "get_scene_summary", "create_journal_entry", "update_journal_entry", "create_actor", "update_actor", "create_actor_item", "update_actor_item", "create_scene_note", "set_document_flags", "preview_change", "apply_approved_change"]>;
    }, "strict", z.ZodTypeAny, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }, {
        status: "error" | "success";
        requestId: string;
        timestamp: string;
        error: {
            code: string;
            message: string;
            details?: unknown;
        } | null;
        audit: {
            requestId: string;
            timestamp: string;
            agentId?: string | undefined;
            agentName?: string | undefined;
            foundrySessionId?: string | undefined;
            foundryUserId?: string | undefined;
        };
        data: {
            approvalRequired: boolean;
            approved: boolean;
            dryRun: boolean;
            after: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            before: {
                type: "JournalEntry" | "Actor" | "Item" | "Note" | "Folder" | "RollTable" | "Playlist" | "Scene";
                id: string;
                name: string;
                parentId?: string | undefined;
                sceneId?: string | undefined;
                folderId?: string | undefined;
                flags?: Record<string, unknown> | undefined;
                pages?: {
                    name: string;
                    id?: string | undefined;
                    textContent?: string | undefined;
                }[] | undefined;
                img?: string | undefined;
                system?: Record<string, unknown> | undefined;
            } | null;
            diff: {
                path: string;
                after?: unknown;
                before?: unknown;
            }[];
            warnings: string[];
        };
        ok: boolean;
        tool: "find_documents" | "get_document" | "list_folders" | "get_scene_summary" | "create_journal_entry" | "update_journal_entry" | "create_actor" | "update_actor" | "create_actor_item" | "update_actor_item" | "create_scene_note" | "set_document_flags" | "preview_change" | "apply_approved_change";
    }>;
};
type ToolName = z.infer<typeof toolNameSchema>;
type WriteToolName = z.infer<typeof writeToolNameSchema>;
type DocumentRef = z.infer<typeof documentRefSchema>;
type RequestContext = z.infer<typeof requestContextSchema>;
type ChangeResultData = z.infer<typeof changeResultDataSchema>;
type BridgeJob = z.infer<typeof bridgeJobSchema>;
type BridgeJobResult = z.infer<typeof bridgeJobResultSchema>;

export { BridgeError, type BridgeJob, type BridgeJobResult, CONTROL_TOOL_NAMES, type ChangeResultData, DEFAULT_APPROVAL_TTL_SECONDS, DEFAULT_REQUEST_TIMEOUT_MS, DOCUMENT_TYPES, type DiffEntry, type DocumentRef, ERROR_CODES, type ErrorCode, FOLDER_TYPES, type FlagChange, MODULE_FLAG_NAMESPACE, MODULE_ID, READ_TOOL_NAMES, type RequestContext, type SystemChange, TOOL_EXAMPLES, TOOL_GROUPS, TOOL_NAMES, type ToolName, WRITE_TOOL_NAMES, type WriteToolName, applyApprovedChangeDataSchema, applyApprovedChangeInputSchema, applyApprovedChangeOutputSchema, assertAllowedFields, assertAllowedNamespaces, assertAllowedSystemPaths, auditMetadataSchema, bridgeJobResultSchema, bridgeJobSchema, changeResultDataSchema, controlToolNameSchema, createActorInputSchema, createActorItemInputSchema, createEnvelopeSchema, createJournalEntryInputSchema, createSceneNoteInputSchema, diffEntrySchema, diffValues, documentRefSchema, documentTypeSchema, errorSchema, findDocumentsInputSchema, findDocumentsOutputSchema, flagChangeSchema, flagChangesToObject, folderTypeSchema, getDocumentInputSchema, getDocumentOutputSchema, getSceneSummaryInputSchema, getSceneSummaryOutputSchema, journalPageInputSchema, journalPageUpdateInputSchema, listFoldersInputSchema, listFoldersOutputSchema, normalizedDocumentSchema, normalizedDocumentSummarySchema, pathChangesToObject, previewChangeDataSchema, previewChangeInputSchema, previewChangeOutputSchema, previewableChangeSchema, prototypeTokenSubsetSchema, readToolNameSchema, requestContextSchema, sceneSummarySchema, setDocumentFlagsInputSchema, systemChangeSchema, toolInputSchemas, toolNameSchema, toolOutputSchemas, updateActorInputSchema, updateActorItemInputSchema, updateJournalEntryInputSchema, writeControlSchema, writeToolNameSchema, writeToolOutputSchema };
