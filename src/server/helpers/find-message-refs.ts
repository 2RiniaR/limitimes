export type MessageReference = {
  guildId: string;
  channelId: string;
  messageId: string;
};

// 文字列から、メッセージリンク部分をすべて探し出して、それらの情報を返す
export function findMessageReferencesFromText(text: string): MessageReference[] {
  const regex = /https:\/\/discord.com\/channels\/(\d+)\/(\d+)\/(\d+)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((match) => {
    const safeMatch = match as string[]; // I AM JUSTICE.
    return { guildId: safeMatch[1], channelId: safeMatch[2], messageId: safeMatch[3] };
  });
}
