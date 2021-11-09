import * as dotenv from "dotenv";

export type ApplicationSettings = {
  discordToken: string;
  targetGuildId: string;
  timelineChannelId: string;
  mainChannelId: string;
};

class SettingsManager {
  private _isLoaded = false;
  private _values: ApplicationSettings = {
    discordToken: "",
    targetGuildId: "",
    timelineChannelId: "",
    mainChannelId: ""
  };

  get values(): ApplicationSettings {
    if (!this._isLoaded) this.load();
    return this._values;
  }

  public load() {
    dotenv.config();
    this._values = {
      discordToken: SettingsManager.getEnvironmentVariable("DISCORD_TOKEN"),
      targetGuildId: SettingsManager.getEnvironmentVariable("TARGET_GUILD_ID"),
      timelineChannelId: SettingsManager.getEnvironmentVariable("TIMELINE_CHANNEL_ID"),
      mainChannelId: SettingsManager.getEnvironmentVariable("MAIN_CHANNEL_ID")
    };
  }

  private static getEnvironmentVariable(name: string): string {
    const value = process.env[name];
    if (!value) return "";
    return value;
  }
}

export const settingsManager = new SettingsManager();
