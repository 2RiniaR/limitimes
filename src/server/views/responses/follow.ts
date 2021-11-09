import { getSystemMessageEmbed } from "src/server/views/system-message";
import { InteractionReplyOptions } from "discord.js";

export function followingSelf(): InteractionReplyOptions {
  const message = "自分をフォローする気ですか？鏡ならばお風呂場にありますよ。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  };
}

export function alreadyFollowed(): InteractionReplyOptions {
  const message =
    "あなたがその人を愛してやまない気持ちはわかりますが、フォローしている相手をフォローすることはできません。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  };
}

export function failed(): InteractionReplyOptions {
  const message = "フォローに失敗しました。";
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  };
}

export function succeed({ targetName }: { targetName: string }): InteractionReplyOptions {
  const message = `${targetName}をフォローしました！`;
  return {
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  };
}
