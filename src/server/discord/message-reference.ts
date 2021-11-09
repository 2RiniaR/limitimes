import { Message } from "discord.js";
import { clientManager } from "src/server/discord";

export class ChannelNotFoundError extends Error {}
export class MessageNotFoundError extends Error {}

export type MessageReference = {
  guildId: string;
  channelId: string;
  messageId: string;
};

// 文字列から、メッセージリンク部分をすべて探し出して、それらの情報を返す
export function findMessageReferences(text: string): MessageReference[] {
  const regex = /https:\/\/discord.com\/channels\/(\d+)\/(\d+)\/(\d+)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((match) => {
    const safeMatch = match as string[]; // I AM JUSTICE.
    return { guildId: safeMatch[1], channelId: safeMatch[2], messageId: safeMatch[3] };
  });
}

// メッセージの参照情報から、参照先メッセージの実体を取得する
export async function fetchMessage({ channelId, messageId }: MessageReference): Promise<Message> {
  const channel = clientManager.client.channels.cache.get(channelId);
  if (!channel || !channel.isText()) throw new ChannelNotFoundError();
  const message = await channel.messages.fetch(messageId);
  if (!message || message.system) throw new MessageNotFoundError();
  return message;
}
