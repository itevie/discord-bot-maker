import * as database from "./database";
import Discord, { Application } from "discord.js";
import { RunnerError } from "./errors/RunnerError";
import Logger from "./Logger";
import handle from "./discord/handle";
import { Bot } from "./types";
import ApplicationError from "./errors/ApplicationError";

export interface RunningBotData {
  data: Bot;
  client: Discord.Client;
  isReady: boolean;
  logger: Logger;
  startedAt: number;
}

const logger = new Logger("runner");
const discordDebug = new Logger("discord_debug");
const currentlyRunningBots = new Map<string, RunningBotData>();

/**
 * Starts a bot
 * @param botName The bot to start 
 */
export function startBot(botName: string): void {
  const botLogger = new Logger(`${botName}`);
  botLogger.log(`Attempting to login`);

  // Check if the bot is already started
  if (currentlyRunningBots.has(botName))
    throw new RunnerError(`The bot ${botName} is already running!`);

  // Fetch the bot
  const botData = structuredClone(database.getBot(botName));

  // Construct bot - intents
  const intents = [];

  // Check if it uses only slash commands
  if (!botData.settings.onlySlashCommands) {
    intents.push(Discord.GatewayIntentBits.MessageContent);
    intents.push(Discord.GatewayIntentBits.GuildMessages);
    intents.push(Discord.GatewayIntentBits.Guilds);
  }

  // Construct bot - main
  const bot = new Discord.Client({
    intents,
  });

  // Add bot to the currently running
  currentlyRunningBots.set(botName, {
    data: botData,
    client: bot, 
    isReady: false,
    logger: botLogger,
    startedAt: Date.now(),
  });

  // Register basic events
  bot.on("ready", () => {
    botLogger.log(`${botName} successfully logged in!`);

    // Set that it is ready
    currentlyRunningBots.get(botName).isReady = true;
    currentlyRunningBots.get(botName).startedAt = Date.now();

    // Pass to handler
    handle(currentlyRunningBots.get(botName));
  });

  const debugLogger = botLogger.derive("debug", { isDebug: true });
  bot.on("debug", message => {
    debugLogger.log(message);
  });

  // Try to connect
  bot.login(botData.token).catch(e => {
    removeBot(botName);
    console.log("Failed to connect: " + e.message);
  });
}

/**
 * Stops a specific bot if it is running
 * @param name The bot to stop
 */
export function stopBot(name: string): void {
  // Check if the bot is running
  const bot = currentlyRunningBots.get(name);
  if (!bot) return;

  // If so, stop it
  bot.client.destroy();
  bot.logger.log(`Stopped`);
  removeBot(name);
}

/**
 * 
 * @param name 
 * @param token
 */
export function createBot(name: string, token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.log(`Attempting to create bot: ${name}`);

    // Check if the bot name already exists
    if (database.data.bots.hasOwnProperty(name))
      reject(new ApplicationError(`EA0`));
  
    // Create the client to see if it can login
    const intents = [];
    intents.push(Discord.GatewayIntentBits.MessageContent);
    intents.push(Discord.GatewayIntentBits.GuildMessages);
    intents.push(Discord.GatewayIntentBits.Guilds);
    const bot = new Discord.Client({
      intents,
    });
  
    bot.on("ready", data => {
      logger.log(`Successful login for bot ${data.user.username} (${name})`);

      // Create the bot data
      const botData: Bot = {
        name,
        token,
        createdAt: new Date(),
        eventListeners: {},
        settings: {
          prefix: "!",
          slashCommands: false,
          onlySlashCommands: false,
          ignoreSelf: true,
        }
      };

      // Add to DB
      database.data.bots[name] = botData;
      database.data.selectedBot = name;
      resolve();
    });
  
    logger.log(`Attempting token validation for bot: ${name}`)
    bot.login(token).catch(err => {
      // Check if it was an invalid token error
      if ((err.message as string).includes("invalid token")) {
        reject(new ApplicationError("EA2"));
      } else {
        // Unknown error found
        reject(new ApplicationError("EA3"));
      }
    });
  });
}

export function getRunningBotList(): Map<string, RunningBotData> {
  return currentlyRunningBots;
}

function removeBot(botName: string) {
  currentlyRunningBots.delete(botName);
}