import { Awaitable, CommandInteraction, ContextMenuInteraction, Message, User } from "discord.js";
import { client } from "src/server/discord/client";
import { getUserInTargetGuild } from "src/server/discord/user";

export function onUserMenuSelected(
  name: string,
  listener: (interaction: ContextMenuInteraction, target: User) => Awaitable<void>
) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isContextMenu() || interaction.commandName !== name) return;
    const targetUser = await getUserInTargetGuild(interaction.targetId);
    if (!targetUser) return;
    await listener(interaction, targetUser);
  });
}

export function onMessageReceived(listener: (message: Message) => Awaitable<void>) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.channel.isText()) return;
    await listener(message);
  });
}

export function onDirectMessageReceived(listener: (message: Message) => Awaitable<void>) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || message.channel.type !== "DM") return;
    await listener(message);
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
  listener: (interaction: CommandInteraction) => Awaitable<void>
) {
  client.on("interactionCreate", async (interaction) => {
    if (
      !interaction.isCommand() ||
      interaction.commandName !== commandName ||
      interaction.options.getSubcommand() !== subCommandName ||
      !interaction.channel ||
      !interaction.channel.isText()
    )
      return;
    await listener(interaction);
  });
}
