import { TextChannel } from "discord.js";
import { client } from "src/discord-bot";

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.channel.isText()) return;
  return sendQuote({
    messageText: message.content,
    channel: message.channel as TextChannel
  });
});

export type SendQuoteContext = {
  messageText: string;
  channel: TextChannel;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendQuote(context: SendQuoteContext) {
  // ToDo: メッセージ引用をEmbedとして送信する
  // メッセージからメッセージ引用を取り出す
  // 内容をEmbedとして送信する
}
