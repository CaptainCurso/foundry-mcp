import {
  BridgeError,
  ERROR_CODES,
  assertAllowedNamespaces,
  assertAllowedSystemPaths,
  diffValues,
  flagChangesToObject,
  pathChangesToObject,
  toolInputSchemas,
  type ToolName,
} from "@foundry-mcp/shared";

import { getDocumentByRef } from "./document-access.js";
import { normalizeActor, normalizeFolder, normalizeItem, normalizeJournalEntry, normalizeNote, normalizeSceneSummary, normalizeSimpleDocument } from "./normalize.js";

interface RuntimeOptions {
  allowedFlagNamespaces: string[];
  allowedOperations: string[];
  allowedSystemPaths: string[];
}

interface OperationResult {
  after: Record<string, unknown> | null;
  before: Record<string, unknown> | null;
  diff: Array<{ after: unknown; before: unknown; path: string }>;
  error?: {
    code: string;
    details?: unknown;
    message: string;
  };
  status: "error" | "success";
  warnings: string[];
}

function clone(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

function requireAllowedOperation(toolName: ToolName, options: RuntimeOptions) {
  if (!options.allowedOperations.includes(toolName)) {
    throw new BridgeError(ERROR_CODES.forbiddenOperation, `Operation ${toolName} is not allowlisted in world settings.`, 403);
  }
}

async function handleFindDocuments(input: any): Promise<OperationResult> {
  const documentTypes = input.documentTypes ?? ["JournalEntry", "Actor", "Folder", "RollTable", "Playlist", "Scene"];
  const query = String(input.query ?? "").toLowerCase();
  const limit = Number(input.limit ?? 25);
  const matches: Record<string, unknown>[] = [];

  const addMatches = (documents: any[], type: string) => {
    for (const document of documents) {
      const name = String(document.name ?? document.label ?? "");
      const folderId = document.folder ? String(document.folder.id) : undefined;
      if (input.folderId && folderId !== input.folderId) {
        continue;
      }
      if (query && !name.toLowerCase().includes(query)) {
        continue;
      }

      if (type === "Folder") {
        matches.push(normalizeFolder(document));
      } else if (type === "Note") {
        matches.push(normalizeNote(document, String(document.parent?.id ?? "")));
      } else {
        matches.push(normalizeSimpleDocument(document, type as any));
      }

      if (matches.length >= limit) {
        return;
      }
    }
  };

  for (const type of documentTypes) {
    if (matches.length >= limit) {
      break;
    }

    switch (type) {
      case "JournalEntry":
        addMatches([...game.journal], type);
        break;
      case "Actor":
        addMatches([...game.actors], type);
        break;
      case "Item":
        addMatches([...game.items], type);
        break;
      case "Folder":
        addMatches([...game.folders], type);
        break;
      case "RollTable":
        addMatches([...game.tables], type);
        break;
      case "Playlist":
        addMatches([...game.playlists], type);
        break;
      case "Scene":
        addMatches([...game.scenes], type);
        break;
      case "Note":
        for (const scene of game.scenes) {
          addMatches([...(scene.notes ?? [])], type);
          if (matches.length >= limit) {
            break;
          }
        }
        break;
      default:
        break;
    }
  }

  return {
    after: { documents: matches.slice(0, limit) },
    before: null,
    diff: [],
    status: "success",
    warnings: [],
  };
}

async function handleGetDocument(input: any): Promise<OperationResult> {
  const document = await getDocumentByRef(input.ref);
  let normalized;

  switch (input.ref.type) {
    case "JournalEntry":
      normalized = normalizeJournalEntry(document);
      break;
    case "Actor":
      normalized = normalizeActor(document);
      break;
    case "Item":
      normalized = normalizeItem(document);
      break;
    case "Folder":
      normalized = normalizeFolder(document);
      break;
    case "Playlist":
    case "RollTable":
    case "Scene":
      normalized = normalizeSimpleDocument(document, input.ref.type);
      break;
    case "Note":
      normalized = normalizeNote(document, input.ref.sceneId);
      break;
    default:
      normalized = normalizeSimpleDocument(document, input.ref.type);
      break;
  }

  return {
    after: { document: normalized },
    before: null,
    diff: [],
    status: "success",
    warnings: [],
  };
}

async function handleListFolders(input: any): Promise<OperationResult> {
  const folders = [...game.folders].filter((folder: any) => {
    const typeMatch = input.documentType ? folder.type === input.documentType : true;
    const parentMatch = input.parentId ? String(folder.folder?.id ?? "") === input.parentId : true;
    return typeMatch && parentMatch;
  });

  return {
    after: { folders: folders.map((folder: any) => normalizeFolder(folder)) },
    before: null,
    diff: [],
    status: "success",
    warnings: [],
  };
}

async function handleGetSceneSummary(input: any): Promise<OperationResult> {
  if (!input.sceneId && !input.sceneName) {
    throw new BridgeError(ERROR_CODES.invalidPayload, "Provide sceneId or sceneName.", 400);
  }

  const scene = input.sceneId
    ? game.scenes.get(input.sceneId)
    : [...game.scenes].find((entry: any) => String(entry.name ?? "") === input.sceneName);

  if (!scene) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "Scene not found.", 404);
  }

  return {
    after: { scene: normalizeSceneSummary(scene, Boolean(input.includeNotes)) },
    before: null,
    diff: [],
    status: "success",
    warnings: [],
  };
}

