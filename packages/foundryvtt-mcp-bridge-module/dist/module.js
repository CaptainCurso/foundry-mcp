// src/constants.ts
import { MODULE_FLAG_NAMESPACE, MODULE_ID, WRITE_TOOL_NAMES } from "@foundry-mcp/shared";
var SETTINGS = {
  allowedFlagNamespaces: "allowedFlagNamespaces",
  allowedOperations: "allowedOperations",
  allowedSystemPaths: "allowedSystemPaths",
  bridgeOwnerUserId: "bridgeOwnerUserId",
  serverToken: "serverToken",
  serverUrl: "serverUrl"
};
var DEFAULT_ALLOWED_OPERATIONS = [...WRITE_TOOL_NAMES];
var DEFAULT_ALLOWED_FLAG_NAMESPACES = [MODULE_FLAG_NAMESPACE];

// src/settings.ts
function csv(value) {
  return value.join(",");
}
function registerSettings() {
  game.settings.register(MODULE_ID, SETTINGS.serverUrl, {
    config: true,
    default: "http://127.0.0.1:3310",
    hint: "The local Foundry MCP bridge server URL.",
    name: "Bridge Server URL",
    scope: "client",
    type: String
  });
  game.settings.register(MODULE_ID, SETTINGS.serverToken, {
    config: true,
    default: "",
    hint: "Bearer token that authenticates this module to the local bridge server.",
    name: "Bridge Bearer Token",
    scope: "client",
    type: String
  });
  game.settings.register(MODULE_ID, SETTINGS.bridgeOwnerUserId, {
    config: true,
    default: "",
    hint: "Only this GM user id is allowed to run the bridge polling loop.",
    name: "Bridge Owner User ID",
    scope: "world",
    type: String
  });
  game.settings.register(MODULE_ID, SETTINGS.allowedOperations, {
    config: true,
    default: csv(DEFAULT_ALLOWED_OPERATIONS),
    hint: "Comma-separated allowlist of write tool names.",
    name: "Allowed Operations",
    scope: "world",
    type: String
  });
  game.settings.register(MODULE_ID, SETTINGS.allowedFlagNamespaces, {
    config: true,
    default: csv(DEFAULT_ALLOWED_FLAG_NAMESPACES),
    hint: "Comma-separated allowlist of flag namespaces. Defaults to the module-owned namespace only.",
    name: "Allowed Flag Namespaces",
    scope: "world",
    type: String
  });
  game.settings.register(MODULE_ID, SETTINGS.allowedSystemPaths, {
    config: true,
    default: "",
    hint: "Comma-separated allowlist of dotted system paths for Actor and Item writes.",
    name: "Allowed System Paths",
    scope: "world",
    type: String
  });
}
function getClientSettings() {
  return {
    serverToken: String(game.settings.get(MODULE_ID, SETTINGS.serverToken) ?? ""),
    serverUrl: String(game.settings.get(MODULE_ID, SETTINGS.serverUrl) ?? "")
  };
}
function getWorldSettings() {
  return {
    allowedFlagNamespaces: String(game.settings.get(MODULE_ID, SETTINGS.allowedFlagNamespaces) ?? "").split(",").map((entry) => entry.trim()).filter(Boolean),
    allowedOperations: String(game.settings.get(MODULE_ID, SETTINGS.allowedOperations) ?? "").split(",").map((entry) => entry.trim()).filter(Boolean),
    allowedSystemPaths: String(game.settings.get(MODULE_ID, SETTINGS.allowedSystemPaths) ?? "").split(",").map((entry) => entry.trim()).filter(Boolean),
    bridgeOwnerUserId: String(game.settings.get(MODULE_ID, SETTINGS.bridgeOwnerUserId) ?? "")
  };
}

// src/bridge-client.ts
var BridgeClient = class {
  constructor(config) {
    this.config = config;
  }
  async registerSession(payload) {
    return this.post("/module/session/register", payload);
  }
  async heartbeat(sessionId) {
    return this.post("/module/session/heartbeat", { sessionId });
  }
  async claimJob(sessionId, waitMs = 1e4) {
    return this.post("/module/jobs/claim", { sessionId, waitMs });
  }
  async submitResult(sessionId, jobId, result) {
    return this.post(`/module/jobs/${jobId}/result`, { result, sessionId });
  }
  async post(path, body) {
    const response = await fetch(`${this.config.serverUrl}${path}`, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.config.serverToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error?.message ?? `Bridge request failed for ${path}`);
    }
    return payload;
  }
};

