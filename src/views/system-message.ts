import { MessageEmbed } from "discord.js";

/*
info    : 追加の情報など
invalid : ユーザーによる操作が誤ったものだった場合
failed  : ユーザーの操作は誤ってないが、処理が想定内の失敗をした場合
warning : システムの警告
error   : システムのエラー
 */
export type SystemMessageType = "info" | "invalid" | "failed" | "warning" | "error";

const generators: { [type in SystemMessageType]: () => MessageEmbed } = {
  info: () => new MessageEmbed().setTitle("INFO").setColor("GREY"),
  invalid: () => new MessageEmbed().setTitle("INVALID").setColor("DARK_GOLD"),
  failed: () => new MessageEmbed().setTitle("FAILED").setColor("DARK_RED"),
  warning: () => new MessageEmbed().setTitle("WARNING").setColor("YELLOW"),
  error: () => new MessageEmbed().setTitle("ERROR").setColor("RED")
};

export type SystemMessageProps = {
  type: SystemMessageType;
  message: string;
};

export function getSystemMessageEmbed({ type, message }: SystemMessageProps): MessageEmbed {
  return generators[type]().setAuthor("SYSTEM").setDescription(message);
}
