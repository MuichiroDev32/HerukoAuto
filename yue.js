// yue.js
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const gradient = require("gradient-string");
const chalk = require("chalk");

const handle = require("./bot/handle/index");

global.Yue = {
  botPrefix: undefined,
  botAdmins: [], // Default value if not specified in config.json
  commands: new Map(),
};

async function main() {
  console.log(gradient.retro("░▀▄▀░█▒█▒██▀"));
  console.log(gradient.retro("░▒█▒░▀▄█░█▄▄"));
  console.log(gradient.retro("━━━━━━━━━━━━━━━"));
  console.log(gradient.retro(`Yue (${handle.loadVersion()})`));
console.log("");
 
  const configPath = path.join(process.cwd(), "config.json");
  const config = fs.readJsonSync(configPath, { throws: true });

  if (!config.botPrefix) {
    throw new Error("Bot prefix is not specified in config.json. Please provide a valid botPrefix.");
  }

  global.Yue.botPrefix = config.botPrefix;
  global.Yue.botAdmins = config.botAdmins || [];

  handle.loadCommands();
  const version = handle.loadVersion();
  const appState = handle.loadAppState();

  handle.initializeBot(version, appState);

  console.log(chalk.green("✅ | Bot logged in!"));
  console.log("");
}

main().catch((error) => console.error("Error in main:", error));