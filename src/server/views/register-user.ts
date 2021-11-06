import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyTarget } from "src/server/views/index";

export async function responseForUserIsBot(interaction: ReplyTarget, { userName }: { userName: string }) {
  const message = `ごめんなさい。当システムはbotお断りなんです。\n${userName}`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  });
}

export async function responseForUserIsNotJoinedToTargetGuild(
  interaction: ReplyTarget,
  { userName }: { userName: string }
) {
  const message = `当システムを利用するには、当システムを利用しているサーバーに参加する必要があります。\n${userName}`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "invalid" }).setDescription(message)]
  });
}

export async function responseForFailed(interaction: ReplyTarget, { userName }: { userName: string }) {
  const message = `ユーザーの登録に失敗しました。\n${userName}`;
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}
