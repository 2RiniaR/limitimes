import { Client, Guild, GuildMember, TextChannel } from "discord.js";
import { settingsManager } from "src/server/settings";

export class TargetGuildManager {
  private readonly client: Client;
  private targetGuild?: Guild;
  private timelineChannel?: TextChannel;

  constructor(client: Client) {
    this.client = client;
  }

  public async getTargetGuild(): Promise<Guild> {
    if (!this.targetGuild) {
      this.targetGuild = await this.client.guilds.fetch(settingsManager.values.targetGuildId);
    }
    return this.targetGuild;
  }

  public async getTimelineChannel(): Promise<TextChannel> {
    if (!this.timelineChannel) {
      const guild = await this.getTargetGuild();
      const channel = await guild.channels.fetch(settingsManager.values.timelineChannelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw Error("Timeline channel is not found or not text channel.");
      }
      this.timelineChannel = channel;
    }
    return this.timelineChannel;
  }

  public async getMember(id: string): Promise<GuildMember | null> {
    const guild = await this.getTargetGuild();

    try {
      return await guild.members.fetch(id);
    } catch (error) {
      return null;
    }
  }

  public async getMembers(id: string[]): Promise<GuildMember[]> {
    const guild = await this.getTargetGuild();
    const result = await guild.members.fetch({ user: id });
    return Array.from(result.values());
  }
}
