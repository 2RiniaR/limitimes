import { initialize as initializeDiscord } from "./discord-bot";
import { settings } from "./settings";

console.log("LIMITIMES BOT STARTED!");
settings.load();
initializeDiscord();
