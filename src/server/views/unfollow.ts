import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyTarget } from "src/server/views/index";

export async function responseForTargetIsNotFollowed(interaction: ReplyTarget) {
  const message = "あなたはその人をフォローしていません。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  });
}

export async function responseForFailed(interaction: ReplyTarget) {
  const message = "フォローの解除に失敗しました。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}

export async function responseForSucceed(interaction: ReplyTarget, { targetUserName }: { targetUserName: string }) {
  const message = `${targetUserName}のフォローを解除しました。`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  });
}
