// bot/handle/index.js
const fs = require("fs-extra");
const path = require("path");
const login = require("fb-chat-api-temp");
const gradient = require("gradient-string");

const {
  addUserToDB,
  getThreadInfoFromDB,
  addThreadToDB,
} = require("../database/commands/index");

const commandPath = path.join(process.cwd(), "bot", "commands");
const version = loadVersion();

function loadCommands() {
  const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const startTime = new Date();
    const commandName = path.basename(file, ".js");
    global.Yue.commands.set(commandName, require(path.join(commandPath, file)));
    const endTime = new Date();

    // Loading commands logger
    const duration = endTime - startTime;
    const loadingLog = gradient.rainbow(
      `Loaded ${commandName}.js (${duration}ms)`,
    );
    console.log(loadingLog);
  });
}

function loadVersion() {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
  } catch (error) {
    console.error("Error loading version from package.json:", error);
    return null;
  }
}

function loadAppState() {
  try {
    const appStatePath = path.join(process.cwd(), "appstate.json");
    return JSON.parse(fs.readFileSync(appStatePath, "utf8"));
  } catch (error) {
    console.error("Error loading app state:", error);
    return null;
  }
}

function updateCheck() {
  axios
    .get("https://api.github.com/repos/ruingl/Yue/releases/latest")
    .then((response) => {
      const latestVersion = response.data.tag_name;
      if (latestVersion && latestVersion !== version) {
        console.log(
          gradient.retro(
            `⟩ New version found! Update to ${latestVersion} using npm run update`,
          ),
        );
      }
    })
    .catch((error) => {
      console.error("Error checking for updates:", error);
    });
}

function initializeBot() {
  const configPath = path.join(process.cwd(), "config.json"); // Updated path
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  global.Yue.botPrefix = config.botPrefix || "";
  global.Yue.botAdmins = config.botAdmins || [];

  login({ appState: loadAppState() }, (err, api) => {
    if (err) return console.error(err);

    api.setOptions({
      ...config.apiOptions,
    });

    // Check for updates
    updateCheck();

    fs.writeFileSync("appstate.json", JSON.stringify(api.getAppState()));

    api.listen(async (err, event) => {
      try {
        if (event.body && event.body.toLowerCase() === "prefix") {
          api.sendMessage(
            `My prefix is: \`${global.Yue.botPrefix}\``,
            event.threadID,
            event.messageID,
          );
        } else if (event.body && event.body.toLowerCase().startsWith(global.Yue.botPrefix)) {
          const [command, ...args] = event.body
            .slice(global.Yue.botPrefix.length)
            .trim()
            .split(" ");

          if (global.Yue.commands.has(command)) {
            global.Yue.commands.get(command).onRun({ api, event, args });
          } else {
            api.sendMessage(
              "Invalid command.",
              event.threadID,
              event.messageID,
            );
          }
        }
      } catch (error) {
        console.error("Error occurred while executing command:", error);
      }
    });
  });
}

module.exports = {
  loadCommands,
  loadVersion,
  loadAppState,
  updateCheck,
  initializeBot,
};
