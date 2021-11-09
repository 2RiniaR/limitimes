import { Message, ReplyMessageOptions } from "discord.js";
import { succeed } from "src/server/views/responses/send-quote";
import { QuoteProps } from "src/server/views/quote";
import {
  ChannelNotFoundError,
  fetchMessage,
  findMessageReferences,
  MessageNotFoundError
} from "src/server/discord/message-reference";

export type SendQuoteContext = {
  message: Message;
};

// 送信されたメッセージから、メッセージリンク部分をすべて探し出し、それらの中身をEmbedとして返信する
export async function sendQuote(ctx: SendQuoteContext): Promise<ReplyMessageOptions | null> {
  const refs = findMessageReferences(ctx.message.content);
  const quotes: QuoteProps[] = [];

  for (const ref of refs) {
    try {
      const message = await fetchMessage(ref);
      quotes.push({
        content: message.content,
        imagesURL: message.getImagesURL(),
        userName: message.author.username,
        userAvatarURL: message.author.displayAvatarURL(),
        channelName: message.channel.toString(),
        createdAt: message.createdAt
      });
    } catch (error) {
      if (!(error instanceof ChannelNotFoundError || error instanceof MessageNotFoundError)) {
        console.error(error);
        return null;
      }
    }
  }

  if (quotes.length === 0) return null;
  return succeed({ quotes });
}
