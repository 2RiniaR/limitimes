import { Client, Intents } from "discord.js";
import { settingsManager } from "src/server/settings";

export class ClientManager {
  private readonly _client = new Client({
    partials: ["CHANNEL"],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
  });

  public constructor() {
    this._client.on("ready", () => {
      if (!this._client.user) return;
      console.log(`Logged in as ${this._client.user.tag}!`);
    });
  }

  public async initialize() {
    await this._client.login(settingsManager.values.discordToken);
  }

  get client(): Client {
    return this._client;
  }
}
