import { client } from "src/server/discord";
import { Message, User as DiscordUser } from "discord.js";
import { checkRegisterUser } from "src/server/controllers/register-user";
import { discordCache } from "src/server/discord/cache";
import {
  responseForFailedToSendToFollowers,
  responseForFailedToSendToTimeline,
  responseForSucceed
} from "src/server/views/responses/submit-post";
import { User } from "src/server/models/user";
import { fetchFollowerUsers } from "src/server/controllers/utils";
import { getPostForFollowerEmbed, getPostForTimelineEmbed } from "src/server/views/post";
import { getDMChannel } from "src/server/discord/dm";

client.on("messageCreate", async (message) => {
  if (message.author.bot || message.channel.type !== "DM") return;
  await requestSubmitPost({
    message: message
  });
});

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
    createdAt: message.createdAt
  });
  return await timelineChannel.send({ embeds: [embed] });
}

async function getFollowerUsers(message: Message): Promise<DiscordUser[]> {
  const postUser = new User(message.author.id);
  postUser.fetch();
  return await fetchFollowerUsers(postUser);
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
      createdAt: message.createdAt,
      upstreamURL
    });
    await dmChannel.send({ embeds: [embed] });
  }
}

export async function requestSubmitPost({ message }: RequestSubmitPostContext) {
  if (!(await checkRegisterUser(message, message.author))) return;

  let upstreamURL: string;
  try {
    const upstreamMessage = await sendPostToTimelineChannel(message);
    upstreamURL = upstreamMessage.url;
  } catch (error) {
    await responseForFailedToSendToTimeline(message);
    console.error(error);
    return;
  }

  try {
    await sendPostToFollowersDMChannel(message, upstreamURL);
  } catch (error) {
    await responseForFailedToSendToFollowers(message);
    console.error(error);
    return;
  }

  await responseForSucceed(message, { upstreamURL: upstreamURL });
}
