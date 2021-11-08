import { client } from "src/server/discord";
import { ContextMenuInteraction, User as DiscordUser } from "discord.js";
import { UnfollowTargetNotFoundError, User } from "src/server/models/user";
import { settings } from "src/server/settings";
import {
  responseForFailed,
  responseForTargetIsNotFollowed,
  responseForSucceed
} from "src/server/views/responses/unfollow";
import { checkRegisterUser } from "src/server/controllers/register-user";

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
  if (
    !(await checkRegisterUser(interaction, requestDiscordUser)) ||
    !(await checkRegisterUser(interaction, targetDiscordUser))
  )
    return;

  try {
    const requestUser = new User(requestDiscordUser.id);
    const targetUser = new User(targetDiscordUser.id);
    await requestUser.fetch();
    requestUser.unfollowUser(targetUser);
    await requestUser.update();

    await responseForSucceed(interaction, { targetUserName: targetDiscordUser.toString() });
  } catch (error) {
    if (error instanceof UnfollowTargetNotFoundError) await responseForTargetIsNotFollowed(interaction);
    else await responseForFailed(interaction);
  }
}
