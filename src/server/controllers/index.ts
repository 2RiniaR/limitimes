import { follow } from "src/server/controllers/actions/follow";
import { unfollow } from "src/server/controllers/actions/unfollow";
import {
  onDirectMessageReceived,
  onMessageReceived,
  onSlashCommandReceived,
  onUserMenuSelected
} from "src/server/discord/events";
import { sendQuote } from "src/server/controllers/actions/send-quote";
import { showFollowingUsers } from "src/server/controllers/actions/show-following-users";
import { requestSubmitPost } from "src/server/controllers/actions/submit-post";

onUserMenuSelected("follow", async (interaction, target) => {
  const response = await follow({ requester: interaction.user, target });
  if (response) await interaction.reply(response);
});

onUserMenuSelected("unfollow", async (interaction, target) => {
  const response = await unfollow({ requester: interaction.user, target });
  if (response) await interaction.reply(response);
});

onMessageReceived(async (message) => {
  const response = await sendQuote({ message: message });
  if (response) await message.reply(response);
});

onSlashCommandReceived(
  {
    commandName: "times",
    subCommandName: "show-following-users"
  },
  async (interaction) => {
    const response = await showFollowingUsers({
      interaction: interaction,
      requester: interaction.user
    });
    if (response) await interaction.reply(response);
  }
);

onDirectMessageReceived(async (message) => {
  await requestSubmitPost({
    message: message
  });
});
