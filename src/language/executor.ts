import { RunningBotData } from "../runner";
import { lex } from "./lexer/lexer";
import Parser from "./parser/Parser";
import Context from "./context";
import Environment from "./runtime/Environment";
import interpret from "./runtime/interpreter";
import util from "util";
import { languageFeatures } from "../plugin_manager";
import { RuntimeValue, ValidTypeUnion, createNull, createValue } from "./runtime/values";
import { Code } from "../types";
import { handleError } from "../errors/helpers";
import LanguageError from "./LanguageError";

export default async function execute(code: Code, context: Context): Promise<RuntimeValue> {
  // Parse source
  const astTree = code.prelexed ? code.prelexed : new Parser().produceAST(code.code, context.origin);

  // Create environment
  const environment = new Environment(context);

  // Load plugins
  for (const feature in languageFeatures) {
    if (feature === "__global") {
      for (const value in languageFeatures[feature].values) {
        environment.declareVariable(value, createValue(languageFeatures[feature].values[value].value));
      }
    } else {
      const obj = {}

      for (const value in languageFeatures[feature].values) {
        obj[value] = languageFeatures[feature].values[value].value;
      }

      environment.declareVariable(feature, createValue(obj));
    }
  }

  // Interpret
  let value = await interpret(astTree, environment);


  return value;
}