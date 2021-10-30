import { initialize as initializeDiscord } from "./discord";
import { provider } from "./settings";

console.log("LIMITIMES BOT STARTED!");
provider.load();
initializeDiscord();
