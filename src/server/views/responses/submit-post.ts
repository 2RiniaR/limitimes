import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyTarget } from "src/server/views";

export async function responseForFailedToSendToTimeline(interaction: ReplyTarget) {
  const message = "投稿に失敗しました。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}

export async function responseForSucceed(interaction: ReplyTarget, { upstreamURL }: { upstreamURL: string }) {
  const message = `投稿しました！\n${upstreamURL}`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "succeed" }).setDescription(message)]
  });
}
