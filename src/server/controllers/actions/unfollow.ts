import { GuildMember } from "discord.js";
import { UnfollowTargetNotFoundError } from "src/server/models/user";
import { failed, targetIsNotFollowed, succeed } from "src/server/views/responses/unfollow";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { userService } from "src/server/models";

export type UnfollowContext = {
  requester: GuildMember;
  target: GuildMember;
};

export async function unfollow(ctx: UnfollowContext) {
  const response =
    (await checkRegisterUser({ member: ctx.requester })) ?? (await checkRegisterUser({ member: ctx.target }));
  if (response) return response;

  const requester = userService.get(ctx.requester.id);
  const target = userService.get(ctx.target.id);

  try {
    await requester.unfollow(target);
    return succeed({ targetName: ctx.target.toString() });
  } catch (error) {
    if (error instanceof UnfollowTargetNotFoundError) return targetIsNotFollowed();
    console.error(error);
    return failed();
  }
}
