import { client } from "src/server/discord-bot";
import { TextChannel } from "discord.js";

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandName !== "following_users" ||
    !interaction.channel ||
    !interaction.channel.isText()
  )
    return;
  await showFollowingUsers({
    channel: interaction.channel as TextChannel
  });
});

export type ShowFollowingUsersContext = {
  channel: TextChannel;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function showFollowingUsers(context: ShowFollowingUsersContext) {
  // ToDo: フォローしているユーザー一覧を表示する
}
