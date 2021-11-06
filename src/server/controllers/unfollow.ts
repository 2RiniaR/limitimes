import { client } from "src/server/discord";
import { ContextMenuInteraction, User as DiscordUser } from "discord.js";
import { UnfollowTargetNotFoundError, User } from "src/server/models/user";
import { settings } from "src/server/settings";
import {
  responseForFailed,
  responseForTargetIsNotFollowed,
  responseForRequesterIsBot,
  responseForSuccess
} from "src/server/views/unfollow";

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isContextMenu() || interaction.commandName !== "unfollow") return;
  const targetGuild = await client.guilds.fetch(settings.values.targetGuildId);
  const targetGuildMember = await targetGuild.members.fetch(interaction.targetId);
  const targetUser = targetGuildMember.user;
  await unfollowUser({
    interaction: interaction,
    requestDiscordUser: interaction.user,
    targetDiscordUser: targetUser
  });
});

export type UnfollowUserContext = {
  interaction: ContextMenuInteraction;
  requestDiscordUser: DiscordUser;
  targetDiscordUser: DiscordUser;
};

export async function unfollowUser({ interaction, requestDiscordUser, targetDiscordUser }: UnfollowUserContext) {
  if (requestDiscordUser.bot) {
    await responseForRequesterIsBot(interaction);
    return;
  }

  try {
    const requestUser = new User(requestDiscordUser.id);
    if (!requestUser.isExist()) requestUser.create();
    else requestUser.fetch();

    const targetUser = new User(targetDiscordUser.id);
    if (!targetUser.isExist()) targetUser.create();

    requestUser.unfollowUser(targetUser);
    requestUser.update();
  } catch (error) {
    if (error instanceof UnfollowTargetNotFoundError) {
      await responseForTargetIsNotFollowed(interaction);
    } else {
      await responseForFailed(interaction);
    }
    return;
  }

  await responseForSuccess(interaction, { targetUserName: targetDiscordUser.toString() });
}
