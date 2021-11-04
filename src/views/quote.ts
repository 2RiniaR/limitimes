import { Message, MessageEmbed } from "discord.js";
import { getDisplayDate } from "src/views/date";

export type QuoteProps = {
  message: Message;
};

export function getQuoteEmbed({ message }: QuoteProps): MessageEmbed {
  const avatarURL = message.author.avatarURL();
  const embed = new MessageEmbed()
    .setDescription(message.content)
    .setColor("GREEN")
    .setAuthor(message.author.username, avatarURL ? avatarURL : undefined)
    .setFooter(getDisplayDate(message.createdAt));

  message.attachments.map((attachment) => attachment.url).forEach((url) => embed.setImage(url));
  return embed;
}
