import * as dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

dotenv.config();
const token = getEnvironmentVariable("DISCORD_TOKEN");
const clientId = getEnvironmentVariable("CLIENT_ID");
const guildId = getEnvironmentVariable("TARGET_GUILD_ID");
const isGlobal = getEnvironmentVariable("COMMAND_SITE") === "GLOBAL";
const rest = new REST({ version: "9" }).setToken(token);

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) return "";
  return value;
}

function getCommands(): object[] {
  return [
    {
      name: "follow",
      type: 2 // ユーザーを右クリックして実行できるコマンド
    },
    {
      name: "unfollow",
      type: 2 // ユーザーを右クリックして実行できるコマンド
    },
    {
      name: "times",
      description: "limitimesのコマンド群",
      options: [
        {
          type: 1,
          name: "show-following-users",
          description: "あなたがフォローしているユーザーの一覧を表示する"
        }
      ]
    }
  ];
}

void (async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    if (isGlobal) {
      await rest.put(Routes.applicationCommands(clientId), { body: getCommands() });
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: getCommands() });
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(JSON.stringify(error));
  }
})();