// src/operations.ts
import {
  BridgeError as BridgeError2,
  ERROR_CODES as ERROR_CODES2,
  assertAllowedNamespaces,
  assertAllowedSystemPaths,
  diffValues,
  flagChangesToObject,
  pathChangesToObject,
  toolInputSchemas
} from "@foundry-mcp/shared";

// src/document-access.ts
import { BridgeError, ERROR_CODES } from "@foundry-mcp/shared";
function getCollectionForType(type) {
  switch (type) {
    case "JournalEntry":
      return game.journal;
    case "Actor":
      return game.actors;
    case "Item":
      return game.items;
    case "Folder":
      return game.folders;
    case "RollTable":
      return game.tables;
    case "Playlist":
      return game.playlists;
    case "Scene":
      return game.scenes;
    default:
      return void 0;
  }
}
async function getDocumentByRef(ref) {
  switch (ref.type) {
    case "Note": {
      const scene = game.scenes.get(ref.sceneId);
      const note = scene?.notes?.get(ref.id);
      if (!note) {
        throw new BridgeError(ERROR_CODES.documentNotFound, `Scene Note ${ref.id} was not found.`, 404);
      }
      return note;
    }
    case "Item": {
      if (ref.actorId) {
        const actor = game.actors.get(ref.actorId);
        const item2 = actor?.items?.get(ref.id);
        if (!item2) {
          throw new BridgeError(ERROR_CODES.documentNotFound, `Actor item ${ref.id} was not found.`, 404);
        }
        return item2;
      }
      const collection = getCollectionForType(ref.type);
      const item = collection?.get(ref.id);
      if (!item) {
        throw new BridgeError(ERROR_CODES.documentNotFound, `Item ${ref.id} was not found.`, 404);
      }
      return item;
    }
    default: {
      const collection = getCollectionForType(ref.type);
      const document = collection?.get(ref.id);
      if (!document) {
        throw new BridgeError(ERROR_CODES.documentNotFound, `${ref.type} ${ref.id} was not found.`, 404);
      }
      return document;
    }
  }
}

// src/normalize.ts
function pageText(page) {
  return page?.text?.content ?? page?.text?.markdown ?? page?.text ?? void 0;
}
function normalizeFolder(folder) {
  return {
    id: String(folder.id),
    name: String(folder.name ?? ""),
    parentId: folder.folder ? String(folder.folder.id) : void 0,
    type: "Folder"
  };
}
function normalizeJournalEntry(entry) {
  return {
    flags: entry.flags ? entry.toObject?.().flags ?? entry.flags : void 0,
    folderId: entry.folder ? String(entry.folder.id) : entry.folderId ? String(entry.folderId) : void 0,
    id: String(entry.id ?? "preview"),
    name: String(entry.name ?? entry.title ?? ""),
    pages: (entry.pages ?? []).map((page) => ({
      id: page.id ? String(page.id) : void 0,
      name: String(page.name ?? ""),
      textContent: pageText(page)
    })),
    type: "JournalEntry"
  };
}
function normalizeActor(actor) {
  return {
    flags: actor.flags ? actor.toObject?.().flags ?? actor.flags : void 0,
    folderId: actor.folder ? String(actor.folder.id) : actor.folderId ? String(actor.folderId) : void 0,
    id: String(actor.id ?? "preview"),
    img: actor.img ? String(actor.img) : void 0,
    name: String(actor.name ?? ""),
    system: actor.system ? actor.toObject?.().system ?? actor.system : void 0,
    type: "Actor"
  };
}
function normalizeItem(item) {
  return {
    flags: item.flags ? item.toObject?.().flags ?? item.flags : void 0,
    id: String(item.id ?? "preview"),
    img: item.img ? String(item.img) : void 0,
    name: String(item.name ?? ""),
    parentId: item.parent ? String(item.parent.id) : item.actor ? String(item.actor.id) : void 0,
    system: item.system ? item.toObject?.().system ?? item.system : void 0,
    type: "Item"
  };
}
function normalizeNote(note, sceneId) {
  return {
    flags: note.flags ? note.toObject?.().flags ?? note.flags : void 0,
    id: String(note.id ?? "preview"),
    name: String(note.label ?? note.text ?? note.name ?? "Scene Note"),
    parentId: note.entryId ? String(note.entryId) : void 0,
    sceneId,
    type: "Note"
  };
}
function normalizeSceneSummary(scene, includeNotes) {
  const notes = includeNotes ? (scene.notes ?? []).map((note) => normalizeNote(note, String(scene.id))) : [];
  return {
    active: Boolean(scene.active),
    height: Number(scene.height ?? 0),
    id: String(scene.id),
    name: String(scene.name ?? ""),
    noteCount: notes.length,
    notes,
    width: Number(scene.width ?? 0)
  };
}
function normalizeSimpleDocument(document, type) {
  return {
    id: String(document.id),
    img: document.img ? String(document.img) : void 0,
    name: String(document.name ?? document.label ?? ""),
    type
  };
}