function buildJournalEntryCreateData(input: any, options: RuntimeOptions) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  return {
    flags: flagChangesToObject(input.flags),
    folder: input.folderId,
    name: input.title,
    pages: (input.pages ?? []).map((page: any) => ({
      name: page.name,
      text: { content: page.textContent, format: 1 },
      type: "text",
    })),
  };
}

async function handleCreateJournalEntry(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("create_journal_entry", options);
  const createData = buildJournalEntryCreateData(input, options);
  const before = null;

  if (input.dryRun) {
    const after = normalizeJournalEntry({ ...createData, id: "preview", title: input.title });
    return {
      after,
      before,
      diff: diffValues(before, after),
      status: "success",
      warnings: [],
    };
  }

  const [created] = await JournalEntry.createDocuments([createData]);
  const after = normalizeJournalEntry(created);
  return {
    after,
    before,
    diff: diffValues(before, after),
    status: "success",
    warnings: [],
  };
}

async function handleUpdateJournalEntry(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("update_journal_entry", options);
  const journalEntry = game.journal.get(input.journalEntryId);
  if (!journalEntry) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "JournalEntry not found.", 404);
  }

  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const before = normalizeJournalEntry(journalEntry);
  const updateData: Record<string, unknown> = {};
  if (input.title) updateData.name = input.title;
  if (input.folderId) updateData.folder = input.folderId;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);

  const pageWarnings: string[] = [];
  if (input.pages?.length) {
    pageWarnings.push("Journal page updates are append-or-target-only in v1. Existing pages are left in place.");
  }

  if (input.dryRun) {
    const preview = {
      ...clone(journalEntry.toObject()),
      ...updateData,
    };
    if (input.pages?.length) {
      preview.pages = [...(preview.pages ?? [])];
      for (const page of input.pages) {
        const existingIndex = page.pageId
          ? preview.pages.findIndex((entry: any) => String(entry._id ?? entry.id) === page.pageId)
          : -1;

        const previewPage = {
          _id: page.pageId,
          name: page.name,
          text: { content: page.textContent, format: 1 },
          type: "text",
        };

        if (existingIndex >= 0) {
          preview.pages[existingIndex] = {
            ...preview.pages[existingIndex],
            ...previewPage,
          };
        } else {
          preview.pages.push(previewPage);
        }
      }
    }
    const after = normalizeJournalEntry(preview);
    return {
      after,
      before,
      diff: diffValues(before, after),
      status: "success",
      warnings: pageWarnings,
    };
  }

  await journalEntry.update(updateData);
  if (input.pages?.length) {
    const pagesToCreate = input.pages
      .filter((page: any) => !page.pageId)
      .map((page: any) => ({
        name: page.name,
        text: { content: page.textContent, format: 1 },
        type: "text",
      }));
    const pagesToUpdate = input.pages
      .filter((page: any) => page.pageId)
      .map((page: any) => ({
        _id: page.pageId,
        name: page.name,
        text: { content: page.textContent, format: 1 },
      }));

    if (pagesToCreate.length) {
      await journalEntry.createEmbeddedDocuments("JournalEntryPage", pagesToCreate);
    }
    if (pagesToUpdate.length) {
      await journalEntry.updateEmbeddedDocuments("JournalEntryPage", pagesToUpdate);
    }
  }

  const after = normalizeJournalEntry(journalEntry);
  return {
    after,
    before,
    diff: diffValues(before, after),
    status: "success",
    warnings: pageWarnings,
  };
}

