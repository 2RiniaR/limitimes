import { GuildMember, InteractionReplyOptions } from "discord.js";
import { AlreadyFollowedError, FollowingSelfError } from "src/server/models/user";
import { alreadyFollowed, failed, followingSelf, succeed } from "src/server/views/responses/follow";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { userService } from "src/server/models";

export type FollowContext = {
  requester: GuildMember;
  target: GuildMember;
};

export async function follow(ctx: FollowContext): Promise<InteractionReplyOptions | null> {
  const response =
    (await checkRegisterUser({ member: ctx.requester })) ?? (await checkRegisterUser({ member: ctx.target }));
  if (response) return response;

  const requester = userService.get(ctx.requester.id);
  const target = userService.get(ctx.target.id);

  try {
    await requester.follow(target);
    return succeed({ targetName: ctx.target.toString() });
  } catch (error) {
    if (error instanceof FollowingSelfError) return followingSelf();
    if (error instanceof AlreadyFollowedError) return alreadyFollowed();
    console.error(error);
    return failed();
  }
}
