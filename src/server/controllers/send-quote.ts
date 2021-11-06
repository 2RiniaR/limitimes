import { Message, MessageEmbed } from "discord.js";
import { client } from "src/server/discord-bot";
import { getSystemMessageEmbed } from "src/server/views/system-message";
import { getQuoteEmbed } from "src/server/views/quote";

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.channel.isText()) return;
  await sendQuote({ message: message });
});

export type SendQuoteContext = {
  message: Message;
};

type MessageReference = {
  channelId: string;
  messageId: string;
};

// 文字列から、メッセージリンク部分をすべて探し出して、それらの情報を返す
function findMessageReferencesFromText(text: string): MessageReference[] {
  const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((match) => {
    const safeMatch = match as string[]; // I AM JUSTICE.
    return { channelId: safeMatch[1], messageId: safeMatch[2] };
  });
}

// メッセージの参照情報から、参照先メッセージの実体を取得する
async function fetchMessageFromReference({ channelId, messageId }: MessageReference): Promise<Message> {
  const channel = client.channels.cache.get(channelId);
  if (!channel || !channel.isText()) throw Error("参照先のチャンネルが見つかりませんでした。");
  const message = await channel.messages.fetch(messageId);
  if (!message || message.system) throw Error("参照先のメッセージが見つかりませんでした。");
  return message;
}

// メッセージの参照情報から、Embedを生成して返す
async function getReferencesEmbed(ref: MessageReference): Promise<MessageEmbed> {
  try {
    const refMessage = await fetchMessageFromReference(ref);
    return getQuoteEmbed({ message: refMessage });
  } catch (error) {
    if (error instanceof Error) {
      return getSystemMessageEmbed({ type: "failed", message: error.toString() });
    }
    throw error;
  }
}

// すべてのメッセージの参照情報から、最終的に送信するEmbedを返す
async function getSendEmbeds(refs: MessageReference[]): Promise<MessageEmbed[]> {
  return Promise.all(refs.map(getReferencesEmbed));
}

// 送信されたメッセージから、メッセージリンク部分をすべて探し出し、それらの中身をEmbedとして返信する
export async function sendQuote({ message }: SendQuoteContext) {
  const refs = findMessageReferencesFromText(message.content);
  const embeds = await getSendEmbeds(refs);
  if (embeds.length === 0) return;
  await message.reply({ embeds });
}