function actorCreateData(input: any, options: RuntimeOptions) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  return {
    flags: flagChangesToObject(input.flags),
    folder: input.folderId,
    img: input.img,
    name: input.name,
    prototypeToken: input.prototypeToken,
    system: pathChangesToObject(input.systemChanges),
    type: input.type,
  };
}

async function handleCreateActor(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("create_actor", options);
  const data = actorCreateData(input, options);
  const before = null;

  if (input.dryRun) {
    const after = normalizeActor({ ...data, id: "preview" });
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  const [actor] = await Actor.createDocuments([data]);
  const after = normalizeActor(actor);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

async function handleUpdateActor(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("update_actor", options);
  const actor = game.actors.get(input.actorId);
  if (!actor) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "Actor not found.", 404);
  }

  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);

  const before = normalizeActor(actor);
  const updateData: Record<string, unknown> = {};
  if (input.name) updateData.name = input.name;
  if (input.img) updateData.img = input.img;
  if (input.folderId) updateData.folder = input.folderId;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);
  if (input.prototypeToken) updateData.prototypeToken = input.prototypeToken;
  if (input.systemChanges) updateData.system = pathChangesToObject(input.systemChanges);

  if (input.dryRun) {
    const after = normalizeActor({ ...clone(actor.toObject()), ...updateData });
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  await actor.update(updateData);
  const after = normalizeActor(actor);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

function actorItemCreateData(input: any, options: RuntimeOptions) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  return {
    flags: flagChangesToObject(input.flags),
    img: input.img,
    name: input.name,
    system: pathChangesToObject(input.systemChanges),
    type: input.type,
  };
}

