import { Client, Intents } from "discord.js";
import { settings } from "src/server/settings";

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

export async function initialize() {
  await client.login(settings.values.discordToken);
}

client.on("ready", () => {
  if (!client.user) return;
  console.log(`Logged in as ${client.user.tag}!`);
});
