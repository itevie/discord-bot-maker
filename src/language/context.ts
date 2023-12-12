import Logger from "../Logger";
import { RunningBotData } from "../runner";
import { ValidTypeUnion } from "./runtime/values";

export default interface Context {
  variables: {[key: string]: ValidTypeUnion},
  origin: string,
  bot: RunningBotData,
  langLogger: Logger,
}
