import { InteractionReplyOptions, GuildMember } from "discord.js";
import { User } from "src/server/models/user";
import { userIsBot, userIsNotJoinedToTargetGuild, failed } from "src/server/views/responses/register-user";
import { targetGuildManager } from "src/server/discord";

export type CheckRegisterUserContext = {
  member: GuildMember;
};

export class BotCanNotRegisteredError extends Error {}
export class UserIsNotJoinedToTargetGuildError extends Error {}

export async function registerUserIfNotExist({ member }: CheckRegisterUserContext) {
  const requester = new User(member.id);
  if (await requester.exists()) return;
  if (member.user.bot) throw new BotCanNotRegisteredError();
  if (!(await targetGuildManager.getMember(member.id))) throw new UserIsNotJoinedToTargetGuildError();
  await requester.create();
}

export async function checkRegisterUser(ctx: CheckRegisterUserContext): Promise<InteractionReplyOptions | null> {
  try {
    await registerUserIfNotExist(ctx);
    return null;
  } catch (error) {
    if (error instanceof BotCanNotRegisteredError) return userIsBot({ userName: ctx.member.toString() });
    if (error instanceof UserIsNotJoinedToTargetGuildError)
      return userIsNotJoinedToTargetGuild({ userName: ctx.member.toString() });
    console.error(error);
    return failed({ userName: ctx.member.toString() });
  }
}
