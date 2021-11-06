import { MessageEmbed } from "discord.js";
import { ReplyTarget } from "src/server/views/index";
import { getSystemMessageEmbed } from "src/server/views/system-message";

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

export type QuoteProps = {
  content: string;
  imagesURL: string[];
  userName: string;
  userAvatarURL?: string;
  guildName?: string;
  channelName?: string;
  createdAt: Date;
};

function getQuoteEmbed({
  content,
  imagesURL,
  userName,
  userAvatarURL,
  guildName,
  channelName,
  createdAt
}: QuoteProps): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor("BLUE")
    .setDescription(content)
    .setAuthor(userName, userAvatarURL)
    .setFooter([guildName, channelName].join("    "))
    .setTimestamp(createdAt);
  imagesURL.forEach((url) => embed.setImage(url));
  return embed;
}

export type ResponseForSucceedProps = {
  quotes: QuoteProps[];
};

export async function responseForSucceed(interaction: ReplyTarget, { quotes }: ResponseForSucceedProps) {
  await interaction.reply({
    ephemeral: true,
    embeds: quotes.map((quote) => getQuoteEmbed(quote))
  });
}
