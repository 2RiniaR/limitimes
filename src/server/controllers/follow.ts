import { client } from "src/server/discord";
import { ContextMenuInteraction, User as DiscordUser } from "discord.js";
import { AlreadyFollowedError, FollowingSelfError, User } from "src/server/models/user";
import { settings } from "src/server/settings";
import {
  responseForAlreadyFollowed,
  responseForFailed,
  responseForFollowingSelf,
  responseForRequesterIsBot,
  responseForSuccess,
  responseForTargetIsBot
} from "src/server/views/follow";

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
  if (requestDiscordUser.bot) {
    await responseForRequesterIsBot(interaction);
    return;
  }

  if (targetDiscordUser.bot) {
    await responseForTargetIsBot(interaction);
    return;
  }

  if (requestDiscordUser.id === targetDiscordUser.id) {
    await responseForFollowingSelf(interaction);
    return;
  }

  try {
    const requestUser = new User(requestDiscordUser.id);
    if (!requestUser.isExist()) requestUser.create();
    else requestUser.fetch();

    const targetUser = new User(targetDiscordUser.id);
    if (!targetUser.isExist()) targetUser.create();

    requestUser.followUser(targetUser);
    requestUser.update();
  } catch (error) {
    if (error instanceof FollowingSelfError) {
      await responseForTargetIsBot(interaction);
    } else if (error instanceof AlreadyFollowedError) {
      await responseForAlreadyFollowed(interaction);
    } else {
      await responseForFailed(interaction);
    }
    return;
  }

  await responseForSuccess(interaction, { targetUserName: targetDiscordUser.toString() });
}
