import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyTarget } from "src/server/views";

export async function responseForFollowingSelf(interaction: ReplyTarget) {
  const message = "自分をフォローする気ですか？鏡ならばお風呂場にありますよ。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  });
}

export async function responseForAlreadyFollowed(interaction: ReplyTarget) {
  const message =
    "あなたがその人を愛してやまない気持ちはわかりますが、フォローしている相手をフォローすることはできません。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  });
}

export async function responseForFailed(interaction: ReplyTarget) {
  const message = "フォローに失敗しました。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}

export async function responseForSucceed(interaction: ReplyTarget, { targetUserName }: { targetUserName: string }) {
  const message = `${targetUserName}をフォローしました！`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  });
}
