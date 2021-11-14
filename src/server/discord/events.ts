import { Awaitable, CommandInteraction, ContextMenuInteraction, GuildMember, Message } from "discord.js";
import { clientManager, targetGuildManager } from "src/server/discord";

export function onUserMenuSelected(
  name: string,
  listener: (ctx: {
    interaction: ContextMenuInteraction;
    requester: GuildMember;
    target: GuildMember;
  }) => Awaitable<void>
) {
  clientManager.client.on("interactionCreate", async (interaction) => {
    if (!interaction.isContextMenu() || interaction.commandName !== name) return;
    const requester = await targetGuildManager.getMember(interaction.user.id);
    const target = await targetGuildManager.getMember(interaction.targetId);
    if (!requester || !target) return;
    await listener({ interaction, requester, target });
  });
}

export function onDirectMessageReceived(listener: (ctx: { message: Message; author: GuildMember }) => Awaitable<void>) {
  clientManager.client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.type !== "DM") return;
    const author = await targetGuildManager.getMember(message.author.id);
    if (!author) return;
    await listener({ message, author });
  });
}

export function onSlashCommandReceived(
  {
    commandName,
    subCommandName
  }: {
    commandName: string;
    subCommandName: string;
  },
  listener: (ctx: { interaction: CommandInteraction; requester: GuildMember }) => Awaitable<void>
) {
  clientManager.client.on("interactionCreate", async (interaction) => {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== commandName ||
      interaction.options.getSubcommand() !== subCommandName ||
      !interaction.channel ||
      !interaction.channel.isText()
    )
      return;
    const requester = await targetGuildManager.getMember(interaction.user.id);
    if (!requester) return;
    await listener({ interaction, requester });
  });
}
