import { Message } from "discord.js"
import { RuntimeValue, StringValue, ValidTypeUnion, createNull } from "../../language/runtime/values";

export default function extractMessage(message: Message): {[key: string]: ValidTypeUnion} {
  return {
    content: message.content,
    id: message.id,
    channel: {
      id: message.channel.id,
      send: (args, env): RuntimeValue => {
        message.channel.send((args[0] as StringValue).value);
        return createNull();
      } 
    },
    reply: (args, env): RuntimeValue => {
      message.reply((args[0] as StringValue).value);
      return createNull();
    }
  }
}