import { MessageEmbed } from "discord.js";

export type PostProps = {
  content: string;
  imagesURL: string[];
  userName: string;
  userAvatarURL?: string;
  userId: string;
  createdAt: Date;
  upstreamURL?: string;
  favoriteCount: number;
  shareCount: number;
};

export type PostEmbedBaseProps = Pick<PostProps, "content" | "imagesURL" | "userName" | "userAvatarURL" | "createdAt">;
export function getPostEmbedBase({
  content,
  imagesURL,
  userName,
  userAvatarURL,
  createdAt
}: PostEmbedBaseProps): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor("AQUA")
    .setDescription(content)
    .setAuthor(userName, userAvatarURL)
    .setTimestamp(createdAt);
  imagesURL.forEach((url) => embed.setImage(url));
  return embed;
}

export { getPostForTimelineEmbed } from "./timeline";
export { getPostForFollowerEmbed } from "./follower";
