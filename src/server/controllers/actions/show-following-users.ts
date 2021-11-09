import { CommandInteraction, InteractionReplyOptions, User as DiscordUser } from "discord.js";
import { User } from "src/server/models/user";
import { fetchFollowings } from "src/server/controllers/utils";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { failed, succeed } from "src/server/views/responses/show-following-users";

export type ShowFollowingUsersContext = {
  interaction: CommandInteraction;
  requester: DiscordUser;
};

export async function showFollowingUsers(ctx: ShowFollowingUsersContext): Promise<InteractionReplyOptions | null> {
  const response = await checkRegisterUser({ user: ctx.requester });
  if (response) return response;

  try {
    const requestUser = new User(ctx.requester.id);
    await requestUser.fetch();
    const followings = await fetchFollowings(requestUser);
    return succeed({ followingsName: followings.map((user) => user.toString()) });
  } catch (error) {
    return failed();
  }
}
