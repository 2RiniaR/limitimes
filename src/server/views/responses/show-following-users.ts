import { getSystemMessageEmbed } from "src/server/views/system-message";
import { InteractionReplyOptions } from "discord.js";

export function failed(): InteractionReplyOptions {
  const message = "フォロー中のユーザー一覧を取得することに失敗しました。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  };
}

export function succeed({ followingsName }: { followingsName: string[] }): InteractionReplyOptions {
  return {
    ephemeral: true,
    embeds: [
      getSystemMessageEmbed({ type: "succeed" })
        .setTitle("フォロー中")
        .setDescription(followingsName.join("\n"))
        .setFooter(`合計 ${followingsName.length}人`)
    ]
  };
}
