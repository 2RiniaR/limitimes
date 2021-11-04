import { Client, Intents } from "discord.js";
import { settings } from "src/settings";

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

export function initialize() {
  void client.login(settings.values.discordToken);
}

client.on("ready", () => {
  if (!client.user) return;
  console.log(`Logged in as ${client.user.tag}!`);
});
