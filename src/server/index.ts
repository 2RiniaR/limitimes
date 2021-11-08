import "./helpers";
import { initialize as initializeDiscord } from "./discord";
import { settings } from "./settings";
import "./controllers";

console.log("LIMITIMES BOT STARTED!");
settings.load();
void initializeDiscord();
