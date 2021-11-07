import { Message, TextChannel } from "discord.js";
import { client } from "src/server/discord";
import {
  QuoteProps,
  responseForFailed,
  responseForMessageNotFound,
  responseForSucceed
} from "src/server/views/send-quote";
import { MessageReference, findMessageReferencesFromText } from "src/server/helpers/find-message-refs";

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

function getGuildName(message: Message): string | undefined {
  const name = message.guild?.name;
  return name ? name : undefined;
}

function getChannelName(message: Message): string | undefined {
  const channel = message.channel;
  if (!(channel instanceof TextChannel)) return undefined;
  return channel.name;
}

function getAvatarURL(message: Message): string | undefined {
  const avatarURL = message.author.avatarURL();
  return avatarURL ? avatarURL : undefined;
}

function getImagesURL(message: Message): string[] {
  return message.attachments.map((attachment) => attachment.url);
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
        imagesURL: getImagesURL(refMessage),
        userName: refMessage.author.username,
        userAvatarURL: getAvatarURL(refMessage),
        guildName: getGuildName(refMessage),
        channelName: getChannelName(refMessage),
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

  await responseForSucceed(srcMessage, { quotes });
}
