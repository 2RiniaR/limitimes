import { ContextMenuInteraction } from "discord.js";

export async function responseForRequesterIsBot(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔あなたはbotですね？"
  });
}

export async function responseForTargetIsNotFollowed(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔あなたはその人をフォローしていません。"
  });
}

export async function responseForFailed(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔フォローの解除に失敗しました。"
  });
}

export async function responseForSuccess(
  interaction: ContextMenuInteraction,
  { targetUserName }: { targetUserName: string }
) {
  await interaction.reply({ ephemeral: true, content: `🚩${targetUserName}のフォローを解除しました。` });
}
