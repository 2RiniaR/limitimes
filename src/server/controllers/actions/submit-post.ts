import { DiscordAPIError, Message, ReplyMessageOptions, GuildMember } from "discord.js";
import { User } from "src/server/models/user";
import { getPostForFollowerEmbed, getPostForTimelineEmbed } from "src/server/views/post";
import { getDMChannel } from "src/server/discord/dm";
import { checkRegisterUser } from "src/server/controllers/actions/check-register-user";
import { failedToSendToTimeline } from "src/server/views/responses/submit-post";
import { targetGuildManager } from "src/server/discord";
import { PostForTimelineProps } from "src/server/views/post/timeline";
import { userService } from "src/server/models";

type RequestSubmitPostContext = {
  message: Message;
  requester: GuildMember;
};

async function fetchFollowers(user: User): Promise<GuildMember[]> {
  const followers = await user.getFollowers();
  const followersId = followers.map((user) => user.id);
  return await targetGuildManager.getMembers(followersId);
}

function getPostProps(message: Message): PostForTimelineProps {
  return {
    content: message.content,
    imagesURL: message.getImagesURL(),
    userName: message.author.username,
    userAvatarURL: message.author.displayAvatarURL(),
    userId: message.author.id,
    createdAt: message.createdAt,
    favoriteCount: 0,
    shareCount: 0
  };
}

async function sendPostToTimelineChannel(message: Message): Promise<Message> {
  const timelineChannel = await targetGuildManager.getTimelineChannel();
  const embed = getPostForTimelineEmbed(getPostProps(message));
  return await timelineChannel.send({ embeds: [embed] });
}

async function sendPostToFollowersDMChannel(message: Message, upstreamURL: string) {
  const requester = userService.get(message.author.id);
  const members = await fetchFollowers(requester);

  for (const member of members) {
    const dmChannel = await getDMChannel(member.user);
    const embed = getPostForFollowerEmbed({
      upstreamURL,
      ...getPostProps(message)
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
  const response = await checkRegisterUser({ member: ctx.requester });
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
  return null;
}
