import "./helpers";
import "./firebase";
import { clientManager } from "src/server/discord";
import { settingsManager } from "./settings";
import "./controllers";

console.log("LIMITIMES BOT STARTED!");
settingsManager.load();
void clientManager.initialize();
