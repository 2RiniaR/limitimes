import { User } from "src/server/models/user";
import { User as DiscordUser } from "discord.js";
import { discordCache } from "src/server/discord/cache";

export async function fetchFollowerUsers(user: User): Promise<DiscordUser[]> {
  if (!user.followerUsers) throw Error();
  const followerUsersId = user.followerUsers.map((user) => user.id);
  return await fetchUsers(followerUsersId);
}

export async function fetchFollowingUsers(user: User): Promise<DiscordUser[]> {
  if (!user.followingUsers) throw Error();
  const followingUsersId = user.followingUsers.map((user) => user.id);
  return await fetchUsers(followingUsersId);
}

export async function fetchUsers(usersId: string[]): Promise<DiscordUser[]> {
  const users = await Promise.all(usersId.map((user) => fetchUser(user)));
  return users.removeNone();
}

async function fetchUser(userId: string): Promise<DiscordUser | null> {
  const targetGuild = await discordCache.getTargetGuild();
  const guildMember = await targetGuild.members.fetch(userId);
  return guildMember.user;
}
