import { client } from "src/discord-bot";

// スレッドが作成されたとき、自動で参加する
client.on("threadCreate", async (thread) => {
  if (!thread) return;
  await thread.join();
});
