import { getUserReference } from "src/server/discord/user";
import { getPostEmbedBase, PostProps } from "src/server/views/post/index";

type AdditionalData = Pick<PostProps, "userId" | "favoriteCount" | "shareCount" | "upstreamURL">;
function getAdditionalDataView({ userId, favoriteCount, shareCount, upstreamURL }: AdditionalData): string {
  return [
    `👤 ${getUserReference(userId)}`,
    `❤ \`${favoriteCount}\` 🔁 \`${shareCount}\` 🔎 [here](${upstreamURL})`
  ].join("\n");
}

export type PostForFollowerProps = PostProps;
export function getPostForFollowerEmbed({
  userId,
  shareCount,
  favoriteCount,
  upstreamURL,
  ...props
}: PostForFollowerProps) {
  return getPostEmbedBase(props).addField(
    "about",
    getAdditionalDataView({ userId, shareCount, favoriteCount, upstreamURL })
  );
}
