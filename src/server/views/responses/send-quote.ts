import { ReplyTarget } from "src/server/views";
import { getSystemMessageEmbed } from "src/server/views/system-message";
import { getQuoteEmbed, QuoteProps } from "src/server/views/quote";

export async function responseForMessageNotFound(interaction: ReplyTarget) {
  const message = "参照先のメッセージが見つかりませんでした。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "failed" }).setDescription(message)]
  });
}

export async function responseForFailed(interaction: ReplyTarget) {
  const message = "メッセージの参照を取得することに失敗しました。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}

export async function responseForSucceed(interaction: ReplyTarget, { quotes }: { quotes: QuoteProps[] }) {
  await interaction.reply({ embeds: quotes.map((quote) => getQuoteEmbed(quote)) });
}
