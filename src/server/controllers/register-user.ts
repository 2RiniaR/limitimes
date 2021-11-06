import { User as DiscordUser } from "discord.js";
import { User } from "src/server/models/user";
import { client } from "src/server/discord";
import { settings } from "src/server/settings";
import {
  responseForUserIsBot,
  responseForUserIsNotJoinedToTargetGuild,
  responseForFailed
} from "src/server/views/register-user";
import { ReplyTarget } from "src/server/views";

export type RegisterUserContext = {
  discordUser: DiscordUser;
};

export class BotCanNotRegisteredError extends Error {}
export class UserIsNotJoinedToTargetGuildError extends Error {}

async function isJoinedToTargetGuild(user: DiscordUser): Promise<boolean> {
  const targetGuild = await client.guilds.fetch(settings.values.targetGuildId);
  const member = await targetGuild.members.fetch(user);
  return !!member;
}

export async function registerUserIfNotExist({ discordUser }: RegisterUserContext) {
  const requestUser = new User(discordUser.id);
  if (requestUser.isExist()) return;
  if (discordUser.bot) throw new BotCanNotRegisteredError();
  if (!(await isJoinedToTargetGuild(discordUser))) throw new UserIsNotJoinedToTargetGuildError();
  requestUser.create();
}

export async function checkRegisterUser(interaction: ReplyTarget, user: DiscordUser): Promise<boolean> {
  try {
    await registerUserIfNotExist({ discordUser: user });
    return true;
  } catch (error) {
    if (error instanceof BotCanNotRegisteredError) {
      await responseForUserIsBot(interaction, { userName: user.toString() });
    } else if (error instanceof UserIsNotJoinedToTargetGuildError) {
      await responseForUserIsNotJoinedToTargetGuild(interaction, { userName: user.toString() });
    } else {
      await responseForFailed(interaction, { userName: user.toString() });
    }
    return false;
  }
}
