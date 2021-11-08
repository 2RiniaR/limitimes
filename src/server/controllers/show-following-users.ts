import { client } from "src/server/discord";
import { CommandInteraction, User as DiscordUser } from "discord.js";
import { responseForFailed, responseForSucceed } from "src/server/views/responses/show-following-users";
import { User } from "src/server/models/user";
import { checkRegisterUser } from "src/server/controllers/register-user";
import { fetchFollowingUsers } from "src/server/controllers/utils";

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandName !== "times" ||
    interaction.options.getSubcommand() !== "show-following-users" ||
    !interaction.channel ||
    !interaction.channel.isText()
  )
    return;
  await showFollowingUsers({
    interaction: interaction,
    requestDiscordUser: interaction.user
  });
});

export type ShowFollowingUsersContext = {
  interaction: CommandInteraction;
  requestDiscordUser: DiscordUser;
};

export async function showFollowingUsers({ interaction, requestDiscordUser }: ShowFollowingUsersContext) {
  if (!(await checkRegisterUser(interaction, requestDiscordUser))) return;

  try {
    const requestUser = new User(requestDiscordUser.id);
    await requestUser.fetch();
    const followingDiscordUsers = await fetchFollowingUsers(requestUser);
    await responseForSucceed(interaction, { followingUserNames: followingDiscordUsers.map((user) => user.toString()) });
  } catch (error) {
    await responseForFailed(interaction);
  }
}
