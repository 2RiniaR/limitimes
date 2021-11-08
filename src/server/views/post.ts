import { MessageEmbed } from "discord.js";

export type PostForTimelineProps = {
  content: string;
  imagesURL: string[];
  userName: string;
  userAvatarURL?: string;
  createdAt: Date;
};

export function getPostForTimelineEmbed({
  content,
  imagesURL,
  userName,
  userAvatarURL,
  createdAt
}: PostForTimelineProps): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor("BLUE")
    .setDescription(content)
    .setAuthor(userName, userAvatarURL)
    .setTimestamp(createdAt);
  imagesURL.forEach((url) => embed.setImage(url));
  return embed;
}

export type PostForFollowerProps = PostForTimelineProps & {
  upstreamURL: string;
};

export function getPostForFollowerEmbed({ upstreamURL, ...props }: PostForFollowerProps) {
  return getPostForTimelineEmbed(props).addField("upstream", upstreamURL);
}
