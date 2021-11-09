import { MessageEmbed } from "discord.js";
import { getUserReference } from "src/server/discord/user";
import { getPostEmbedBase, PostProps } from "src/server/views/post/index";

type AdditionalData = Pick<PostProps, "userId" | "favoriteCount" | "shareCount">;
function getAdditionalDataView({ userId, favoriteCount, shareCount }: AdditionalData): string {
  return `❤ \`${favoriteCount}\` 🔁 \`${shareCount}\` 👤 ${getUserReference(userId)}`;
}

export type PostForTimelineProps = Omit<PostProps, "upstreamURL">;
export function getPostForTimelineEmbed({
  userId,
  shareCount,
  favoriteCount,
  ...props
}: PostForTimelineProps): MessageEmbed {
  return getPostEmbedBase(props).addField("about", getAdditionalDataView({ userId, shareCount, favoriteCount }));
}
