import { MessageEmbed } from "discord.js";

/*
info    : 追加の情報など
invalid : ユーザーによる操作が誤ったものだった場合
failed  : ユーザーの操作は誤ってないが、処理が想定内の失敗をした場合
warning : システムの警告
error   : システムのエラー
 */
export type SystemMessageType = "succeed" | "info" | "invalid" | "failed" | "warning" | "error";

const generators: { [type in SystemMessageType]: () => MessageEmbed } = {
  succeed: () => new MessageEmbed().setTitle("✅成功").setColor("GREEN"),
  info: () => new MessageEmbed().setTitle("ℹ情報").setColor("GREY"),
  invalid: () => new MessageEmbed().setTitle("⛔拒否").setColor("DARK_GOLD"),
  failed: () => new MessageEmbed().setTitle("❌失敗").setColor("DARK_RED"),
  warning: () => new MessageEmbed().setTitle("⚠警告").setColor("YELLOW"),
  error: () => new MessageEmbed().setTitle("‼エラー").setColor("RED")
};

export type SystemMessageProps = {
  type: SystemMessageType;
};

export function getSystemMessageEmbed({ type }: SystemMessageProps): MessageEmbed {
  return generators[type]();
}