// src/operations.ts
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function requireAllowedOperation(toolName, options) {
  if (!options.allowedOperations.includes(toolName)) {
    throw new BridgeError2(ERROR_CODES2.forbiddenOperation, `Operation ${toolName} is not allowlisted in world settings.`, 403);
  }
}
async function handleFindDocuments(input) {
  const documentTypes = input.documentTypes ?? ["JournalEntry", "Actor", "Folder", "RollTable", "Playlist", "Scene"];
  const query = String(input.query ?? "").toLowerCase();
  const limit = Number(input.limit ?? 25);
  const matches = [];
  const addMatches = (documents, type) => {
    for (const document of documents) {
      const name = String(document.name ?? document.label ?? "");
      const folderId = document.folder ? String(document.folder.id) : void 0;
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
        matches.push(normalizeSimpleDocument(document, type));
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
          addMatches([...scene.notes ?? []], type);
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
    warnings: []
  };
}
async function handleGetDocument(input) {
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
    warnings: []
  };
}
async function handleListFolders(input) {
  const folders = [...game.folders].filter((folder) => {
    const typeMatch = input.documentType ? folder.type === input.documentType : true;
    const parentMatch = input.parentId ? String(folder.folder?.id ?? "") === input.parentId : true;
    return typeMatch && parentMatch;
  });
  return {
    after: { folders: folders.map((folder) => normalizeFolder(folder)) },
    before: null,
    diff: [],
    status: "success",
    warnings: []
  };
}
async function handleGetSceneSummary(input) {
  if (!input.sceneId && !input.sceneName) {
    throw new BridgeError2(ERROR_CODES2.invalidPayload, "Provide sceneId or sceneName.", 400);
  }
  const scene = input.sceneId ? game.scenes.get(input.sceneId) : [...game.scenes].find((entry) => String(entry.name ?? "") === input.sceneName);
  if (!scene) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "Scene not found.", 404);
  }
  return {
    after: { scene: normalizeSceneSummary(scene, Boolean(input.includeNotes)) },
    before: null,
    diff: [],
    status: "success",
    warnings: []
  };
}
function buildJournalEntryCreateData(input, options) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  return {
    flags: flagChangesToObject(input.flags),
    folder: input.folderId,
    name: input.title,
    pages: (input.pages ?? []).map((page) => ({
      name: page.name,
      text: { content: page.textContent, format: 1 },
      type: "text"
    }))
  };
}
async function handleCreateJournalEntry(input, options) {
  requireAllowedOperation("create_journal_entry", options);
  const createData = buildJournalEntryCreateData(input, options);
  const before = null;
  if (input.dryRun) {
    const after2 = normalizeJournalEntry({ ...createData, id: "preview", title: input.title });
    return {
      after: after2,
      before,
      diff: diffValues(before, after2),
      status: "success",
      warnings: []
    };
  }
  const [created] = await JournalEntry.createDocuments([createData]);
  const after = normalizeJournalEntry(created);
  return {
    after,
    before,
    diff: diffValues(before, after),
    status: "success",
    warnings: []
  };
}
async function handleUpdateJournalEntry(input, options) {
  requireAllowedOperation("update_journal_entry", options);
  const journalEntry = game.journal.get(input.journalEntryId);
  if (!journalEntry) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "JournalEntry not found.", 404);
  }
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const before = normalizeJournalEntry(journalEntry);
  const updateData = {};
  if (input.title) updateData.name = input.title;
  if (input.folderId) updateData.folder = input.folderId;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);
  const pageWarnings = [];
  if (input.pages?.length) {
    pageWarnings.push("Journal page updates are append-or-target-only in v1. Existing pages are left in place.");
  }
  if (input.dryRun) {
    const preview = {
      ...clone(journalEntry.toObject()),
      ...updateData
    };
    if (input.pages?.length) {
      preview.pages = [...preview.pages ?? []];
      for (const page of input.pages) {
        const existingIndex = page.pageId ? preview.pages.findIndex((entry) => String(entry._id ?? entry.id) === page.pageId) : -1;
        const previewPage = {
          _id: page.pageId,
          name: page.name,
          text: { content: page.textContent, format: 1 },
          type: "text"
        };
        if (existingIndex >= 0) {
          preview.pages[existingIndex] = {
            ...preview.pages[existingIndex],
            ...previewPage
          };
        } else {
          preview.pages.push(previewPage);
        }
      }
    }
    const after2 = normalizeJournalEntry(preview);
    return {
      after: after2,
      before,
      diff: diffValues(before, after2),
      status: "success",
      warnings: pageWarnings
    };
  }
  await journalEntry.update(updateData);
  if (input.pages?.length) {
    const pagesToCreate = input.pages.filter((page) => !page.pageId).map((page) => ({
      name: page.name,
      text: { content: page.textContent, format: 1 },
      type: "text"
    }));
    const pagesToUpdate = input.pages.filter((page) => page.pageId).map((page) => ({
      _id: page.pageId,
      name: page.name,
      text: { content: page.textContent, format: 1 }
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
    warnings: pageWarnings
  };
}
function actorCreateData(input, options) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  return {
    flags: flagChangesToObject(input.flags),
    folder: input.folderId,
    img: input.img,
    name: input.name,
    prototypeToken: input.prototypeToken,
    system: pathChangesToObject(input.systemChanges),
    type: input.type
  };
}
async function handleCreateActor(input, options) {
  requireAllowedOperation("create_actor", options);
  const data = actorCreateData(input, options);
  const before = null;
  if (input.dryRun) {
    const after2 = normalizeActor({ ...data, id: "preview" });
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  const [actor] = await Actor.createDocuments([data]);
  const after = normalizeActor(actor);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
async function handleUpdateActor(input, options) {
  requireAllowedOperation("update_actor", options);
  const actor = game.actors.get(input.actorId);
  if (!actor) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "Actor not found.", 404);
  }
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  const before = normalizeActor(actor);
  const updateData = {};
  if (input.name) updateData.name = input.name;
  if (input.img) updateData.img = input.img;
  if (input.folderId) updateData.folder = input.folderId;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);
  if (input.prototypeToken) updateData.prototypeToken = input.prototypeToken;
  if (input.systemChanges) updateData.system = pathChangesToObject(input.systemChanges);
  if (input.dryRun) {
    const after2 = normalizeActor({ ...clone(actor.toObject()), ...updateData });
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  await actor.update(updateData);
  const after = normalizeActor(actor);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
function actorItemCreateData(input, options) {
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  return {
    flags: flagChangesToObject(input.flags),
    img: input.img,
    name: input.name,
    system: pathChangesToObject(input.systemChanges),
    type: input.type
  };
}
async function handleCreateActorItem(input, options) {
  requireAllowedOperation("create_actor_item", options);
  const actor = game.actors.get(input.actorId);
  if (!actor) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "Actor not found.", 404);
  }
  const data = actorItemCreateData(input, options);
  const before = null;
  if (input.dryRun) {
    const after2 = normalizeItem({ ...data, actor, id: "preview" });
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  const [item] = await actor.createEmbeddedDocuments("Item", [data]);
  const after = normalizeItem(item);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
async function handleUpdateActorItem(input, options) {
  requireAllowedOperation("update_actor_item", options);
  const actor = game.actors.get(input.actorId);
  const item = actor?.items?.get(input.itemId);
  if (!actor || !item) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "Actor item not found.", 404);
  }
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  assertAllowedSystemPaths(input.systemChanges, options.allowedSystemPaths);
  const before = normalizeItem(item);
  const updateData = { _id: input.itemId };
  if (input.name) updateData.name = input.name;
  if (input.img) updateData.img = input.img;
  if (input.flags) updateData.flags = flagChangesToObject(input.flags);
  if (input.systemChanges) updateData.system = pathChangesToObject(input.systemChanges);
  if (input.dryRun) {
    const after2 = normalizeItem({ ...clone(item.toObject()), ...updateData, actor });
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  await actor.updateEmbeddedDocuments("Item", [updateData]);
  const updated = actor.items.get(input.itemId);
  const after = normalizeItem(updated);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
async function handleCreateSceneNote(input, options) {
  requireAllowedOperation("create_scene_note", options);
  const scene = game.scenes.get(input.sceneId);
  if (!scene) {
    throw new BridgeError2(ERROR_CODES2.documentNotFound, "Scene not found.", 404);
  }
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const data = {
    entryId: input.entryId,
    flags: flagChangesToObject(input.flags),
    text: input.text ?? input.label,
    texture: input.icon ? { src: input.icon } : void 0,
    x: input.x,
    y: input.y
  };
  const before = null;
  if (input.dryRun) {
    const after2 = normalizeNote({ ...data, id: "preview", label: input.label }, input.sceneId);
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  const [note] = await scene.createEmbeddedDocuments("Note", [data]);
  const after = normalizeNote(note, input.sceneId);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
async function handleSetDocumentFlags(input, options) {
  requireAllowedOperation("set_document_flags", options);
  assertAllowedNamespaces(input.flags, options.allowedFlagNamespaces);
  const document = await getDocumentByRef(input.ref);
  const before = normalizeByType(document, input.ref.type, input.ref);
  const flagsObject = flagChangesToObject(input.flags);
  if (input.dryRun) {
    const previewData = clone(document.toObject ? document.toObject() : document);
    previewData.flags = {
      ...previewData.flags ?? {},
      ...flagsObject
    };
    const after2 = normalizeByType(previewData, input.ref.type, input.ref);
    return { after: after2, before, diff: diffValues(before, after2), status: "success", warnings: [] };
  }
  await document.update({ flags: flagsObject });
  const after = normalizeByType(document, input.ref.type, input.ref);
  return { after, before, diff: diffValues(before, after), status: "success", warnings: [] };
}
function normalizeByType(document, type, ref) {
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
      return normalizeSimpleDocument(document, type);
  }
}
async function executeOperation(toolName, payload, options) {
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
        throw new BridgeError2(ERROR_CODES2.forbiddenOperation, `${toolName} is not implemented in the module.`, 400);
    }
  } catch (error) {
    const bridgeError = error instanceof BridgeError2 ? error : new BridgeError2(ERROR_CODES2.moduleError, error instanceof Error ? error.message : "Unknown module error", 500);
    return {
      after: null,
      before: null,
      diff: [],
      error: {
        code: bridgeError.code,
        details: bridgeError.details,
        message: bridgeError.message
      },
      status: "error",
      warnings: []
    };
  }
}

// src/runtime.ts
async function startBridgeRuntime() {
  const clientSettings = getClientSettings();
  const worldSettings = getWorldSettings();
  if (!game.user?.isGM) {
    return;
  }
  if (!worldSettings.bridgeOwnerUserId || game.user.id !== worldSettings.bridgeOwnerUserId) {
    return;
  }
  if (!clientSettings.serverUrl || !clientSettings.serverToken) {
    ui.notifications?.warn?.("Foundry MCP Bridge: configure the bridge server URL and bearer token first.");
    return;
  }
  const client = new BridgeClient(clientSettings);
  const session = await client.registerSession({
    foundryUserId: String(game.user.id),
    foundryUserName: String(game.user.name ?? ""),
    moduleVersion: "0.1.0",
    worldId: String(game.world?.id ?? ""),
    worldTitle: String(game.world?.title ?? "")
  });
  const sessionId = String(session.sessionId);
  setInterval(() => {
    void client.heartbeat(sessionId).catch((error) => {
      console.error(`${MODULE_ID} heartbeat failed`, error);
    });
  }, 1e4);
  async function poll() {
    try {
      const response = await client.claimJob(sessionId);
      const job = response.job;
      if (job) {
        const result = await executeOperation(job.toolName, job.payload, {
          allowedFlagNamespaces: worldSettings.allowedFlagNamespaces,
          allowedOperations: worldSettings.allowedOperations,
          allowedSystemPaths: worldSettings.allowedSystemPaths
        });
        await client.submitResult(sessionId, job.jobId, result);
      }
    } catch (error) {
      console.error(`${MODULE_ID} poll failed`, error);
    } finally {
      window.setTimeout(() => {
        void poll();
      }, Number(session.pollIntervalMs ?? 2500));
    }
  }
  void poll();
}

// src/module.ts
Hooks.once("init", () => {
  registerSettings();
});
Hooks.once("ready", async () => {
  await startBridgeRuntime();
});
