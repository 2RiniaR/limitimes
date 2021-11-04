import { Message, MessageEmbed } from "discord.js";
import { client } from "src/discord-bot";
import { getSystemMessageEmbed } from "src/views/system-message";
import { getQuoteEmbed } from "src/views/quote";

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.channel.isText()) return;
  await sendQuote({ message: message });
});

export type SendQuoteContext = {
  message: Message;
};

type MessageReference = {
  guildId: string;
  channelId: string;
  messageId: string;
};

// 文字列から、メッセージリンク部分をすべて探し出して、それらの情報を返す
function findMessageReferencesFromText(text: string): MessageReference[] {
  // ToDo: 複数リンクに対応する
  const regex = /https:\/\/discord.com\/channels\/\d+\/(\d+)\/(\d+)/;
  const match = text.match(regex);
  if (!match) return [];
  return [{ guildId: match[0], channelId: match[1], messageId: match[2] }];
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
  await message.reply({ embeds });
}
