import * as dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

dotenv.config();
const token = getEnvironmentVariable("DISCORD_TOKEN");
const clientId = getEnvironmentVariable("CLIENT_ID");
const guildId = getEnvironmentVariable("TARGET_GUILD_ID");
const rest = new REST({ version: "9" }).setToken(token);

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) return "";
  return value;
}

function getCommands(): object[] {
  return [
    {
      name: "フォローする",
      type: 2 // ユーザーを右クリックして実行できるコマンド
    },
    {
      name: "フォローを解除する",
      type: 2 // ユーザーを右クリックして実行できるコマンド
    }
  ];
}

void (async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: getCommands() });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(JSON.stringify(error));
  }
})();
