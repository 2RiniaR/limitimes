import { client } from "src/server/discord";
import { CommandInteraction, User as DiscordUser } from "discord.js";
import {
  responseForRequesterIsBot,
  responseForFailed,
  responseForSuccess
} from "src/server/views/show-following-users";
import { User } from "src/server/models/user";
import { settings } from "src/server/settings";

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
  if (requestDiscordUser.bot) {
    await responseForRequesterIsBot(interaction);
    return;
  }

  try {
    const requestUser = new User(requestDiscordUser.id);
    if (!requestUser.isExist()) requestUser.create();
    else requestUser.fetch();

    const followingDiscordUsers = await fetchFollowingUsers(requestUser);
    await responseForSuccess(interaction, { followingUserNames: followingDiscordUsers.map((user) => user.toString()) });
  } catch (error) {
    await responseForFailed(interaction);
  }
}