async function handleCreateActorItem(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("create_actor_item", options);
  const actor = game.actors.get(input.actorId);
  if (!actor) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "Actor not found.", 404);
  }

  const data = actorItemCreateData(input, options);
  const before = null;

  if (input.dryRun) {
    const after = normalizeItem({ ...data, actor, id: "preview" });
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  const [item] = await actor.createEmbeddedDocuments("Item", [data]);
  const after = normalizeItem(item);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

async function handleUpdateActorItem(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("update_actor_item", options);
  const actor = game.actors.get(input.actorId);
  const item = actor?.items?.get(input.itemId);
  if (!actor || !item) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "Actor item not found.", 404);
  }

  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);

  const before = normalizeItem(item);
  const updateData: Record<string, unknown> = { _id: input.itemId };
  if (input.name) updateData.name = input.name;
  if (input.img) updateData.img = input.img;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);
  if (input.systemChanges) updateData.system = pathChangesToObject(input.systemChanges);

  if (input.dryRun) {
    const after = normalizeItem({ ...clone(item.toObject()), ...updateData, actor });
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  await actor.updateEmbeddedDocuments("Item", [updateData]);
  const updated = actor.items.get(input.itemId);
  const after = normalizeItem(updated);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

async function handleCreateSceneNote(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("create_scene_note", options);
  const scene = game.scenes.get(input.sceneId);
  if (!scene) {
    throw new BridgeError(ERROR_CODES.documentNotFound, "Scene not found.", 404);
  }

  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const data = {
    entryId: input.entryId,
    flags: flagChangesToObject(input.flags),
    text: input.text ?? input.label,
    texture: input.icon ? { src: input.icon } : undefined,
    x: input.x,
    y: input.y,
  };
  const before = null;

  if (input.dryRun) {
    const after = normalizeNote({ ...data, id: "preview", label: input.label }, input.sceneId);
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  const [note] = await scene.createEmbeddedDocuments("Note", [data]);
  const after = normalizeNote(note, input.sceneId);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

async function handleSetDocumentFlags(input: any, options: RuntimeOptions): Promise<OperationResult> {
  requireAllowedOperation("set_document_flags", options);
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const document = await getDocumentByRef(input.ref);
  const before = normalizeByType(document, input.ref.type, input.ref);

  const flagsObject = flagChangesToObject(input.flags);
  if (input.dryRun) {
    const previewData = clone(document.toObject ? document.toObject() : document);
    previewData.flags = {
      ...(previewData.flags ?? {}),
      ...flagsObject,
    };
    const after = normalizeByType(previewData, input.ref.type, input.ref);
    return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
  }

  await document.update({ flags: flagsObject });
  const after = normalizeByType(document, input.ref.type, input.ref);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}

function normalizeByType(document: any, type: string, ref?: any) {
  switch (type) {
    case "JournalEntry":
      return normalizeJournalEntry(document);
    case "Actor":
      return normalizeActor(document);
    case "Item":
      return normalizeItem(document);
    case "Folder":
      return normalizeFolder(document);
    case "Note":
      return normalizeNote(document, ref?.sceneId);
    case "Scene":
      return normalizeSimpleDocument(document, "Scene");
    case "RollTable":
      return normalizeSimpleDocument(document, "RollTable");
    case "Playlist":
      return normalizeSimpleDocument(document, "Playlist");
    default:
      return normalizeSimpleDocument(document, type as any);
  }
}

export async function executeOperation(toolName: ToolName, payload: Record<string, unknown>, options: RuntimeOptions) {
  try {
    switch (toolName) {
      case "find_documents":
        return await handleFindDocuments(toolInputSchemas.find_documents.parse(payload));
      case "get_document":
        return await handleGetDocument(toolInputSchemas.get_document.parse(payload));
      case "list_folders":
        return await handleListFolders(toolInputSchemas.list_folders.parse(payload));
      case "get_scene_summary":
        return await handleGetSceneSummary(toolInputSchemas.get_scene_summary.parse(payload));
      case "create_journal_entry":
        return await handleCreateJournalEntry(toolInputSchemas.create_journal_entry.parse(payload), options);
      case "update_journal_entry":
        return await handleUpdateJournalEntry(toolInputSchemas.update_journal_entry.parse(payload), options);
      case "create_actor":
        return await handleCreateActor(toolInputSchemas.create_actor.parse(payload), options);
      case "update_actor":
        return await handleUpdateActor(toolInputSchemas.update_actor.parse(payload), options);
      case "create_actor_item":
        return await handleCreateActorItem(toolInputSchemas.create_actor_item.parse(payload), options);
      case "update_actor_item":
        return await handleUpdateActorItem(toolInputSchemas.update_actor_item.parse(payload), options);
      case "create_scene_note":
        return await handleCreateSceneNote(toolInputSchemas.create_scene_note.parse(payload), options);
      case "set_document_flags":
        return await handleSetDocumentFlags(toolInputSchemas.set_document_flags.parse(payload), options);
      default:
        throw new BridgeError(ERROR_CODES.forbiddenOperation, `${toolName} is not implemented in the module.`, 400);
    }
  } catch (error) {
    const bridgeError =
      error instanceof BridgeError
        ? error
        : new BridgeError(ERROR_CODES.moduleError, error instanceof Error ? error.message : "Unknown module error", 500);

    return {
      after: null,
      before: null,
      diff: [],
      error: {
        code: bridgeError.code,
        details: bridgeError.details,
        message: bridgeError.message,
      },
      status: "error" as const,
      warnings: [],
    };
  }
}
