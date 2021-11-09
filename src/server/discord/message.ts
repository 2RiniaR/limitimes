import { Message } from "discord.js";

declare module "discord.js" {
  interface Message {
    getImagesURL(): string[];
  }
}

Message.prototype.getImagesURL = function (this: Message): string[] {
  return this.attachments.map((attachment) => attachment.url);
};
