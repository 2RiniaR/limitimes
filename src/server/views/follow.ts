import { ContextMenuInteraction } from "discord.js";

export async function responseForRequesterIsBot(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔あなたはbotですね？ bot風情が人間様を監視するなんて100年早いですよ？"
  });
}

export async function responseForTargetIsBot(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔あれはbotです！見ちゃいけません！"
  });
}

export async function responseForFollowingSelf(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔自分をフォローする気ですか？鏡ならばお風呂場にありますよ。"
  });
}

export async function responseForAlreadyFollowed(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content:
      "⛔あなたがその人を愛してやまない気持ちはわかりますが、フォローしている相手をフォローすることはできません。"
  });
}

export async function responseForFailed(interaction: ContextMenuInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔フォローに失敗しました。"
  });
}

export async function responseForSuccess(
  interaction: ContextMenuInteraction,
  { targetUserName }: { targetUserName: string }
) {
  await interaction.reply({ ephemeral: true, content: `🚩${targetUserName}をフォローしました！` });
}
