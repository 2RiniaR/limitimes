import { client } from "src/server/discord";
import { CommandInteraction, User as DiscordUser } from "discord.js";
import { responseForFailed, responseForSucceed } from "src/server/views/show-following-users";
import { User } from "src/server/models/user";
import { settings } from "src/server/settings";
import { checkRegisterUser } from "src/server/controllers/register-user";

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

async function fetchFollowingUsers(user: User): Promise<DiscordUser[]> {
  const followingUsers = user.followingUsers;
  if (!followingUsers) throw Error();
  const followingUsersId = followingUsers.reduce((prev: string[], user) => {
    if (!user.discordId) return prev;
    return prev.concat([user.discordId]);
  }, []);
  return await fetchUsers(followingUsersId);
}

async function fetchUsers(usersId: string[]): Promise<DiscordUser[]> {
  const targetGuild = await client.guilds.fetch(settings.values.targetGuildId);
  return await Promise.all(
    usersId.map(async (user) => {
      const guildMember = await targetGuild.members.fetch(user);
      return guildMember.user;
    })
  );
}

export async function showFollowingUsers({ interaction, requestDiscordUser }: ShowFollowingUsersContext) {
  if (!(await checkRegisterUser(interaction, requestDiscordUser))) return;

  try {
    const requestUser = new User(requestDiscordUser.id);
    requestUser.fetch();
    const followingDiscordUsers = await fetchFollowingUsers(requestUser);
    await responseForSucceed(interaction, { followingUserNames: followingDiscordUsers.map((user) => user.toString()) });
  } catch (error) {
    await responseForFailed(interaction);
  }
}
