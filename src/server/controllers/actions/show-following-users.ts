import { CommandInteraction, GuildMember, InteractionReplyOptions } from "discord.js";
import { User } from "src/server/models/user";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { failed, succeed } from "src/server/views/responses/show-following-users";
import { targetGuildManager } from "src/server/discord";
import { userService } from "src/server/models";

export type ShowFollowingUsersContext = {
  interaction: CommandInteraction;
  requester: GuildMember;
};

async function fetchFollowings(user: User): Promise<GuildMember[]> {
  const followings = await user.getFollowings();
  const followingsId = followings.map((user) => user.id);
  return await targetGuildManager.getMembers(followingsId);
}

export async function showFollowingUsers(ctx: ShowFollowingUsersContext): Promise<InteractionReplyOptions | null> {
  const response = await checkRegisterUser({ member: ctx.requester });
  if (response) return response;

  const requestUser = userService.get(ctx.requester.id);

  try {
    const followings = await fetchFollowings(requestUser);
    return succeed({ followingsName: followings.map((user) => user.toString()) });
  } catch (error) {
    console.error(error);
    return failed();
  }
}
