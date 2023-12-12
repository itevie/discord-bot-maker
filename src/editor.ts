import { ipcMain, BrowserWindow } from "electron";
import Logger from "./Logger";
import path, { parse } from "path";
import * as database from "./database";
import RuntimeError from "./language/runtime/RuntimeError";
import ParserError from "./language/parser/ParseError";
import LexerError from "./language/lexer/LexerError";
import Parser from "./language/parser/Parser";
const logger = new Logger("editor");

const editors: {[key: string]: BrowserWindow} = {};

export function loadEventEditor(eventName: string) {
  // Check if already open
  if (editors["event:" + eventName]) {
    logger.log(`Editor window for event ${eventName} already exists, focusing`);
    editors["event:" + eventName].focus();
    return;
  }

  // Check if the event is there
  if (!database.data.bots[database.data.selectedBot].eventListeners[eventName]) {
    database.data.bots[database.data.selectedBot].eventListeners[eventName] = {
      code: {
        code: "",
        prelexed: null,
      }
    }
  }
  
  logger.log(`Creating browser window to edit ${eventName}`);

  const window = new BrowserWindow({
    width: 600,
    height: 600,
    show: false,
    maximizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '/../src/app/js/preload/main.js'),
    },
    backgroundColor: "#222222",
  });

  window.on("closed", () => {
    // Remvoe from editors
    delete editors["event:" + eventName];
    logger.log(`Editor closed for event ${eventName}`);
  });

  window.on("ready-to-show", () => {
    window.show();
    window.webContents.send("identify", {
      type: "event",
      name: eventName,
      currentData: database.data.bots[database.data.selectedBot].eventListeners[eventName].code.code,
    })
  });

  window.loadFile(path.join(__app.baseDirectory, "/app/views/editor.html"));

  editors["event:" + eventName] = window;
}

ipcMain.on("editor:update-code", (event, data: { type: "event" | "command", name: string, newData: string}) => {
  // Validate
  if (data.type === "event") {
    // Check if event is defined
    // TODO: Make this throw error
    if (!(database.getCurrentBot().eventListeners[data.name])) return;

    // Validate
    try {
      new Parser().produceAST(data.newData, `editor-validation:${data.type}:${data.name}`);
    } catch (error) {
      if (error instanceof LexerError || error instanceof ParserError) {
        editors[`${data.type}:${data.name}`].webContents.send("editor-error", {
          errorCode: error.errorCode,
          stack: error.stack,
          context: structuredClone(error.context),
          location: error.location,
          message: error.message,
        });
        return;
      }

      throw error;
    }

    // Update
    database.getCurrentBot().eventListeners[data.name].code = {
      code: data.newData,
      prelexed: null,
    };
  }
});