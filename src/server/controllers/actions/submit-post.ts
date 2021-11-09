import { DiscordAPIError, Message, ReplyMessageOptions, User as DiscordUser } from "discord.js";
import { discordCache } from "src/server/discord/cache";
import { User } from "src/server/models/user";
import { fetchFollowers } from "src/server/controllers/utils";
import { getPostForFollowerEmbed, getPostForTimelineEmbed } from "src/server/views/post";
import { getDMChannel } from "src/server/discord/dm";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { failedToSendToTimeline, succeed } from "src/server/views/responses/submit-post";

type RequestSubmitPostContext = {
  message: Message;
};

async function sendPostToTimelineChannel(message: Message): Promise<Message> {
  const timelineChannel = await discordCache.getTimelineChannel();
  const embed = getPostForTimelineEmbed({
    content: message.content,
    imagesURL: message.getImagesURL(),
    userName: message.author.username,
    userAvatarURL: message.getAvatarURL(),
    userId: message.author.id,
    createdAt: message.createdAt,
    favoriteCount: 0,
    shareCount: 0
  });
  return await timelineChannel.send({ embeds: [embed] });
}

async function getFollowerUsers(message: Message): Promise<DiscordUser[]> {
  const postUser = new User(message.author.id);
  await postUser.fetch();
  return await fetchFollowers(postUser);
}

async function sendPostToFollowersDMChannel(message: Message, upstreamURL: string) {
  const users = await getFollowerUsers(message);
  for (const user of users) {
    const dmChannel = await getDMChannel(user);
    const embed = getPostForFollowerEmbed({
      content: message.content,
      imagesURL: message.getImagesURL(),
      userName: message.author.username,
      userAvatarURL: message.getAvatarURL(),
      userId: message.author.id,
      createdAt: message.createdAt,
      upstreamURL,
      favoriteCount: 0,
      shareCount: 0
    });

    try {
      await dmChannel.send({ embeds: [embed] });
    } catch (error) {
      if (!(error instanceof DiscordAPIError)) {
        console.error(error);
      }
    }
  }
}

export async function requestSubmitPost(ctx: RequestSubmitPostContext): Promise<ReplyMessageOptions | null> {
  const response = await checkRegisterUser({ user: ctx.message.author });
  if (response) return response;

  let upstreamURL: string;
  try {
    const upstreamMessage = await sendPostToTimelineChannel(ctx.message);
    upstreamURL = upstreamMessage.url;
  } catch (error) {
    console.error(error);
    return failedToSendToTimeline();
  }

  await sendPostToFollowersDMChannel(ctx.message, upstreamURL);
  return succeed({ upstreamURL });
}
