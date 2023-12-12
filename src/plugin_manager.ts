import fs from "fs";
import Logger from "./Logger";
import api, {Package} from "./plugin_api/interface";
import Ajv, {JSONSchemaType, Schema} from "ajv"

// Built-in plugins
import base from "./discord/plugins/base";

const logger = new Logger("plugins");
const ajv = new Ajv();

const schema = {
  type: "object",
  required: [ "name", "author", "version", ],
  properties: {
    name: { type: "string" },
    author: { type: "string" },
    version: { type: "string" },
    languageFeatures: {
      type: "object",
      properties: {
        packages: {
          type: "object",
        }
      }
    },
    locale: {
      type: "object",
    }
  }  
};

const validate = ajv.compile(schema)

// TODO: Make it load from a /plugin folder
const pluginsToProcess: api[] = [
  base,
];

const plugins: {[key: string]: api} = {};
const locale: {[key: string]: any} = {};
const languageFeatures: {[key: string]: Package} = {};

// Process the plugins
for (const plugin of pluginsToProcess) {
  function showError(error: string) {
    logger.log(`Failed to load plugin ${plugin.name ?? "<Unknown Plugin Name>"}: ${error}`);
  }

  // Compare against schema
  if (!validate(plugin)) {
    showError(validate.errors[0].message);
    continue;
  }

  // Load it
  plugins[plugin.name] = plugin;
  
  if (plugin?.languageFeatures?.packages) {
    for (const p in plugin.languageFeatures.packages) {
      let pkg = plugin.languageFeatures.packages[p];

      // validate package
      if (!pkg.values)
        showError(`languageFeatures.package.${p} does not contain .values`);
      languageFeatures[p] = plugin.languageFeatures.packages[p];

      logger.log(`Loaded plugin ${plugin.name}'s package ${p} which contains ${Object.keys(pkg.values).length} values`)
    }
  }

  // Check if it has locale
  if (plugin.locale) {
    locale[plugin.name] = plugin.locale;
  }

  // Done
  logger.log(`Successfully loaded plugin: ${plugin.name} version ${plugin.version} by ${plugin.author}`);
}

export default plugins;
export {languageFeatures};
export {locale};