import { Guild, TextChannel } from "discord.js";
import { client } from "src/server/discord/index";
import { settings } from "src/server/settings";

class DiscordCache {
  private targetGuild?: Guild;
  private timelineChannel?: TextChannel;

  public async getTargetGuild(): Promise<Guild> {
    if (!this.targetGuild) {
      this.targetGuild = await client.guilds.fetch(settings.values.targetGuildId);
    }
    return this.targetGuild;
  }

  public async getTimelineChannel(): Promise<TextChannel> {
    if (!this.timelineChannel) {
      const guild = await this.getTargetGuild();
      const channel = await guild.channels.fetch(settings.values.timelineChannelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw Error("Timeline channel is not found or not text channel.");
      }
      this.timelineChannel = channel;
    }
    return this.timelineChannel;
  }
}

export const discordCache = new DiscordCache();
