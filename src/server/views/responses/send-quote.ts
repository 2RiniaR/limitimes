import { getQuoteEmbed, QuoteProps } from "src/server/views/quote";
import { ReplyMessageOptions } from "discord.js";

export function succeed({ quotes }: { quotes: QuoteProps[] }): ReplyMessageOptions {
  return { embeds: quotes.map((quote) => getQuoteEmbed(quote)) };
}
