import { Message } from "discord.js";
import { client } from "src/server/discord";
import {
  responseForFailed,
  responseForMessageNotFound,
  responseForSucceed
} from "src/server/views/responses/send-quote";
import { MessageReference, findMessageReferencesFromText } from "src/server/helpers/find-message-refs";
import { QuoteProps } from "src/server/views/quote";

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.channel.isText()) return;
  await sendQuote({ srcMessage: message });
});

export type SendQuoteContext = {
  srcMessage: Message;
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
export async function sendQuote({ srcMessage }: SendQuoteContext) {
  const refs = findMessageReferencesFromText(srcMessage.content);
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
      if (error instanceof ChannelNotFoundError || error instanceof MessageNotFoundError) {
        await responseForMessageNotFound(srcMessage);
      } else {
        await responseForFailed(srcMessage);
        return;
      }
    }
  }

  if (quotes.length === 0) return;
  await responseForSucceed(srcMessage, { quotes });
}
