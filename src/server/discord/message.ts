import { Message, TextChannel } from "discord.js";

declare module "discord.js" {
  interface Message {
    getAvatarURL(): string | undefined;
    getImagesURL(): string[];
    getGuildName(): string | undefined;
    getChannelName(): string | undefined;
  }
}

Message.prototype.getAvatarURL = function (this: Message): string | undefined {
  const avatarURL = this.author.avatarURL();
  return avatarURL ? avatarURL : this.author.defaultAvatarURL;
};

Message.prototype.getImagesURL = function (this: Message): string[] {
  return this.attachments.map((attachment) => attachment.url);
};

Message.prototype.getGuildName = function (this: Message): string | undefined {
  const name = this.guild?.name;
  return name ? name : undefined;
};

Message.prototype.getChannelName = function (this: Message): string | undefined {
  const channel = this.channel;
  if (!(channel instanceof TextChannel)) return undefined;
  return channel.name;
};
