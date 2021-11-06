import { InteractionReplyOptions, MessagePayload } from "discord.js";

export interface ReplyTarget {
  reply(options: string | InteractionReplyOptions | MessagePayload): Promise<void>;
}
