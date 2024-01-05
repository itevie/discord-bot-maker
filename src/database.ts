import fs from "fs";
import { setup as setupDatabase } from "./utils/setup_database";
import { DatabaseError } from "./errors/DatabaseError";
import { Bot, DatabaseRoot } from "./types";

export let data = null as DatabaseRoot;
export let databaseLocation = "./db.json";

//#region Database Utility

/**
 * Initialises the database
 */
export function setup() {
  // Check if the file exists
  if (!fs.existsSync(databaseLocation))
    setupDatabase();
  
  try {
    // Read and parse
    const file = fs.readFileSync(databaseLocation, "utf-8");
    const json = JSON.parse(file);
    validateDatabase(json);

    // Finish
    data = json as DatabaseRoot;
  } catch (e) {
    console.error(`Failed to read ${databaseLocation}: ${e}`);
    process.exit(1);
  }

  setInterval(() => {
    if (data !== null) {
      fs.writeFileSync(databaseLocation, JSON.stringify(data));
    }
  }, 5000);
}

/**
 * Checks whether or not supplied data is valid
 * @param data The data to check
 * @returns Whether or not it is valid
 */
export function validateDatabase(data: object): boolean {
  // TODO: do this
  return true;
}

//#endregion

//#region Bot-based Functions

export function getBot(botName: string): Bot {
  // Check if it is there
  if (!data.bots[botName])
    throw new DatabaseError(`The bot ${botName} does not exist`);
  return data.bots[botName];
} 

export function getCurrentBot(): Bot | undefined {
  return data.bots[data.selectedBot];
}

//#endregion