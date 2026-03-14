declare const Hooks: {
  once(event: string, callback: () => void | Promise<void>): void;
};

declare const game: any;
declare const ui: any;
declare const foundry: any;
declare const Actor: any;
declare const Folder: any;
declare const Item: any;
declare const JournalEntry: any;
declare const Playlist: any;
declare const RollTable: any;
declare const Scene: any;

declare function fromUuid(uuid: string): Promise<any>;
