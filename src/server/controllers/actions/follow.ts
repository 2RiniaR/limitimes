import { InteractionReplyOptions, User as DiscordUser } from "discord.js";
import { AlreadyFollowedError, FollowingSelfError, User } from "src/server/models/user";
import { alreadyFollowed, failed, followingSelf, succeed } from "src/server/views/responses/follow";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";

export type FollowContext = {
  requester: DiscordUser;
  target: DiscordUser;
};

export async function follow(ctx: FollowContext): Promise<InteractionReplyOptions | null> {
  const response =
    (await checkRegisterUser({ user: ctx.requester })) ?? (await checkRegisterUser({ user: ctx.target }));
  if (response) return response;
  if (ctx.requester.id === ctx.target.id) return followingSelf();

  const requester = new User(ctx.requester.id);
  const target = new User(ctx.target.id);

  try {
    await requester.fetch();
    requester.follow(target);
    await requester.update();
    return succeed({ targetName: ctx.target.toString() });
  } catch (error) {
    if (error instanceof FollowingSelfError) return followingSelf();
    else if (error instanceof AlreadyFollowedError) return alreadyFollowed();
    else return failed();
  }
}
