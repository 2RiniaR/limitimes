import { CommandInteraction, MessageEmbed } from "discord.js";

export async function responseForRequesterIsBot(interaction: CommandInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔あなたはbotですね？"
  });
}

export async function responseForFailed(interaction: CommandInteraction) {
  await interaction.reply({
    ephemeral: true,
    content: "⛔フォローに失敗しました。"
  });
}

export async function responseForSuccess(
  interaction: CommandInteraction,
  { followingUserNames }: { followingUserNames: string[] }
) {
  await interaction.reply({
    ephemeral: true,
    embeds: [
      new MessageEmbed()
        .setTitle("フォロー中")
        .setColor("GREEN")
        .setDescription(followingUserNames.join("\n"))
        .setFooter(`合計 ${followingUserNames.length}人`)
    ]
  });
}
