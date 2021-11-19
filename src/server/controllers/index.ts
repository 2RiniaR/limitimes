import { follow } from "src/server/controllers/actions/follow";
import { unfollow } from "src/server/controllers/actions/unfollow";
import { onDirectMessageReceived, onSlashCommandReceived, onUserMenuSelected } from "src/server/discord/events";
import { showFollowingUsers } from "src/server/controllers/actions/show-following-users";
import { requestSubmitPost } from "src/server/controllers/actions/submit-post";

onUserMenuSelected("follow", async ({ interaction, requester, target }) => {
  const response = await follow({ requester, target });
  if (response) await interaction.reply(response);
});

onUserMenuSelected("unfollow", async ({ interaction, requester, target }) => {
  const response = await unfollow({ requester, target });
  if (response) await interaction.reply(response);
});

onSlashCommandReceived(
  {
    commandName: "times",
    subCommandName: "show-following-users"
  },
  async ({ interaction, requester }) => {
    const response = await showFollowingUsers({ interaction, requester });
    if (response) await interaction.reply(response);
  }
);

onDirectMessageReceived(async ({ message, author }) => {
  const response = await requestSubmitPost({ message, requester: author });
  if (response.postResult === "succeed") await message.react(response.secret ? "🤫" : "✅");
});
