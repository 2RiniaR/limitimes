import { getSystemMessageEmbed } from "src/server/views/system-message";
import { ReplyTarget } from "src/server/views";

export async function responseForFailed(interaction: ReplyTarget) {
  const message = "フォロー中のユーザー一覧を取得することに失敗しました。";
  await interaction.reply({
    ephemeral: true,
    embeds: [getSystemMessageEmbed({ type: "error" }).setDescription(message)]
  });
}

export async function responseForSucceed(
  interaction: ReplyTarget,
  { followingUserNames }: { followingUserNames: string[] }
) {
  await interaction.reply({
    ephemeral: true,
    embeds: [
      getSystemMessageEmbed({ type: "succeed" })
        .setTitle("フォロー中")
        .setDescription(followingUserNames.join("\n"))
        .setFooter(`合計 ${followingUserNames.length}人`)
    ]
  });
}
