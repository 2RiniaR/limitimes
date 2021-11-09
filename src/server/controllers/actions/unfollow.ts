import { GuildMember } from "discord.js";
import { UnfollowTargetNotFoundError, User } from "src/server/models/user";
import { failed, targetIsNotFollowed, succeed } from "src/server/views/responses/unfollow";
import { followingSelf } from "src/server/views/responses/follow";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";

export type UnfollowContext = {
  requester: GuildMember;
  target: GuildMember;
};

export async function unfollow(ctx: UnfollowContext) {
  const response =
    (await checkRegisterUser({ member: ctx.requester })) ?? (await checkRegisterUser({ member: ctx.target }));
  if (response) return response;
  if (ctx.requester.id === ctx.target.id) return followingSelf();

  const requester = new User(ctx.requester.id);
  const target = new User(ctx.target.id);

  try {
    await requester.fetch();
    requester.unfollow(target);
    await requester.update();
    return succeed({ targetName: ctx.target.toString() });
  } catch (error) {
    if (error instanceof UnfollowTargetNotFoundError) return targetIsNotFollowed();
    console.error(error);
    return failed();
  }
}
