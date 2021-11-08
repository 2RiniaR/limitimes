import { MessageEmbed } from "discord.js";

export type QuoteProps = {
  content: string;
  imagesURL: string[];
  userName: string;
  userAvatarURL?: string;
  guildName?: string;
  channelName?: string;
  createdAt: Date;
};

export function getQuoteEmbed({
  content,
  imagesURL,
  userName,
  userAvatarURL,
  guildName,
  channelName,
  createdAt
}: QuoteProps): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor("BLUE")
    .setDescription(content)
    .setAuthor(userName, userAvatarURL)
    .setFooter([guildName, channelName].join("    "))
    .setTimestamp(createdAt);
  imagesURL.forEach((url) => embed.setImage(url));
  return embed;
}
