import { MessageEmbed } from "discord.js";

/*
succeed : 処理に成功したとき
info    : 追加の情報があるとき
invalid : ユーザーによる操作が誤ったものだったとき
failed  : ユーザーの操作は誤ってないが、処理が想定内の失敗をしたとき
warning : 処理は失敗していないが、好ましくない結果となったとき
error   : 処理が失敗したうえ、想定外の失敗だったとき
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
