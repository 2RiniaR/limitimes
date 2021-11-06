import { client } from "src/server/discord";
import { TextChannel } from "discord.js";

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandName !== "follower_users" ||
    !interaction.channel ||
    !interaction.channel.isText()
  )
    return;
  await showFollowerUsers({
    channel: interaction.channel as TextChannel
  });
});

export type ShowFollowerUsersContext = {
  channel: TextChannel;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function showFollowerUsers(context: ShowFollowerUsersContext) {
  // ToDo: フォローされているユーザー一覧を表示する
}
