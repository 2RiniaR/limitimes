import { getSystemMessageEmbed } from "src/server/views/system-message";
import { InteractionReplyOptions } from "discord.js";

export function targetIsNotFollowed(): InteractionReplyOptions {
  const message = "あなたはその人をフォローしていません。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  };
}

export function failed(): InteractionReplyOptions {
  const message = "フォローの解除に失敗しました。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  };
}

export function succeed({ targetName }: { targetName: string }): InteractionReplyOptions {
  const message = `${targetName}のフォローを解除しました。`;
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  };
}
