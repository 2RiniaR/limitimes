import { User as DiscordUser } from "discord.js";
import { discordCache } from "src/server/discord/cache";

export function getUserReference(id: string): string {
  return `<@${id}>`;
}

export async function getUserInTargetGuild(id: string): Promise<DiscordUser | null> {
  const targetGuild = await discordCache.getTargetGuild();
  const targetGuildMember = await targetGuild.members.fetch(id);
  return targetGuildMember.user;
}
