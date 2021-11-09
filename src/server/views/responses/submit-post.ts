import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyMessageOptions } from "discord.js";

export function failedToSendToTimeline(): ReplyMessageOptions {
  const message = "投稿に失敗しました。";
  return {
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  };
}

export function succeed({ upstreamURL }: { upstreamURL: string }): ReplyMessageOptions {
  const message = `投稿しました！\n${upstreamURL}`;
  return {
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  };
}
