# Tool Reference

This document gives one example request and one example response for every v1 MCP tool.

## Read Tools

### `find_documents`

Request:

```json
{
  "query": "bridge",
  "documentTypes": ["Actor", "JournalEntry"],
  "limit": 10
}
```

Response:

```json
{
  "ok": true,
  "tool": "find_documents",
  "status": "success",
  "data": {
    "documents": [
      {
        "id": "abc123",
        "name": "Bridge Journal",
        "type": "JournalEntry"
      }
    ]
  }
}
```

### `get_document`

Request:

```json
{
  "ref": {
    "type": "JournalEntry",
    "id": "abc123"
  },
  "includeContent": true
}
```

Response:

```json
{
  "ok": true,
  "tool": "get_document",
  "status": "success",
  "data": {
    "document": {
      "id": "abc123",
      "name": "Bridge Journal",
      "type": "JournalEntry",
      "pages": [
        {
          "id": "page1",
          "name": "Overview",
          "textContent": "Bridge-created page content."
        }
      ]
    }
  }
}
```

### `list_folders`

Request:

```json
{
  "documentType": "Actor"
}
```

Response:

```json
{
  "ok": true,
  "tool": "list_folders",
  "status": "success",
  "data": {
    "folders": [
      {
        "id": "folder1",
        "name": "NPCs",
        "type": "Folder"
      }
    ]
  }
}
```

### `get_scene_summary`

Request:

```json
{
  "sceneId": "scene1",
  "includeNotes": true
}
```

Response:

```json
{
  "ok": true,
  "tool": "get_scene_summary",
  "status": "success",
  "data": {
    "scene": {
      "id": "scene1",
      "name": "Bridge Map",
      "active": true,
      "noteCount": 1,
      "notes": [
        {
          "id": "note1",
          "name": "Bridge Note",
          "type": "Note",
          "sceneId": "scene1"
        }
      ]
    }
  }
}
```

## Write Tools

### `create_journal_entry`

Request:

```json
{
  "dryRun": true,
  "title": "Bridge Journal",
  "pages": [
    {
      "name": "Overview",
      "textContent": "Bridge-created page content."
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "tool": "create_journal_entry",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": null,
    "after": {
      "id": "preview",
      "name": "Bridge Journal",
      "type": "JournalEntry"
    },
    "diff": [
      {
        "path": "$",
        "before": null,
        "after": {
          "id": "preview",
          "name": "Bridge Journal",
          "type": "JournalEntry"
        }
      }
    ],
    "warnings": []
  }
}
```

### `update_journal_entry`

Request:

```json
{
  "dryRun": true,
  "journalEntryId": "abc123",
  "title": "Updated Bridge Journal",
  "pages": [
    {
      "pageId": "page1",
      "name": "Overview",
      "textContent": "Updated bridge content."
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "tool": "update_journal_entry",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": {
      "id": "abc123",
      "name": "Bridge Journal",
      "type": "JournalEntry"
    },
    "after": {
      "id": "abc123",
      "name": "Updated Bridge Journal",
      "type": "JournalEntry"
    },
    "diff": [
      {
        "path": "name",
        "before": "Bridge Journal",
        "after": "Updated Bridge Journal"
      }
    ],
    "warnings": [
      "Journal page updates are append-or-target-only in v1. Existing pages are left in place."
    ]
  }
}
```

### `create_actor`

Request:

```json
{
  "dryRun": true,
  "name": "Bridge Test Actor",
  "type": "npc"
}
```

Response:

```json
{
  "ok": true,
  "tool": "create_actor",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": null,
    "after": {
      "id": "preview",
      "name": "Bridge Test Actor",
      "type": "Actor"
    },
    "diff": [],
    "warnings": []
  }
}
```

### `update_actor`

Request:

```json
{
  "dryRun": true,
  "actorId": "actor1",
  "name": "Updated Bridge Actor"
}
```

Response:

```json
{
  "ok": true,
  "tool": "update_actor",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": {
      "id": "actor1",
      "name": "Bridge Test Actor",
      "type": "Actor"
    },
    "after": {
      "id": "actor1",
      "name": "Updated Bridge Actor",
      "type": "Actor"
    },
    "diff": [
      {
        "path": "name",
        "before": "Bridge Test Actor",
        "after": "Updated Bridge Actor"
      }
    ],
    "warnings": []
  }
}
```

