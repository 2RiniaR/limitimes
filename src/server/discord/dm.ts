import { DMChannel, User as DiscordUser } from "discord.js";

export async function getDMChannel(user: DiscordUser): Promise<DMChannel> {
  return user.dmChannel ? user.dmChannel : await user.createDM();
}
