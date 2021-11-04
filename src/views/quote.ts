import { Message, MessageEmbed, TextChannel } from "discord.js";

export type QuoteProps = {
  message: Message;
};

function getGuildName(message: Message): string | null {
  const name = message.guild?.name;
  return name ? name : null;
}

function getChannelName(message: Message): string | null {
  const channel = message.channel;
  if (!(channel instanceof TextChannel)) return null;
  return channel.name;
}

function getChannelView(message: Message): string {
  const guildName = getGuildName(message);
  const channelName = getChannelName(message);
  return [guildName, channelName].join("    ");
}

export function getQuoteEmbed({ message }: QuoteProps): MessageEmbed {
  const avatarURL = message.author.avatarURL();
  const embed = new MessageEmbed()
    .setDescription(message.content)
    .setColor("GREEN")
    .setAuthor(message.author.username, avatarURL ? avatarURL : undefined)
    .setFooter(getChannelView(message))
    .setTimestamp(message.createdAt);

  message.attachments.map((attachment) => attachment.url).forEach((url) => embed.setImage(url));
  return embed;
}
