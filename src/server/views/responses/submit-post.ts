import { ReplyMessageOptions } from "discord.js";
import { PostForFollowerProps } from "src/server/views/post/follower";
import { getPostForTimelineEmbed } from "src/server/views/post";

export function failedToSendToTimeline(): ReplyMessageOptions {
  const message = "⛔投稿に失敗しました。";
  return { content: message };
}

export function succeed(props: PostForFollowerProps): ReplyMessageOptions {
  const message = "✅投稿しました！";
  return {
    content: message,
    embeds: [getPostForTimelineEmbed(props)]
  };
}
