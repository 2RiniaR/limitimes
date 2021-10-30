import { Client, Intents } from "discord.js";
import { provider } from "../settings";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export function initialize() {
  void client.login(provider.settings.discord_token);
}

client.on("ready", () => {
  if (!client.user) return;
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});