### `create_actor_item`

Request:

```json
{
  "dryRun": true,
  "actorId": "actor1",
  "name": "Bridge Longsword",
  "type": "weapon"
}
```

Response:

```json
{
  "ok": true,
  "tool": "create_actor_item",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": null,
    "after": {
      "id": "preview",
      "name": "Bridge Longsword",
      "type": "Item",
      "parentId": "actor1"
    },
    "diff": [],
    "warnings": []
  }
}
```

### `update_actor_item`

Request:

```json
{
  "dryRun": true,
  "actorId": "actor1",
  "itemId": "item1",
  "name": "Updated Bridge Longsword"
}
```

Response:

```json
{
  "ok": true,
  "tool": "update_actor_item",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": {
      "id": "item1",
      "name": "Bridge Longsword",
      "type": "Item"
    },
    "after": {
      "id": "item1",
      "name": "Updated Bridge Longsword",
      "type": "Item"
    },
    "diff": [
      {
        "path": "name",
        "before": "Bridge Longsword",
        "after": "Updated Bridge Longsword"
      }
    ],
    "warnings": []
  }
}
```

### `create_scene_note`

Request:

```json
{
  "dryRun": true,
  "sceneId": "scene1",
  "entryId": "abc123",
  "label": "Bridge Note",
  "x": 1200,
  "y": 800
}
```

Response:

```json
{
  "ok": true,
  "tool": "create_scene_note",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": null,
    "after": {
      "id": "preview",
      "name": "Bridge Note",
      "type": "Note",
      "sceneId": "scene1",
      "parentId": "abc123"
    },
    "diff": [],
    "warnings": []
  }
}
```

### `set_document_flags`

Request:

```json
{
  "dryRun": true,
  "ref": {
    "type": "Actor",
    "id": "actor1"
  },
  "flags": [
    {
      "namespace": "foundryvtt-mcp-bridge-module",
      "key": "approved",
      "value": true
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "tool": "set_document_flags",
  "status": "success",
  "data": {
    "dryRun": true,
    "approvalRequired": true,
    "approved": false,
    "before": {
      "id": "actor1",
      "name": "Updated Bridge Actor",
      "type": "Actor"
    },
    "after": {
      "id": "actor1",
      "name": "Updated Bridge Actor",
      "type": "Actor",
      "flags": {
        "foundryvtt-mcp-bridge-module": {
          "approved": true
        }
      }
    },
    "diff": [
      {
        "path": "flags.foundryvtt-mcp-bridge-module.approved",
        "before": null,
        "after": true
      }
    ],
    "warnings": []
  }
}
```

## Control Tools

### `preview_change`

Request:

```json
{
  "change": {
    "toolName": "create_journal_entry",
    "payload": {
      "dryRun": true,
      "title": "Bridge Journal",
      "pages": [
        {
          "name": "Overview",
          "textContent": "Bridge-created page content."
        }
      ]
    }
  }
}
```

Response:

```json
{
  "ok": true,
  "tool": "preview_change",
  "status": "success",
  "data": {
    "toolName": "create_journal_entry",
    "approvalToken": "approval_xxxxxxxxxxxxxxxxxxxxx",
    "expiresAt": "2026-03-14T12:50:00.000Z",
    "change": {
      "dryRun": true,
      "approvalRequired": true,
      "approved": false,
      "before": null,
      "after": {
        "id": "preview",
        "name": "Bridge Journal",
        "type": "JournalEntry"
      },
      "diff": [],
      "warnings": []
    }
  }
}
```

### `apply_approved_change`

Request:

```json
{
  "approvalToken": "approval_xxxxxxxxxxxxxxxxxxxxx"
}
```

Response:

```json
{
  "ok": true,
  "tool": "apply_approved_change",
  "status": "success",
  "data": {
    "toolName": "create_journal_entry",
    "approvalTokenUsed": "approval_xxxxxxxxxxxxxxxxxxxxx",
    "dryRun": false,
    "approvalRequired": false,
    "approved": true,
    "before": null,
    "after": {
      "id": "abc123",
      "name": "Bridge Journal",
      "type": "JournalEntry"
    },
    "diff": [],
    "warnings": []
  }
}
```
