import * as dotenv from "dotenv";

export type ApplicationSettings = {
  discord_token: string;
};

class SettingsProvider {
  private _isLoaded = false;
  private _settings: ApplicationSettings = {
    discord_token: ""
  };

  get settings(): ApplicationSettings {
    if (!this._isLoaded) this.load();
    return this._settings;
  }

  public load() {
    dotenv.config();
    this._settings = {
      discord_token: process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : ""
    };
  }
}

export const provider = new SettingsProvider();
