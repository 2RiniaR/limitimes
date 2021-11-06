import { client } from "src/server/discord";
import { ContextMenuInteraction, User as DiscordUser } from "discord.js";
import { AlreadyFollowedError, FollowingSelfError, User } from "src/server/models/user";
import { settings } from "src/server/settings";
import {
  responseForAlreadyFollowed,
  responseForFailed,
  responseForFollowingSelf,
  responseForSuccess
} from "src/server/views/follow";
import { checkRegisterUser } from "src/server/controllers/register-user";

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isContextMenu() || interaction.commandName !== "follow") return;
  const targetGuild = await client.guilds.fetch(settings.values.targetGuildId);
  const targetGuildMember = await targetGuild.members.fetch(interaction.targetId);
  const targetUser = targetGuildMember.user;
  await followUser({
    interaction: interaction,
    requestDiscordUser: interaction.user,
    targetDiscordUser: targetUser
  });
});

export type FollowUserContext = {
  interaction: ContextMenuInteraction;
  requestDiscordUser: DiscordUser;
  targetDiscordUser: DiscordUser;
};

export async function followUser({ interaction, requestDiscordUser, targetDiscordUser }: FollowUserContext) {
  if (
    !(await checkRegisterUser(interaction, requestDiscordUser)) ||
    !(await checkRegisterUser(interaction, targetDiscordUser))
  )
    return;

  if (requestDiscordUser.id === targetDiscordUser.id) {
    await responseForFollowingSelf(interaction);
    return;
  }

  try {
    const requestUser = new User(requestDiscordUser.id);
    const targetUser = new User(targetDiscordUser.id);
    requestUser.fetch();
    requestUser.followUser(targetUser);
    requestUser.update();

    await responseForSuccess(interaction, { targetUserName: targetDiscordUser.toString() });
  } catch (error) {
    if (error instanceof FollowingSelfError) await responseForFollowingSelf(interaction);
    else if (error instanceof AlreadyFollowedError) await responseForAlreadyFollowed(interaction);
    else await responseForFailed(interaction);
  }
}
