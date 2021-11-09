import { InteractionReplyOptions, User as DiscordUser } from "discord.js";
import { User } from "src/server/models/user";
import { userIsBot, userIsNotJoinedToTargetGuild, failed } from "src/server/views/responses/register-user";
import { discordCache } from "src/server/discord/cache";

export type CheckRegisterUserContext = {
  user: DiscordUser;
};

export class BotCanNotRegisteredError extends Error {}
export class UserIsNotJoinedToTargetGuildError extends Error {}

async function isJoinedToTargetGuild(user: DiscordUser): Promise<boolean> {
  const targetGuild = await discordCache.getTargetGuild();
  const member = await targetGuild.members.fetch(user);
  return !!member;
}

export async function registerUserIfNotExist({ user }: CheckRegisterUserContext) {
  const requestUser = new User(user.id);
  if (await requestUser.exists()) return;
  if (user.bot) throw new BotCanNotRegisteredError();
  if (!(await isJoinedToTargetGuild(user))) throw new UserIsNotJoinedToTargetGuildError();
  await requestUser.create();
}

export async function checkRegisterUser(ctx: CheckRegisterUserContext): Promise<InteractionReplyOptions | null> {
  try {
    await registerUserIfNotExist(ctx);
    return null;
  } catch (error) {
    if (error instanceof BotCanNotRegisteredError) return userIsBot({ userName: ctx.user.toString() });
    if (error instanceof UserIsNotJoinedToTargetGuildError)
      return userIsNotJoinedToTargetGuild({ userName: ctx.user.toString() });
    return failed({ userName: ctx.user.toString() });
  }
}
