import { Message } from "discord.js";
import execute from "../language/executor";
import { RuntimeValue, StringValue, createNull, createString } from "../language/runtime/values";
import { RunningBotData } from "../runner";
import extractMessage from "./constructors/message";

export const knownEvents: string[] = ["messageCreate", "messageEdit"];

export default function handle(bot: RunningBotData): void {
  // Check if it should listen for messageCreate
  if (bot.data.eventListeners["messageCreate"]) {
    bot.client.on("messageCreate", (message) => {
      bot.logger.log(`Events: A messageCreate event was emitted`);

      if (bot.data.settings.ignoreSelf && message.author.id === bot.client.user.id)
        return;

      // Execute code
      execute(bot.data.eventListeners["messageCreate"].code, {
        origin: `bot:${bot.data.name}:events:messageCreate`,
        variables: {
          // ----- Message Stuff
          message: extractMessage(message),
        },
        bot,
        langLogger: bot.logger.derive("language", { isDebug: true }),
      });
    });
  }
  
  if (bot.data.eventListeners["messageEdit"]) {
    bot.client.on("messageUpdate", (oldMessage, newMessage) => {
      bot.logger.log(`Events: A messageEdit event was emitted`);

      if (bot.data.settings.ignoreSelf && newMessage.author.id === bot.client.user.id)
        return;

        // Execute code
        execute(bot.data.eventListeners["messageEdit"].code, {
          origin: `bot:${bot.data.name}:events:messageEdit`,
          variables: {
            // ----- Message Stuff
            old_message: extractMessage(oldMessage as Message<boolean>),
            new_message: extractMessage(newMessage as Message<boolean>),
          },
          bot,
          langLogger: bot.logger.derive("language", { isDebug: true }),
        });
    });
  }
}