import { getSystemMessageEmbed } from "src/server/views/system-message";
import { InteractionReplyOptions } from "discord.js";

export function userIsBot({ userName }: { userName: string }): InteractionReplyOptions {
  const message = `ごめんなさい。当システムはbotお断りなんです。\n${userName}`;
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  };
}

export function userIsNotJoinedToTargetGuild({ userName }: { userName: string }): InteractionReplyOptions {
  const message = `当システムを利用するには、当システムを利用しているサーバーに参加する必要があります。\n${userName}`;
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  };
}

export function failed({ userName }: { userName: string }): InteractionReplyOptions {
  const message = `ユーザーの登録に失敗しました。\n${userName}`;
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  };
}
