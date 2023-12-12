import fs from "fs";
import { databaseLocation } from "../database";
import { DatabaseRoot } from "../types";

export const DEFAULT_DATA: DatabaseRoot = {
  selectedBot: "",
  plugins: {
    enabled: ["base"]
  },
  settings: {
    language: "en",
  },
  bots: {
    
  }
}

export function setup() {
  // Check if the file exists
  if (fs.existsSync(databaseLocation))
    return;

  // Create it
  fs.writeFileSync(databaseLocation, JSON.stringify(DEFAULT_DATA));
}