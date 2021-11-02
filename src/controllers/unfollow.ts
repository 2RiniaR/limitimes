import { client } from "src/discord-bot";
import { TextChannel, User } from "discord.js";

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandName !== "unfollow" ||
    !interaction.channel ||
    !interaction.channel.isText()
  )
    return;
  await unfollowUser({
    requestUser: interaction.user,
    targetUser: interaction.user,
    channel: interaction.channel as TextChannel
  });
});

export type UnfollowUserContext = {
  requestUser: User;
  targetUser: User;
  channel: TextChannel;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function unfollowUser(context: UnfollowUserContext) {
  // ToDo: ユーザーのフォローを解除する
}
