import fs from "fs";
import {BrowserWindow, ipcMain} from 'electron';
import * as database from "./database";
import { createBot, getRunningBotList, startBot, stopBot } from './runner';
import Logger from "./Logger";
import handle, { knownEvents } from "./discord/handle";
import { closeAllWindows, loadEventEditor } from "./editor";
import plugins, { locale } from "./plugin_manager";
import path from "path";
import execute from "./language/executor";
import Parser from "./language/parser/Parser";
import interpret from "./language/runtime/interpreter";
import Environment from "./language/runtime/Environment";
import RuntimeError from "./language/runtime/RuntimeError";
import ParserError from "./language/parser/ParseError";
import LexerError from "./language/lexer/LexerError";
import { handleError } from "./errors/helpers";
import { reloadAllWindows } from "./helpers";
import ApplicationError from "./errors/ApplicationError";
const logger = new Logger("ipc");

// ----- IPC Events -----
// ----- Database Events -----
ipcMain.on("db:get-bot-list", (event, data) => {
  let runningBots = getRunningBotList();

  let bots = [];

  for (const i in database.data.bots) {
    bots.push({
      name: database.data.bots[i].name,
      isRunning: runningBots.has(i),
      startedAt: runningBots.has(i) ? runningBots.get(i).startedAt : null,
      user: runningBots.has(i) ? {
        username: runningBots.get(i)?.client?.user?.username ?? "",
        avatar: runningBots.get(i)?.client?.user?.avatarURL() ?? "",
      } : null,
    });
  }

  event.returnValue = bots;
});

// ----- Bot Events -----
ipcMain.on("bot:restart-current-bot", (event, data) => {
  stopBot(database.getCurrentBot().name);

  setTimeout(() => {
    startBot(database.getCurrentBot().name);
  }, 2000);
});

ipcMain.on("bot:restart-bot", (event, data: string) => {
  stopBot(data);

  setTimeout(() => {
    startBot(data);
  }, 2000);
});

ipcMain.on("bot:start-current-bot", (event, data) => {
  startBot(database.getCurrentBot().name);
});

ipcMain.on("bot:start-bot", (event, data: string) => {
  startBot(data);
});

ipcMain.on("bot:stop-current-bot", (event, data) => {
  stopBot(database.getCurrentBot().name);
});

ipcMain.on("bot:stop-bot", (event, data: string) => {
  stopBot(data);
});

ipcMain.on("bot:get-current-bot", (event, data) => {
  let currentBot = database.getCurrentBot();

  // Check if there is a selected bot
  if (!currentBot)
    return event.returnValue = null; 
  
  event.returnValue = currentBot;
});

ipcMain.on("bot:get-bot-guilds", async (event, data: string) => {
  // Check if the bot is logged in
  if (getRunningBotList().has(data) == false) {
    event.returnValue = [];
    return;
  }

  const bot = getRunningBotList().get(data);

  if (!bot?.client) {
    event.returnValue = [];
    return;
  }

  const guilds = (await bot.client.guilds.fetch()).map(x => { return { name: x.name, avatar: x.iconURL(), id: x.id }; });
  event.returnValue = guilds;
});

ipcMain.on("bot:leave-server", async (event, data: { bot: string, guild: string}) => {
  // Try find the server
  try {
    // Check if bot is started
    if (getRunningBotList().has(data.bot) == false)
      throw new ApplicationError("EA0");

    // Try fetch the guild
    const bot = getRunningBotList().get(data.bot);
    const guild = await bot.client.guilds.fetch(data.guild)
    await (await guild.fetch()).leave();
  } catch (err) {
    handleError(err);
  }

  event.returnValue = "";
});

ipcMain.on("bot:name-exists", (event, data) => {
  event.returnValue = database.data.bots.hasOwnProperty(data);
});

ipcMain.on("bot:create", (event, data: {name: string, token: string}) => {
  createBot(data.name, data.token).then(() => {
    logger.log(`Bot successfully created`);
    __app.getWindow().reload();
  }).catch(err => {
    handleError(err);
  });
});

