import { Message, ReplyMessageOptions } from "discord.js";
import { client } from "src/server/discord";
import { succeed } from "src/server/views/responses/send-quote";
import { MessageReference, findMessageReferencesFromText } from "src/server/helpers/find-message-refs";
import { QuoteProps } from "src/server/views/quote";

export type SendQuoteContext = {
  message: Message;
};
class ChannelNotFoundError extends Error {}
class MessageNotFoundError extends Error {}

// メッセージの参照情報から、参照先メッセージの実体を取得する
async function fetchMessageFromReference({ channelId, messageId }: MessageReference): Promise<Message> {
  const channel = client.channels.cache.get(channelId);
  if (!channel || !channel.isText()) {
    throw new ChannelNotFoundError();
  }

  const message = await channel.messages.fetch(messageId);
  if (!message || message.system) {
    throw new MessageNotFoundError();
  }

  return message;
}

// 送信されたメッセージから、メッセージリンク部分をすべて探し出し、それらの中身をEmbedとして返信する
export async function sendQuote(ctx: SendQuoteContext): Promise<ReplyMessageOptions | null> {
  const refs = findMessageReferencesFromText(ctx.message.content);
  const quotes: QuoteProps[] = [];

  for (const ref of refs) {
    try {
      const refMessage = await fetchMessageFromReference(ref);
      quotes.push({
        content: refMessage.content,
        imagesURL: refMessage.getImagesURL(),
        userName: refMessage.author.username,
        userAvatarURL: refMessage.getAvatarURL(),
        guildName: refMessage.getGuildName(),
        channelName: refMessage.getChannelName(),
        createdAt: refMessage.createdAt
      });
    } catch (error) {
      if (!(error instanceof ChannelNotFoundError || error instanceof MessageNotFoundError)) return null;
    }
  }

  if (quotes.length === 0) return null;
  return succeed({ quotes });
}
