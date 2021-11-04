import { initialize as initializeDiscord } from "./discord-bot";
import { settings } from "./settings";
import "./controllers";

console.log("LIMITIMES BOT STARTED!");
settings.load();
initializeDiscord();