ipcMain.on("bot:change-selected", (event, data: string) => {
  if (database.getCurrentBot().name == data) return;
  if (!database.data.bots.hasOwnProperty(data))
    return handleError(new ApplicationError("EA4", {bot_name: data}));
  closeAllWindows();
  database.data.selectedBot = data;
  __app.getWindow().reload();
});

ipcMain.on("get-page", (event, name: string) => {
  let fileName = `${__dirname}/${__app.baseDirectory}/app/views/pages/${name}.html`;
  logger.log(`Attempting to load page: ${fileName}`);
  event.returnValue = fs.readFileSync(fileName, "utf-8");
});

ipcMain.on("get-modal", (event, name: string) => {
  let fileName = `${__dirname}/${__app.baseDirectory}/app/views/modals/${name}.html`;
  logger.log(`Attempting to load modal: ${fileName}`);
  event.returnValue = fs.readFileSync(fileName, "utf-8");
});

// ----- Event events -----
ipcMain.on("events:get-known-list", (event, data) => {
  event.returnValue = knownEvents;
});

ipcMain.on("events:edit", (event, eventName: string) => {
  logger.log(`Initiating edit for event ${eventName}`);
  loadEventEditor(eventName);
});

// ----- i18n events -----
ipcMain.on("i18n:load-namespaces", (event, _) => {
  logger.log(`Loading i18n namespaces from ${path.join(__dirname, __app.baseDirectory, "locales")}`);
  const data = [];
  
  // Fetch the lang directories
  const directories = fs.readdirSync(path.join(__dirname, __app.baseDirectory, "locales"));

  // Loop through them
  for (const directory of directories) {
    // Read directory
    const namespaces = fs.readdirSync(path.join(__dirname, __app.baseDirectory, "locales", directory));

    // Loop through namespaces
    for (const namespace of namespaces) {
      // Load namespace
      const ns = JSON.parse(fs.readFileSync(path.join(__dirname, __app.baseDirectory, "locales", directory, namespace), "utf-8"));
      data.push({
        lng: directory,
        ns: namespace.replace(".json", ""),
        data: ns,
      });
    }
  }

  const pluginLanguages = {};

  // Add plugin locales
  for (const p in locale) {
    const plugin = locale[p];

    // Loop through languages
    for (const l in plugin) {
      const language = plugin[l];

      if (!pluginLanguages[l])
        pluginLanguages[l] = {};
      pluginLanguages[l][p] = language;
    }
  }

  for (const language in pluginLanguages) {
    data.push({
      ns: "plugins",
      lng: language,
      data: pluginLanguages[language],
    });
  }

  logger.log(`Loaded ${data.length} i18n namespaces`);

  event.returnValue = data;
});

ipcMain.on("i18n:get-current-language", (event, data) => {
  event.returnValue = database.data.settings.language;
});

ipcMain.on("i18n:set-current-language", (event, data: string) => {
  database.data.settings.language = data;

  reloadAllWindows();

  event.returnValue = null;
})

// ----- Plugin Events -----
ipcMain.on("plugins:list", (event) => {
  const packages = {};

  for (const p in plugins) {
    const plugin = plugins[p];
    const pkg = {
      author: plugin.author,
      version: plugin.version,
      name: plugin.name,
      languageFeatures: {},
    }

    for (const f in plugin.languageFeatures.packages) {
      const feature = plugin.languageFeatures.packages[f];
      const defined = {
        values: {},
      }

      for (const v in feature.values) {
        defined.values[v] = {
          description: feature.values[v].description,
        }
      }

      pkg.languageFeatures[f] = defined;
    }

    packages[p] = pkg;
  }

  event.returnValue = packages;
});

// ----- REPL events -----
ipcMain.on("repl:evaluate", async (event, data: string) => {
  try {
    let value = await execute({ code: data, prelexed: null }, { 
      origin: "REPL", 
      variables: {}, 
      bot: {
        data: database.getCurrentBot(),
        client: null,
        isReady: null,
        logger: new Logger("REPL"),
        startedAt: null,
      },
      langLogger: new Logger("REPL"),
    });

    event.returnValue = value;
  } catch (e) {
    if (e instanceof ParserError || e instanceof LexerError) {
      event.returnValue = e.extractDetails();
      return;
    }

    throw e;
  }
});