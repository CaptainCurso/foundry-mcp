import { BridgeError, ERROR_CODES, type DocumentRef } from "@foundry-mcp/shared";

export function getCollectionForType(type: DocumentRef["type"]) {
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
      return undefined;
  }
}

export async function getDocumentByRef(ref: DocumentRef) {
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
        const item = actor?.items?.get(ref.id);
        if (!item) {
          throw new BridgeError(ERROR_CODES.documentNotFound, `Actor item ${ref.id} was not found.`, 404);
        }
        return item;
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
