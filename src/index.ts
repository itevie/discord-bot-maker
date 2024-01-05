import { app, BrowserWindow, ipcMain} from "electron";
import * as path from "path";

/* 
  This is so that there are no cyclic dependencies
  global interface is declared in global.d.ts

  This is done before importing anything else to avoid
  it not being defined.
*/
//@ts-ignore
global.__app = {
  isReady: false,
  isRunningElectron: true,
  baseDirectory: !app.isPackaged ? "../src" : "./",
  getWindow: null,
}


import * as database from "./database";
import "./ipc";
import Logger from "./Logger";
import { showBasicMessage } from "./alerts";
import ApplicationError from "./errors/ApplicationError";

database.setup();
const logger = new Logger("main");


let window: BrowserWindow;

/**
 * Creates the electron window
 */
function createWindow(callback: (() => void) | null = null) {
  // Create the browser window
  window = new BrowserWindow({
    show: false,
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '/../src/app/js/preload/main.js'),
    },
    autoHideMenuBar: true,
    maximizable: true,
    backgroundColor: "#222222",
  });

  window.loadFile(path.join(__app.baseDirectory, "/app/views/index.html"));

  // Wait for the window to be ready, once it has THEN show the window 
  window.once('ready-to-show', () => {
    // Show window
    window.show();
    window.webContents.send("app-ready", null);

    // Update the global __app
    __app.isReady = true;
    __app.getWindow = () => {
      return window;
    }

    if (callback)
      callback();
  });
}

// ----- Electron Events -----
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

process.on("uncaughtException", error => {
  logger.log(`CRITICAL UNCAUGHT ERROR: ` + error.message);
  logger.log(`Recreating main window`);

  const oldWindow = __app.getWindow();
  createWindow(() => {
    if (error instanceof ApplicationError) {
      __app.getWindow().webContents.send(`alerts:uncaught_error`, {
        error_code: error.errorCode,
        stack: error.stack,
      });
    } else {
      __app.getWindow().webContents.send(`alerts:unknown_uncaught_error`, {
        message: error.message,
        stack: error.stack,
      });
    }
  });
    
  oldWindow.close();
});