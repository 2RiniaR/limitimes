import "./message";
import { ClientManager } from "src/server/discord/client";
import { TargetGuildManager } from "src/server/discord/target-guild";

export const clientManager = new ClientManager();
export const targetGuildManager = new TargetGuildManager(clientManager.client);
