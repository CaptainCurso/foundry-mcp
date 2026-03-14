import type { DocumentRef } from "@foundry-mcp/shared";

function pageText(page: any): string | undefined {
  return page?.text?.content ?? page?.text?.markdown ?? page?.text ?? undefined;
}

export function normalizeFolder(folder: any) {
  return {
    id: String(folder.id),
    name: String(folder.name ?? ""),
    parentId: folder.folder ? String(folder.folder.id) : undefined,
    type: "Folder" as const,
  };
}

export function normalizeJournalEntry(entry: any) {
  return {
    flags: entry.flags ? entry.toObject?.().flags ?? entry.flags : undefined,
    folderId: entry.folder ? String(entry.folder.id) : entry.folderId ? String(entry.folderId) : undefined,
    id: String(entry.id ?? "preview"),
    name: String(entry.name ?? entry.title ?? ""),
    pages: (entry.pages ?? []).map((page: any) => ({
      id: page.id ? String(page.id) : undefined,
      name: String(page.name ?? ""),
      textContent: pageText(page),
    })),
    type: "JournalEntry" as const,
  };
}

export function normalizeActor(actor: any) {
  return {
    flags: actor.flags ? actor.toObject?.().flags ?? actor.flags : undefined,
    folderId: actor.folder ? String(actor.folder.id) : actor.folderId ? String(actor.folderId) : undefined,
    id: String(actor.id ?? "preview"),
    img: actor.img ? String(actor.img) : undefined,
    name: String(actor.name ?? ""),
    system: actor.system ? actor.toObject?.().system ?? actor.system : undefined,
    type: "Actor" as const,
  };
}

export function normalizeItem(item: any) {
  return {
    flags: item.flags ? item.toObject?.().flags ?? item.flags : undefined,
    id: String(item.id ?? "preview"),
    img: item.img ? String(item.img) : undefined,
    name: String(item.name ?? ""),
    parentId: item.parent ? String(item.parent.id) : item.actor ? String(item.actor.id) : undefined,
    system: item.system ? item.toObject?.().system ?? item.system : undefined,
    type: "Item" as const,
  };
}

export function normalizeNote(note: any, sceneId?: string) {
  return {
    flags: note.flags ? note.toObject?.().flags ?? note.flags : undefined,
    id: String(note.id ?? "preview"),
    name: String(note.label ?? note.text ?? note.name ?? "Scene Note"),
    parentId: note.entryId ? String(note.entryId) : undefined,
    sceneId,
    type: "Note" as const,
  };
}

export function normalizeSceneSummary(scene: any, includeNotes: boolean) {
  const notes = includeNotes ? (scene.notes ?? []).map((note: any) => normalizeNote(note, String(scene.id))) : [];
  return {
    active: Boolean(scene.active),
    height: Number(scene.height ?? 0),
    id: String(scene.id),
    name: String(scene.name ?? ""),
    noteCount: notes.length,
    notes,
    width: Number(scene.width ?? 0),
  };
}

export function normalizeSimpleDocument(document: any, type: DocumentRef["type"]) {
  return {
    id: String(document.id),
    img: document.img ? String(document.img) : undefined,
    name: String(document.name ?? document.label ?? ""),
    type,
  };
}
