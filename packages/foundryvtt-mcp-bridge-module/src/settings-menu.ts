import { MODULE_ID, SETTINGS } from "./constants.js";
import { getClientSettings, getWorldSettings } from "./settings.js";

function csv(value: string[]): string {
  return value.join(", ");
}

export class BridgeSettingsForm extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["form", MODULE_ID, "bridge-settings"],
      closeOnSubmit: true,
      id: `${MODULE_ID}-settings`,
      submitOnChange: false,
      submitOnClose: false,
      template: `modules/${MODULE_ID}/templates/bridge-settings.hbs`,
      title: "Foundry MCP Bridge Settings",
      width: 640,
    });
  }

  async getData() {
    const client = getClientSettings();
    const world = getWorldSettings();

    return {
      allowedFlagNamespaces: csv(world.allowedFlagNamespaces),
      allowedOperations: csv(world.allowedOperations),
      allowedSystemPaths: csv(world.allowedSystemPaths),
      bridgeOwnerUserId: world.bridgeOwnerUserId,
      canEditWorldSettings: Boolean(game.user?.isGM),
      currentUserId: String(game.user?.id ?? ""),
      isGM: Boolean(game.user?.isGM),
      serverToken: client.serverToken,
      serverUrl: client.serverUrl,
      users: [...(game.users ?? [])].map((user: any) => ({
        id: String(user.id),
        isGM: Boolean(user.isGM),
        name: String(user.name ?? ""),
      })),
    };
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);

    const useCurrentUserButton = html[0]?.querySelector?.("[data-action='use-current-user']");
    useCurrentUserButton?.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const input = html[0]?.querySelector?.("input[name='bridgeOwnerUserId']") as HTMLInputElement | null;
      if (input) {
        input.value = String(game.user?.id ?? "");
      }
    });
  }

  async _updateObject(_event: Event, formData: Record<string, unknown>) {
    const toString = (value: unknown) => String(value ?? "").trim();

    await game.settings.set(MODULE_ID, SETTINGS.serverUrl, toString(formData.serverUrl));
    await game.settings.set(MODULE_ID, SETTINGS.serverToken, toString(formData.serverToken));

    if (game.user?.isGM) {
      await game.settings.set(MODULE_ID, SETTINGS.bridgeOwnerUserId, toString(formData.bridgeOwnerUserId));
      await game.settings.set(MODULE_ID, SETTINGS.allowedOperations, toString(formData.allowedOperations));
      await game.settings.set(MODULE_ID, SETTINGS.allowedFlagNamespaces, toString(formData.allowedFlagNamespaces));
      await game.settings.set(MODULE_ID, SETTINGS.allowedSystemPaths, toString(formData.allowedSystemPaths));
    }

    ui.notifications?.info?.("Foundry MCP Bridge settings saved.");
  }
}
